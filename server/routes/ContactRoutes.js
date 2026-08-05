import { Router } from "express";

import {
  searchContacts,
  getContactsForDMList,
  getAllContacts,
} from "../controllers/ContactController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);
contactRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList);
contactRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

export default contactRoutes;

// Recommended , REST API conventions :

// contactRoutes.post("/search", verifyToken, searchContacts);
// contactRoutes.get("/dm", verifyToken, getContactsForDMList);
// contactRoutes.get("/", verifyToken, getAllContacts);
