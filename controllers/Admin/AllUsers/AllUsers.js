const db = require("../../../db/Connection");

// Get all users with role = NULL
const getAllUsers = async (req, res) => {
  try {
    const query = "SELECT id, name, email, profile_pic FROM users WHERE role IS NULL";
    const [rows] = await db.execute(query);

    return res.status(200).json({ status: true, users: rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// Delete user by userId
const deleteUserApi = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }
  
      // Check if the user exists
      const checkQuery = "SELECT id FROM users WHERE id = ?";
      const [user] = await db.execute(checkQuery, [userId]);
  
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Delete user
      const deleteQuery = "DELETE FROM users WHERE id = ?";
      await db.execute(deleteQuery, [userId]);
  
      return res.status(200).json({ status: true, message: "User deleted successfully." });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
module.exports = { getAllUsers, deleteUserApi };  