const fs = require("fs");
const path = require("path");
const connection = require("./db"); // your mysql2 (callback-based) connection
const tableDir = path.join(__dirname, "../tableSchemas");

// Helper to promisify mysql2 query
const queryAsync = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const initTables = async () => {
  try {
    const files = fs.readdirSync(tableDir);

    for (const file of files) {
      const schema = require(path.join(tableDir, file));
      await queryAsync(schema);
      console.log(`Table from ${file} ensured`);
    }

    console.log("All tables ensured.");
    connection.end();
  } catch (error) {
    console.error("Error initializing tables:", error.message);
    connection.end();
    process.exit(1);
  }
};

initTables();
