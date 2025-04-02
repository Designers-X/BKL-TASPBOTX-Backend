const db = require("../../db/Connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// login admin api
const loginAdminApi = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    const query =
      "SELECT id, password, role FROM users WHERE email = ? AND role = 1";
    const [rows] = await db.execute(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Admin user not found." });
    }
    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password." });
    }
    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const updateQuery = "UPDATE users SET  token = ? WHERE email = ?";
    await db.execute(updateQuery, [token, email]);
    return res.status(200).json({
      status: true,
      message: "Login successful.",
      userId: user.id,
      token: token,
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { loginAdminApi };
