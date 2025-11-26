const mysql = require('mysql2');
require('dotenv').config();

// Connection pool létrehozása connection helyett
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
});

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.execute(sql, params, (error, results) => {
      if (error) {
        console.error("Database query error:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing database pool...');
  pool.end(() => {
    console.log('Database pool closed.');
    process.exit(0);
  });
});

module.exports = { query };