import express from "express";
import {
  registerUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
const userRoutes = express.Router();

userRoutes.post("/registeruser", registerUser);
userRoutes.get("/getallusers", authMiddleware, getAllUsers);
userRoutes.get("/getuserbyid/:id", authMiddleware, getUserById);

export default userRoutes;
