/**
 * 認証ルート
 */
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateUser } = require("../middleware/auth");

// POST /api/auth/register - ユーザー登録
router.post("/register", authController.register);

// POST /api/auth/login - ユーザーログイン
router.post("/login", authController.login);

// POST /api/auth/logout - ユーザーログアウト（認証必要）
router.post("/logout", authenticateUser, authController.logout);

module.exports = router;
