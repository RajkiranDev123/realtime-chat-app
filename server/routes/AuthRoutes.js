import { Router } from "express";

import {
  signup,
  login,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

// Express cannot read multipart/form-data file uploads by itself,
// so multer parses the uploaded file and makes it available as req.file, then Cloudinary
// stores it in the cloud. Normal JSON cannot send files, so we use multipart/form-data.

const authRoutes = Router();

const upload = multer({ dest: "uploads/profiles/" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  // "profile-image" → must match the frontend input name
  // <input type="file" name="profile-image" />
  addProfileImage,
);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);

export default authRoutes;
