require("../utils/load_env");
const mysql = require("mysql2");

// Extract DB_NAME from env
const { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

if (!DB_NAME) {
  console.error("DB_NAME is not defined in .env");
  process.exit(1);
}

// Create a connection to MySQL without selecting a DB
const connection = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT || 3306,
  user: DB_USER,
  password: DB_PASSWORD,
});

connection.connect((err) => {
  if (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }

  connection.query(`SHOW DATABASES LIKE ?`, [DB_NAME], (err, results) => {
    if (err) {
      console.error("Query failed:", err.message);
      connection.end();
      process.exit(1);
    }

    if (results.length === 0) {
      // DB does not exist — create it
      connection.query(`CREATE DATABASE \`${DB_NAME}\``, (err) => {
        if (err) {
          console.error("Failed to create database:", err.message);
          connection.end();
          process.exit(1);
        }

        console.log(`Database "${DB_NAME}" created successfully.`);
        connection.end();
        process.exit(0);
      });
    } else {
      console.log(`Database "${DB_NAME}" already exists.`);
      connection.end();
      process.exit(0);
    }
  });
});
