// express , dotenv , cors , cookieParser , mongoose
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

import rateLimit from "express-rate-limit";
import helmet from "helmet";

import morgan from "morgan"; // morgan generates logs and winston stores.
import fs from "fs";

import logger from "./utils/logger.js";
import connectDB from "./db/connectDB.js";
import setupSocket from "./socket.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

// Env validation
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing.");
  process.exit(1); // It stops the program immediately, but indicates a error exit instead of an successful exit.
}

// create folder :
// existsSync : checks synchronously whether a file or folder exists.
// mkdirSync  : create a directory/folder synchronously.

if (!fs.existsSync("logs")) {
  // !fs.existsSync("logs.txt") // for file
  fs.mkdirSync("logs"); // fs.writeFileSync("logs.txt", "") // for file
}

// RIGHT HERE (just before sending response), rate limiter adds headers :
// RateLimit-Limit: 100 , RateLimit-Remaining: 99 , RateLimit-Reset: 60 ==> tells the client : Wait 60 seconds before the rate limit resets.

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

// its a Morgan → Winston bridge

const stream = {
  write: (message) => logger.info(message.trim()),
};

// Morgan generates log → stream.write() : Winston stores it in log file.

// Middlewares starts

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),

  // same-origin (default) :	Only the same origin can access the resource.
  // cross-origin	: Any origin can ascess the resource.
  // Helmet only modifies the HTTP response by adding security headers.
);

app.use(
  cors({
    origin: process.env.ORIGIN, // Can this origin TALK to backend?
    credentials: true, // Allow the browser to send credentials like cookies etc.
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use(limiter);

// combined : it’s an Apache-style access log, which is a plain text format with spaces as separators.

app.use(morgan("combined", { stream }));

// request : it captures ==> HTTP method , URL , IP address , User-Agent (browser info) , Request time
// response : Status code , Response time , Response completion info

// { stream } → don’t print to console , instead call stream.write()

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

// This tells Express.js : When someone visits ==> /uploads/profiles/filename.ext , send files from the uploads/profiles folder.

// image : "http://localhost:5000/uploads/profiles/1778140869800login2.png"

app.use(cookieParser()); // It parses cookies from the request and makes them available in req.cookies.
app.use(express.json()); // It parses incoming JSON request bodies and makes data available in req.body.
// req.params , req.query , req.headers

// custom performance tracking using Winston directly

app.use((req, res, next) => {
  const start = Date.now(); // 1716800000000
  // console.log(new Date(start)); // human readable , string representation of the Date object , js internally calls : .toString()

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

// Middleware function runs before route , finish callback ==> runs after response is sent & next() is what moves request forward

//Routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/channel", channelRoutes);

app.get("/api/v1/health", (req, res) => {
  // http://localhost:8080/api/v1/health
  res.send("API is running...");
});

//Routes end

// DB + Server start
const startServer = async () => {
  // console.log(process.pid); // pid is the unique number given by the operating system to a running program.
  // the operating system gives new pid to Node.js , every time you start a new Node process
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on ${process.env.BACKEND_URL}${PORT}`);
  });

  // So even though you never explicitly imported the http module, 
  // server is still a Node.js HTTP server under the hood, and that's exactly what Socket.IO needs.

  setupSocket(server);
  // setupSocket(server) simply connects Socket.IO to the HTTP server created by app.listen(),
  // allowing your Express routes and real-time Socket.IO connections to share the same server and port.
  // HTTP server = railway station
  // Express = platform for API trains
  // Socket.IO = platform for realtime trains
  // Add another platform to same station
};

startServer();

// Graceful shutdown ==>
// SIGINT is usually sent by the operating system when the user interrupts a program.
// SIGINT (Signal Interrupt) is a signal sent to your Node.js app when you try to stop it manually.
// SIGINT = signal sent when you press Ctrl + C , it triggers SIGINT

process.on("SIGINT", async () => {
  // process.on() in Node.js is used to listen for events from the Node process ==> process.on(eventName, callback)

  console.log("SIGINT received... shutting down.");

  try {
    await mongoose.disconnect();
    console.log("DB connection closed.");
  } catch (err) {
    console.log("DB close error : ", err.message);
  }

  process.exit(0); // 0 → successful exit
});
