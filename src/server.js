import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
// Import routes

import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/productsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sahaj Backend API" });
});

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8081","http://192.168.215.43"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
