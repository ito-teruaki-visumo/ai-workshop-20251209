/**
 * 認証コントローラー
 */
const User = require("../models/User");
const { validateRegister, validateLogin } = require("../utils/validators");
const {
  sendSuccess,
  sendError,
  sendValidationError,
} = require("../utils/response");
const { ERRORS, MESSAGES } = require("../config/constants");

/**
 * ユーザー登録
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { username, password } = req.body;

    // バリデーション
    const validation = validateRegister({ username, password });
    if (!validation.isValid) {
      return sendValidationError(res, validation.errors);
    }

    // ユーザー名の重複チェック
    const isUsernameTaken = await User.isUsernameTaken(username);
    if (isUsernameTaken) {
      return sendError(res, 409, ERRORS.USERNAME_EXISTS);
    }

    // ユーザー作成
    const user = await User.create(username, password);

    // レスポンス
    sendSuccess(res, 201, {
      id: user.id,
      username: user.username,
      message: MESSAGES.REGISTER_SUCCESS,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ユーザーログイン
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    // バリデーション
    const validation = validateLogin({ username, password });
    if (!validation.isValid) {
      return sendValidationError(res, validation.errors);
    }

    // ユーザー検索
    const user = await User.findByUsername(username);
    if (!user) {
      return sendError(res, 401, ERRORS.INVALID_CREDENTIALS);
    }

    // パスワード検証
    const isValidPassword = await User.verifyPassword(
      password,
      user.password_hash
    );
    if (!isValidPassword) {
      return sendError(res, 401, ERRORS.INVALID_CREDENTIALS);
    }

    // セッションにユーザー情報を保存
    req.session.userId = user.id;
    req.session.username = user.username;

    // レスポンス
    sendSuccess(res, 200, {
      id: user.id,
      username: user.username,
      message: MESSAGES.LOGIN_SUCCESS,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ユーザーログアウト
 * POST /api/auth/logout
 */
async function logout(req, res, next) {
  try {
    // セッション破棄
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return sendError(res, 500, ERRORS.SERVER_ERROR);
      }

      // Cookieをクリア
      res.clearCookie("connect.sid");

      sendSuccess(res, 200, {
        message: MESSAGES.LOGOUT_SUCCESS,
      });
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
};
