import express from "express";
import { registerAdmin, getAllAdmins } from "../controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.post("/registerAdmin", registerAdmin);
adminRoutes.get("/getAllAdmins", getAllAdmins);

export default adminRoutes;
