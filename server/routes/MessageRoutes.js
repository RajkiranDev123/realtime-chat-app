import { Router } from "express";

import { getMessages, uploadFile } from "../controllers/MessageController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

import multer from "multer";

const messageRoutes = Router();

const upload = multer({ dest: "uploads/files" });

messageRoutes.post("/get-messages", verifyToken, getMessages);

messageRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile,
);

export default messageRoutes;

// REST API conventions :

// messageRoutes.get("/", verifyToken, getMessages);

// messageRoutes.post(
//   "/attachments",
//   verifyToken,
//   upload.single("file"),
//   uploadFile
// );


// GET  /api/v1/messages
// POST /api/v1/messages/attachments
