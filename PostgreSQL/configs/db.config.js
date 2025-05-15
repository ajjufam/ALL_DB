const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") }); // its needed for run table creation file

const pool = new Pool({
  connectionString: process.env.DB_URI,
});

pool
  .query("SELECT NOW()")
  .then(() => console.log(`PG DB connected successfully`))
  .catch((err) => console.log(err));

module.exports = pool;
