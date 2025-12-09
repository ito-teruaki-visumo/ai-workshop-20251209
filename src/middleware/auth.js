/**
 * 認証ミドルウェア
 */
const { ERRORS } = require("../config/constants");
const { sendError } = require("../utils/response");

/**
 * ユーザー認証を確認するミドルウェア
 * セッションにuserIdが存在しない場合、401エラーを返す
 */
function authenticateUser(req, res, next) {
  if (!req.session || !req.session.userId) {
    return sendError(res, 401, ERRORS.AUTH_REQUIRED);
  }
  next();
}

module.exports = {
  authenticateUser,
};
