import mongoose from "mongoose";
import { hash, genSalt } from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    image: {
      type: String,
    },
    color: {
      type: Number,
    },
    profileSetup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

// A document is an instance of a Mongoose model, and the model is built from a schema
const User = mongoose.model("User", userSchema);
export default User;

// All requests (GET, POST, etc.) go through the Model
// Schema is used at runtime indirectly, through the Model. But you never call schema directly.

// Request (GET / POST)
//         ↓
// Controller / Route
//         ↓
// Model (User.find, User.create, etc.)
//         ↓
// Schema (rules, validation, middleware applied)
//         ↓
// MongoDB
