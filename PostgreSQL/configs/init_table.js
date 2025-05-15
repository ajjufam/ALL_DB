const fs = require("fs");
const path = require("path");
const pool = require("../configs/db.config");

const tableDir = path.join(__dirname, "../tableSchemas");

const initTables = async () => {
  try {
    const files = fs.readdirSync(tableDir);

    for (const file of files) {
      const schema = require(path.join(tableDir, file));
      await pool.query(schema);
      console.log(`Table from ${file} ensured`);
    }

    console.log("All tables ensured");
  } catch (error) {
    console.error("Error initializing tables:", error.message);
    process.exit(1);
  }
};

initTables();
