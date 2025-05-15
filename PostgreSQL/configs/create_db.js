const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" }); // need to mention .env path

// Extract DB name from DB_URI
const dbUri = process.env.DB_URI;
console.log(dbUri);

const dbName = dbUri.split("/").pop(); // e.g., "ALL_DB_PG"

if (!dbName) {
  console.error("Database name not found in DB_URI.");
  process.exit(1);
}

// Connect to default 'postgres' DB
const pool = new Pool({
  connectionString: process.env.DB_URI.replace(/\/[^/]+$/, "/postgres"),
});

pool
  .query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName])
  .then((res) => {
    if (res.rowCount === 0) {
      return pool.query(`CREATE DATABASE "${dbName}"`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
      process.exit(0);
    }
  })
  .then(() => {
    console.log(`Database "${dbName}" created successfully.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
