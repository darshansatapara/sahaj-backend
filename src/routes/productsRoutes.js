import express from "express";
import {
  createProduct,
  getAllProducts,
} from "../controllers/productController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
const productRoutes = express.Router();

productRoutes.post("/createproduct", createProduct);
productRoutes.get("/getallproducts", authMiddleware, getAllProducts);

export default productRoutes;
