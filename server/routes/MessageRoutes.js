import { Router } from "express";

import { getMessages } from "../controllers/MessageController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const messageRoutes = Router();

messageRoutes.post("/get-messages", verifyToken, getMessages);

export default messageRoutes;
