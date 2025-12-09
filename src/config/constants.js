/**
 * 定数定義
 */
module.exports = {
  // バリデーション関連
  VALIDATION: {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
    USERNAME_PATTERN: /^[a-zA-Z0-9_]+$/,
    PASSWORD_MIN_LENGTH: 8,
    TASK_TITLE_MIN_LENGTH: 1,
    TASK_TITLE_MAX_LENGTH: 255,
  },

  // セッション関連
  SESSION: {
    MAX_AGE: 24 * 60 * 60 * 1000, // 24時間（ミリ秒）
  },

  // bcrypt関連
  BCRYPT: {
    SALT_ROUNDS: 10,
  },

  // エラーメッセージ
  ERRORS: {
    VALIDATION_ERROR: "バリデーションエラー",
    AUTH_REQUIRED: "認証が必要です",
    INVALID_CREDENTIALS: "ユーザー名またはパスワードが間違っています",
    USERNAME_EXISTS: "ユーザー名は既に使用されています",
    TASK_NOT_FOUND: "タスクが見つかりません",
    SERVER_ERROR: "サーバーエラーが発生しました",
  },

  // 成功メッセージ
  MESSAGES: {
    REGISTER_SUCCESS: "ユーザー登録が完了しました",
    LOGIN_SUCCESS: "ログインしました",
    LOGOUT_SUCCESS: "ログアウトしました",
    TASK_CREATED: "タスクが登録されました",
    TASK_UPDATED: "タスクが更新されました",
  },
};
