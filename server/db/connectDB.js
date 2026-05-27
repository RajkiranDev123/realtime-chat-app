import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing in environment variables.");
    }

    await mongoose.connect(process.env.DATABASE_URL);

    console.log("DB Connected!");
  } catch (err) {
    console.log("DB connection failed : ", err.message);
    process.exit(1);
  }
};

export default connectDB;
