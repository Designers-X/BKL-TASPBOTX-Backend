const db = require("../../db/Connection");
const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
const otpStore = {};
const requestOtpApi = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email)
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const query = "SELECT id FROM users WHERE email = ? AND role = 1";
    const [rows] = await db.execute(query, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Admin not found." });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, expiresAt: Date.now() + 300000 }; 
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// **2. Verify OTP**
const verifyadminOtpApi = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }
    if (!otpStore[email] || otpStore[email].otp !== parseInt(otp)) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }
    delete otpStore[email]; 

    return res.status(200).json({ message: "OTP verified. You can now reset your password." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// **3. Reset Password**
const resetPasswordApi = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required." });
    }
    const updateQuery = "UPDATE users SET password = ? WHERE email = ? AND role = 1";
    await db.execute(updateQuery, [newPassword, email]);

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {  requestOtpApi, verifyadminOtpApi, resetPasswordApi };
