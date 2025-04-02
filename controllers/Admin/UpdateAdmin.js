const db = require("../../db/Connection");
const multer = require("multer");
require("dotenv").config();
// Configure Multer for Profile Picture Uploads
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
const updateUserApi = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: "Error uploading file." });
      }
      const { userId } = req.params;
      const { name, email, oldPassword, newPassword } = req.body;
      let profilePic = req.file ? req.file.filename : null;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }
      const checkUserQuery = "SELECT password FROM users WHERE id = ?";
      const [userRows] = await db.execute(checkUserQuery, [userId]);
      if (userRows.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }
      let updateQuery = "UPDATE users SET";
      let updateParams = [];
      let updateFields = [];
      if (name) {
        updateFields.push("name = ?");
        updateParams.push(name);
      }
      if (email) {
        updateFields.push("email = ?");
        updateParams.push(email);
      }
      if (profilePic) {
        updateFields.push("profile_pic = ?");
        updateParams.push(profilePic);
      }
      if (oldPassword && newPassword) {
        if (userRows[0].password !== oldPassword) {
          return res.status(400).json({ error: "Old password is incorrect." });
        }
        updateFields.push("password = ?");
        updateParams.push(newPassword);
      }
      if (updateFields.length === 0) {
        return res.status(400).json({ error: "No changes provided." });
      }
      updateQuery += ` ${updateFields.join(", ")} WHERE id = ?`;
      updateParams.push(userId);
      await db.execute(updateQuery, updateParams);
      return res.status(200).json({
        message: "User information updated successfully.",
        profilePic: profilePic ? `/uploads/${profilePic}` : null,
      });
    } catch (error) {
      console.error("Error updating user info:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
const getUserInfoApi = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }
    const query = "SELECT id, name, email, profile_pic FROM users WHERE id = ?";
    const [rows] = await db.execute(query, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    let user = rows[0];
    user.profile_pic = user.profile_pic
      ? `http://localhost:5000/uploads/${user.profile_pic}`
      : "http://localhost:5000/uploads/default-avatar.png";

    return res.status(200).json({ status: true, user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { getUserInfoApi, updateUserApi };
