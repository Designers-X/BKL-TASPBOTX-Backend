const db = require("../../db/Connection");
require("dotenv").config();
const chatHistory = async (req, res) => {
  try {
    const { userId, message, prompt } = req.body;

    if (!userId || !message || !prompt) {
      return res
        .status(400)
        .json({ error: "userId, message and prompt are required" });
    }

    const sql =
      "INSERT INTO chat_history (userId, message, prompt, createdAt) VALUES (?, ?, ?, NOW())";
    const [result] = await db.query(sql, [userId, message, prompt]);

    return res.status(200).json({ success: true, insertedId: result.insertId });
  } catch (error) {
    console.error("chatHistory API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// get chat history
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const sql =
      "SELECT * FROM chat_history WHERE userId = ? ORDER BY createdAt ASC";
    const [results] = await db.query(sql, [userId]);

    return res.status(200).json({ success: true, chatHistory: results });
  } catch (error) {
    console.error("getChatHistory API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// delete chat history api
const deleteChatHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const sql = "DELETE FROM chat_history WHERE userId = ?";
    const [result] = await db.query(sql, [userId]);

    return res.status(200).json({
      success: true,
      message: "Chat history deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("deleteChatHistory API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getChatHistory2 = async (req, res) => {
  try {
    const { userId, limit, offset } = req.query;
    const messageLimit = parseInt(limit, 10) || 10;
    const messageOffset = parseInt(offset, 10) || 0;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const sql = `
          SELECT * FROM chat_history 
          WHERE userId = ? 
          ORDER BY createdAt DESC 
          LIMIT ? OFFSET ?
        `;
    const [results] = await db.query(sql, [
      userId,
      messageLimit,
      messageOffset,
    ]);
    if (results.length === 0) {
      return res.status(404).json({ error: "No more messages found" });
    }

    return res.status(200).json({ success: true, chatHistory: results });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  chatHistory,
  getChatHistory,
  deleteChatHistory,
  getChatHistory2,
};
