import pool from "../config/database.js";
import bcrypt from "bcrypt";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, hashedPassword]
    );

    res
      .status(201)
      .json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, email, phone, created_at FROM users"
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, name, email, phone, created_at FROM users WHERE id = $1",
      [req.params.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
