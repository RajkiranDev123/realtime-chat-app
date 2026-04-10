import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import rateLimit from "express-rate-limit";
//
import morgan from "morgan";
import fs from "fs";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

// logs folder and files
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const stream = {
  write: (message) => logger.info(message.trim()),
}; // SENDS logs to Winston

// Middlewares
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

app.use(limiter);

app.use(morgan("combined", { stream })); // captures: HTTP method , URL , Status , Response time , IP address

app.use(cookieParser()); //It parses cookies from the request and makes them available in req.cookies.
app.use(express.json()); //It parses incoming JSON request bodies and makes data available in req.body.

// custom performance tracking using Winston directly
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
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

// end of custom performance tracking using Winston directly

//Routes
app.use("/api/v1/auth", authRoutes);


app.get("/api/health", (req, res) => {
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
// SIGINT = signal sent when you press Ctrl + C
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("DB connection closed");
  process.exit(0); // success exit
});
