import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/AuthRoutes.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import morgan from "morgan";
import fs from "fs";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Env validation
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

// create folder :
// existsSync : checks synchronously whether a file or folder exists.
// mkdirSync  : create a directory synchronously.

if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

// RIGHT HERE (just before sending response), rate limiter adds headers:
// RateLimit-Limit: 100 , RateLimit-Remaining: 99 , RateLimit-Reset: 60

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limits each IP to 100 requests/min
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Morgan → Winston bridge
const stream = {
  write: (message) => logger.info(message.trim()),
};
// Morgan generates log → stream.write() → Winston stores it in log file.

// Middlewares starts
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, //Can frontend DISPLAY backend resources?
  }),
);
// “Helmet = adds protective headers to every HTTP response”
// a request is coming from a different domain / origin than your server.
// 

app.use(
  cors({
    origin: process.env.ORIGIN, // Can frontend TALK to backend?
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }),
);

app.use(limiter);

// combined : it’s an Apache-style access log, which is a plain text format with spaces as separators.
app.use(morgan("combined", { stream })); // captures: HTTP method , URL , Status , Response time , IP address
// { stream } → don’t print to console , instead call stream.write(...)

app.use("/uploads/profiles", express.static("uploads/profiles"));

// This tells Express.js : “When someone visits /uploads/profiles/..., send files from the uploads/profiles folder.”
// http://localhost:5000/uploads/profiles/cat.png
// image : "uploads/profiles/1778140869800login2.png"

app.use(cookieParser()); //It parses cookies from the request and makes them available in req.cookies.
app.use(express.json()); //It parses incoming JSON request bodies and makes data available in req.body.

// custom performance tracking using Winston directly
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    // "finish" fires when response is fully sent to client
    logger.info("API_METRICS", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
      ip: req.ip,
    });
  });

  next();
});
// Middleware function runs before route , finish callback runs after response is sent & next() is what moves request forward

// end of custom performance tracking using Winston directly

//Routes
app.use("/api/v1/auth", authRoutes);

app.get("/api/v1/health", (req, res) => {
  res.send("API is running...");
});

//Routes end

// DB + Server start
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("DB Connected!");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err.message));

// Graceful shutdown
// SIGINT (Signal Interrupt) is a signal sent to your Node.js app when you try to stop it manually.
// SIGINT = signal sent when you press Ctrl + C , it triggers SIGINT
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("DB connection closed");
  process.exit(0); // success exit
});
