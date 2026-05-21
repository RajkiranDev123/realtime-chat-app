import Message from "../models/MessageModel.js";
import { mkdirSync } from "fs";

export const getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).json({
        success: false,
        message: "Both user id's are required",
      });
    }
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ createdAt: 1 });
    return res.status(200).json({
      messages,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const uploadfile = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
