import { compare } from "bcrypt"; // hash, genSalt , compare ==> bcrypt
import User from "../models/UserModel.js";

import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: "3d" });
};

////////////////////////////// signup /////////////////////////////

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }
    const user = await User.create({
      email,
      password,
    });
    // res.cookie(name, value, options);
    // small data stored in browser that is automatically sent to the server with every request
    res.cookie("jwt", createToken(email, user._id), {
      httpOnly: true, // JS (frontend) cannot access cookie
      maxAge,
      secure: true, // cookie will only be sent over HTTPS.
      sameSite: "none", // cookie can be sent in cross-site requests
      // "strict" → safest , "lax" → balanced (commonly used) , "none" → requires secure: true
      // “Allow cross-site cookie, but only over encrypted connection (https)”
      //  secure: false, sameSite: "lax" ==> dev
      //  prod ==>   secure: true , sameSite: "none",
    });
    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
      message: "Account Created. Setup your profile now.",
      success: true,
    });
  } catch (error) {
    console.log("catch block of signup ==>", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

/////////////////////////////// login ///////////////////

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with given email not found. Create an account now.",
      });
    }
    const comparePassword = await compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Password is not correct.",
      });
    }
    res.cookie("jwt", createToken(email, user._id), {
      httpOnly: true,
      maxAge,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
      success: true,
    });
    // undefined fields are automatically removed in JSON (response) : "firstName": undefined,
    // null and "" (empty string) included in JSON
  } catch (error) {
    console.log("catch block of login ==>", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

/////////////////////////////// getUserInfo ///////////////////

export const getUserInfo = async (req, res) => {
  // req.userId = payload.userId;
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User with given id not found.",
      });
    }
    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      //
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log("catch block of user info ==>", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

//////////////////// updateProfile /////////////////////////////////

export const updateProfile = async (req, res) => {
  // req.userId = payload.userId;
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "firstName , lastName and color is required.",
      });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      //
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

///////////// addProfileImage ///////////////////////////////

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
        success: false,
      });
    }

    const date = Date.now(); // machine format
    // console.log(new Date(Date.now())); // readable date object
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    console.log(fileName);
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        image: fileName,
      },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

////////// removeProfileImage ////////////////

export const removeProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.image) {
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();

    return res.status(200).json({
      message: "Profile image removed.",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////

// | Method       | Argument Type        | Returns                   |
// | ------------ | -------------------- | ------------------------- |
// | `find()`     | Object (filter)      | Array of documents or []  |
// | `findOne()`  | Object (filter)      | Single document or `null` |
// | `findById()` | ID (string/ObjectId) | Single document or `null` |
