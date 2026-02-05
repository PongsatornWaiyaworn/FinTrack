const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

db.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

module.exports = { db };
