/**
 * レスポンスユーティリティ
 */

/**
 * 成功レスポンスを返す
 * @param {object} res - Expressレスポンスオブジェクト
 * @param {number} statusCode - HTTPステータスコード
 * @param {object} data - レスポンスデータ
 */
function sendSuccess(res, statusCode, data) {
  res.status(statusCode).json(data);
}

/**
 * エラーレスポンスを返す
 * @param {object} res - Expressレスポンスオブジェクト
 * @param {number} statusCode - HTTPステータスコード
 * @param {string} error - エラーメッセージ
 */
function sendError(res, statusCode, error) {
  res.status(statusCode).json({ error });
}

/**
 * バリデーションエラーレスポンスを返す
 * @param {object} res - Expressレスポンスオブジェクト
 * @param {string[]} details - エラー詳細の配列
 */
function sendValidationError(res, details) {
  res.status(400).json({
    error: "バリデーションエラー",
    details,
  });
}

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
};
