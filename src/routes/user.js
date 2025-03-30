import express from "express";
import {
  registerUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/registeruser", registerUser);
userRoutes.get("/getallusers", getAllUsers);
userRoutes.get("/getuserbyid/:id", getUserById);

export default userRoutes;
