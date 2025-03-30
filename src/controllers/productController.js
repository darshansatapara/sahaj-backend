import pool from "../config/database.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, price, weight } = req.body;

    if (!name || !price || isNaN(price)) {
      return res
        .status(400)
        .json({ error: "Valid name and price are required" });
    }

    const result = await pool.query(
      "INSERT INTO products (name, weight,price) VALUES ($1, $2,$3) RETURNING *",
      [name, price, weight]
    );

    res.status(201).json({
      message: "Product created successfully",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT id, name,weight, price, created_at FROM products"
    );
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
