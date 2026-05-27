import mongoose from "mongoose";
import { hash, genSalt } from "bcrypt"; // hash, genSalt , compare ==> bcrypt

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

userSchema.pre("save", async function () {
  // async : So is it blocking or non-blocking
  // Node.js level : Not blocking (good) , event loop can handle other requests
  // Mongoose flow level : Still sequential , save waits for pre hook to finish
  if (!this.isModified("password")) return;

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

// A document is an instance of a Mongoose model, and the model is built from ==> schema
const User = mongoose.model("User", userSchema);
export default User;

// Because mongoose.model is not a class/constructor. It is just a function. (no new keyword)

// All requests (GET, POST, etc...) go through the Model
// Schema is used at runtime indirectly through the Model. But you never call schema directly.

// Request (GET / POST) => Controller =>  Model (User.find, User.create, etc...) => Schema (rules, validation, middleware applied) => MongoDB

// You must set values manually.
// class User {}
// const u1 = new User();
// u1.name = "RJ";
// u1.age = 22;

// Now object gets values automatically during creation ==> make object creation easier and cleaner
// User is the class name, but it is also the constructor function used with new
// class User {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }
// }

// const u1 = new User("RJ", 22);
