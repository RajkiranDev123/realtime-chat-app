import { compare } from "bcrypt";
import User from "../models/UserModel.js";

import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: "3d" });
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
        // data: data
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
    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
      secure: true, // cookie will only be sent over HTTPS.
      sameSite: "None", // cookie can be sent in cross-site requests
      // Browsers require secure: true when sameSite is "None". Otherwise, the cookie will be rejected.
    });
    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
      message: "Account Created.",
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
        // data: data
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with given email not found.",
      });
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).json({
        success: false,
        message: "Password is not correct..",
      });
    }
    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
      secure: true,
      sameSite: "None",
      // Server sets cookie attributes (secure, sameSite, maxAge).
      // Browser enforces them when deciding whether to store/send the cookie.
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
    // undefined fields are automatically removed in JSON : "firstName": undefined,
    // null and "" (empty string) included in JSON
  } catch (error) {
    console.log("catch block of login ==>", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

/////////////////////////////// user info ///////////////////

export const getUserInfo = async (req, res) => {
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
