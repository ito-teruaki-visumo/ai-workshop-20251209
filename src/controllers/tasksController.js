/**
 * タスクコントローラー
 */
const Task = require("../models/Task");
const {
  validateCreateTask,
  validateUpdateTask,
} = require("../utils/validators");
const {
  sendSuccess,
  sendError,
  sendValidationError,
} = require("../utils/response");
const { ERRORS, MESSAGES } = require("../config/constants");

/**
 * タスク一覧取得
 * GET /api/tasks
 */
async function getTasks(req, res, next) {
  try {
    const userId = req.session.userId;
    const { status, search, sort } = req.query;

    // タスク一覧を取得
    const tasks = await Task.findByUserId(userId, { status, search, sort });

    // 統計情報を取得
    const stats = await Task.getStats(userId);

    sendSuccess(res, 200, {
      data: tasks,
      total: stats.total,
      completed_count: stats.completed_count,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * タスク新規登録
 * POST /api/tasks
 */
async function createTask(req, res, next) {
  try {
    const userId = req.session.userId;
    const { title } = req.body;

    // バリデーション
    const validation = validateCreateTask({ title });
    if (!validation.isValid) {
      return sendValidationError(res, validation.errors);
    }

    // タスク作成
    const task = await Task.create(userId, title);

    sendSuccess(res, 201, {
      ...task,
      message: MESSAGES.TASK_CREATED,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * タスク更新
 * PATCH /api/tasks/:id
 */
async function updateTask(req, res, next) {
  try {
    const userId = req.session.userId;
    const taskId = parseInt(req.params.id, 10);
    const { title, is_completed } = req.body;

    // IDが有効な数値かチェック
    if (isNaN(taskId)) {
      return sendError(res, 404, ERRORS.TASK_NOT_FOUND);
    }

    // バリデーション
    const validation = validateUpdateTask({ title, is_completed });
    if (!validation.isValid) {
      return sendValidationError(res, validation.errors);
    }

    // タスク更新
    const task = await Task.update(taskId, userId, { title, is_completed });

    if (!task) {
      return sendError(res, 404, ERRORS.TASK_NOT_FOUND);
    }

    sendSuccess(res, 200, {
      ...task,
      message: MESSAGES.TASK_UPDATED,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * タスク削除
 * DELETE /api/tasks/:id
 */
async function deleteTask(req, res, next) {
  try {
    const userId = req.session.userId;
    const taskId = parseInt(req.params.id, 10);

    // IDが有効な数値かチェック
    if (isNaN(taskId)) {
      return sendError(res, 404, ERRORS.TASK_NOT_FOUND);
    }

    // タスク削除
    const deleted = await Task.delete(taskId, userId);

    if (!deleted) {
      return sendError(res, 404, ERRORS.TASK_NOT_FOUND);
    }

    // 204 No Content
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
