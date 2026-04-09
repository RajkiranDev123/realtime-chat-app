import User from "../models/UserModel.js";

import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: "3d" });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
        // data: data
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
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

///////////////////////////////


