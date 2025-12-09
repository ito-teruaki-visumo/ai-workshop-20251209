/**
 * TODO アプリケーション - メインアプリケーション
 */
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const helmet = require("helmet");

const { testConnection, initializeDatabase } = require("./config/database");
const { SESSION } = require("./config/constants");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

// ルートのインポート
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// セキュリティミドルウェア
app.use(helmet());

// JSONパーサー
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// セッション設定
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // 本番環境ではHTTPSが必要
      httpOnly: true,
      maxAge: SESSION.MAX_AGE,
      sameSite: "strict",
    },
  })
);

// ルートの設定
app.use("/api/auth", authRoutes);

// ヘルスチェック
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404ハンドラー
app.use(notFoundHandler);

// エラーハンドラー
app.use(errorHandler);

// アプリケーション起動
async function startServer() {
  try {
    // データベース接続テスト
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("Failed to connect to database. Exiting...");
      process.exit(1);
    }

    // データベース初期化（テーブル作成）
    await initializeDatabase();

    // サーバー起動
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
