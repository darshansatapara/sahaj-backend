import pool from "../config/database.js";
import bcrypt from "bcrypt";

// register admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingAdmin = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );
    if (existingAdmin.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Admin registered successfully",
      admin: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get All admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await pool.query(
      "SELECT id, name, email, created_at FROM admins"
    );
    res.json(admins.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
