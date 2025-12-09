/**
 * データベース初期化スクリプト
 * npm run db:init で実行
 */
require("dotenv").config();

const { initializeDatabase, pool } = require("../config/database");

async function main() {
  try {
    console.log("Initializing database...");
    await initializeDatabase();
    console.log("Database initialization completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
