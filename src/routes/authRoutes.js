import express from "express";
import {
  register,
  login,
  getUserProfile,
  auth,
  logout,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/profile", getUserProfile);
authRoutes.get("/me", authMiddleware, auth);

export default authRoutes;
