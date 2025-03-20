const db = require("../../db/Connection");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();

const BASE_URL = "http://localhost:5000/uploads/"; // Base URL for image access

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("profilePic");

// Signup API for Admin
const signupAdminApi = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: "Error uploading file." });
      }

      const { name, email, password } = req.body;
      let profilePic = req.file ? req.file.filename : null;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
      }

      // Check if email already exists
      const checkQuery = "SELECT id FROM users WHERE email = ?";
      const [existingUser] = await db.execute(checkQuery, [email]);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: "Email already in use." });
      }

      // Default role: Admin
      const role = 1;

      // Store only the filename in the database
      const insertQuery =
        "INSERT INTO users (name, email, password, profile_pic, role) VALUES (?, ?, ?, ?, ?)";
      const [result] = await db.execute(insertQuery, [
        name,
        email,
        password, 
        profilePic,
        role,
      ]);

      // Generate JWT Token
      const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(201).json({
        status: true,
        message: "Signup successful.",
        userId: result.insertId,
        token,
        profilePic: profilePic ? `${BASE_URL}${profilePic}` : null, // Return full image URL
      });
    } catch (error) {
      console.error("Error during admin signup:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

module.exports = { signupAdminApi };
