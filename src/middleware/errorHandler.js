/**
 * エラーハンドリングミドルウェア
 */
const { ERRORS } = require("../config/constants");

/**
 * 404エラーハンドラー
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: "リソースが見つかりません",
    path: req.path,
  });
}

/**
 * グローバルエラーハンドラー
 */
function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  // MySQL重複エントリエラー
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      error: ERRORS.USERNAME_EXISTS,
    });
  }

  // その他のエラー
  const statusCode = err.statusCode || 500;
  const message = err.message || ERRORS.SERVER_ERROR;

  res.status(statusCode).json({
    error:
      process.env.NODE_ENV === "development" ? message : ERRORS.SERVER_ERROR,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
