/**
 * タスクルート
 */
const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");
const { authenticateUser } = require("../middleware/auth");

// すべてのタスクルートに認証を適用
router.use(authenticateUser);

// GET /api/tasks - タスク一覧取得
router.get("/", tasksController.getTasks);

// POST /api/tasks - タスク新規登録
router.post("/", tasksController.createTask);

// PATCH /api/tasks/:id - タスク更新
router.patch("/:id", tasksController.updateTask);

// DELETE /api/tasks/:id - タスク削除
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
