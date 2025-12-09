/**
 * データベース接続設定
 */
const mysql = require("mysql2/promise");

// 環境変数から設定を読み込み
const config = {
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const databaseName = process.env.DB_NAME || "todo_app";

// コネクションプール（初期化後に設定）
let pool = null;

/**
 * データベース接続のテスト
 */
async function testConnection() {
  try {
    const connection = await mysql.createConnection(config);
    console.log("Database connection established successfully");
    await connection.end();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
}

/**
 * データベースを初期化（テーブル作成）
 */
async function initializeDatabase() {
  const connection = await mysql.createConnection(config);

  try {
    // データベース作成（存在しない場合）
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    await connection.query(`USE \`${databaseName}\``);

    // users テーブル作成
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE COMMENT 'ユーザー名',
        password_hash VARCHAR(255) NOT NULL COMMENT 'パスワードハッシュ値',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // tasks テーブル作成
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL COMMENT 'ユーザーID（外部キー）',
        title VARCHAR(255) NOT NULL COMMENT 'タスク名',
        is_completed BOOLEAN DEFAULT FALSE COMMENT '完了フラグ',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log("Database tables initialized successfully");

    // プールを作成（データベース名を含む）
    pool = mysql.createPool({
      ...config,
      database: databaseName,
    });

    return true;
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

/**
 * コネクションプールを取得
 */
function getPool() {
  if (!pool) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return pool;
}

module.exports = {
  get pool() {
    return getPool();
  },
  testConnection,
  initializeDatabase,
};
