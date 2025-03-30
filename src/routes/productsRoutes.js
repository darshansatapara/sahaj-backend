import express from "express";
import {
  createProduct,
  getAllProducts,
} from "../controllers/productController.js";

const productRoutes = express.Router();

productRoutes.post("/createproduct", createProduct);
productRoutes.get("/getallproducts", getAllProducts);

export default productRoutes;
