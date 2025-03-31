import express from "express";
import { registerAdmin, getAllAdmins } from "../controllers/adminController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
const adminRoutes = express.Router();

adminRoutes.post("/registerAdmin", registerAdmin);
adminRoutes.get("/getAllAdmins", authMiddleware, getAllAdmins);

export default adminRoutes;
