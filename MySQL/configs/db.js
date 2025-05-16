require("../utils/load_env");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

// export conncetion as promise so that we can use await in db operation
module.exports = connection.promise();
