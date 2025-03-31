// db/Connection.js
const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "tasp_database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();
module.exports = pool;
