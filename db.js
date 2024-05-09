// db.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
//     waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   ssl: {
//     rejectUnauthorized: false,
//   },
//   // Add this option to fix "Public Key Retrieval is not allowed" error
//   enablePublicKeyRetrieval: true

// }
});

module.exports = pool.promise();
