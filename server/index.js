import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

// Middleware
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

app.use(cookieParser()); //It parses cookies from the request and makes them available in req.cookies.
app.use(express.json()); //It parses incoming JSON request bodies and makes data available in req.body.

app.use("/api/v1/auth",authRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.send("API is running...");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

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
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("DB connection closed");
  process.exit(0); // success exit
});
