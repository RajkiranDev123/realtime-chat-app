import Message from "../models/MessageModel.js";
import { unlinkSync, renameSync } from "fs";
import cloudinary from "../config/cloudinary.js";

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

export const uploadFile = async (req, res) => {
  let fileName;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
      });
    }

    const date = Date.now();

    fileName = `uploads/files/${date}${req.file.originalname}`;

    renameSync(req.file.path, fileName);

    const result = await cloudinary.uploader.upload(fileName, {
      folder: "files_upload",
    });

    return res.status(200).json({
      success: true,
      filePath: result.secure_url,
      filePublicId: result.public_id,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  } finally {
    if (fileName) {
      try {
        unlinkSync(fileName);
      } catch (err) {
        console.log("File cleanup error:", err.message);
      }
    }
  }
};
