import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// generate JWT token
const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// register user
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, created_at",
      [name, email, phone, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.email, "user");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Login User (User/Admin)
export const login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email and password." });
    }

    const isAdminEmail = email.includes("@egniol.com");
    let user;
    let role;

    if (isAdminEmail) {
      const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
        email,
      ]);
      if (result.rows.length === 0) {
        return res.status(400).json({ error: "Invalid credentials." });
      }
      user = result.rows[0];
      role = "admin";
    } else {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (result.rows.length === 0) {
        return res.status(400).json({ error: "Invalid credentials." });
      }
      user = result.rows[0];
      role = "user";
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const token = generateToken(user.id, user.email, role);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    return res.json({
      message: "Login successful",
      role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// logout User
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
};

// get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.user.id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const auth = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);

    let user;
    let role = req.user.role;

    if (req.user.role === "admin") {
      user = await pool.query(
        "SELECT id, name, email FROM admins WHERE id = $1",
        [req.user.id]
      );
    } else {
      user = await pool.query(
        "SELECT id, name, email FROM users WHERE id = $1",
        [req.user.id]
      );
    }

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ ...user.rows[0], role });
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
