// db/Connection.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: 'localhost',
  user: 'taspbot',
  password: 'DsXdeV@!575c',
  database: 'Tasp_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
