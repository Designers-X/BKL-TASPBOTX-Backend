const db = require("../../db/Connection");
const { sendOTP } = require("../../utils/mailer");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
// sing up api for chat bot
const signUpApi = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res
        .status(400)
        .json({ error: "All fields (name, email) are required." });
    }
    const query = "INSERT INTO users (name, email) VALUES (?, ?)";
    const [result] = await db.execute(query, [name, email]);

    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // await sendOTP(email, otp);
    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// login api for chat bot
const loginApi = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const findUserQuery = "SELECT id FROM users WHERE email = ?";
    const [rows] = await db.execute(findUserQuery, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const updateOtpQuery = "UPDATE users SET otp = ? WHERE email = ?";
    await db.execute(updateOtpQuery, [otp, email]);
    await sendOTP(email, otp);
    return res.status(200).json({
      status: true,
      message: "OTP sent to your email.",
      email: email,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// verify  otp api
const verifyOtpApi = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }
    const findUserQuery = "SELECT id, otp FROM users WHERE email = ?";
    const [rows] = await db.execute(findUserQuery, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = rows[0];
    if (user.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP." });
    }
    const sessionId = uuidv4();

    const token = jwt.sign(
      { id: user.id, email, sessionId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const updateQuery =
      "UPDATE users SET otp = '', session_id = ?, token = ? WHERE email = ?";
    await db.execute(updateQuery, [sessionId, token, email]);

    return res.status(200).json({
      status: true,
      message: "OTP verified. Login successful.",
      userId: user.id,
      sessionId: sessionId,
      token: token,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// resend OTP api
const resendOtpApi = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const findUserQuery = "SELECT id FROM users WHERE email = ?";
    const [rows] = await db.execute(findUserQuery, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const updateOtpQuery = "UPDATE users SET otp = ? WHERE email = ?";
    await db.execute(updateOtpQuery, [otp, email]);

    await sendOTP(email, otp);

    return res.status(200).json({
      status: true,
      message: "OTP re-sent to your email.",
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { signUpApi, loginApi, verifyOtpApi, resendOtpApi };
