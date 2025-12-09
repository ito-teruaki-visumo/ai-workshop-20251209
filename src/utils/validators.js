/**
 * バリデーションユーティリティ
 */
const { VALIDATION, ERRORS } = require("../config/constants");

/**
 * ユーザー名のバリデーション
 * @param {string} username - ユーザー名
 * @returns {string[]} エラーメッセージの配列
 */
function validateUsername(username) {
  const errors = [];

  if (!username || typeof username !== "string") {
    errors.push("ユーザー名は必須です");
    return errors;
  }

  const trimmedUsername = username.trim();

  if (
    trimmedUsername.length < VALIDATION.USERNAME_MIN_LENGTH ||
    trimmedUsername.length > VALIDATION.USERNAME_MAX_LENGTH
  ) {
    errors.push(
      `ユーザー名は${VALIDATION.USERNAME_MIN_LENGTH}文字以上${VALIDATION.USERNAME_MAX_LENGTH}文字以下である必要があります`
    );
  }

  if (!VALIDATION.USERNAME_PATTERN.test(trimmedUsername)) {
    errors.push("ユーザー名は英数字とアンダースコアのみ使用できます");
  }

  return errors;
}

/**
 * パスワードのバリデーション
 * @param {string} password - パスワード
 * @returns {string[]} エラーメッセージの配列
 */
function validatePassword(password) {
  const errors = [];

  if (!password || typeof password !== "string") {
    errors.push("パスワードは必須です");
    return errors;
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(
      `パスワードは${VALIDATION.PASSWORD_MIN_LENGTH}文字以上である必要があります`
    );
  }

  return errors;
}

/**
 * ユーザー登録のバリデーション
 * @param {object} data - リクエストデータ
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateRegister(data) {
  const errors = [
    ...validateUsername(data.username),
    ...validatePassword(data.password),
  ];

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * ログインのバリデーション
 * @param {object} data - リクエストデータ
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateLogin(data) {
  const errors = [];

  if (
    !data.username ||
    typeof data.username !== "string" ||
    data.username.trim() === ""
  ) {
    errors.push("ユーザー名は必須です");
  }

  if (
    !data.password ||
    typeof data.password !== "string" ||
    data.password === ""
  ) {
    errors.push("パスワードは必須です");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * タスクタイトルのバリデーション
 * @param {string} title - タスクタイトル
 * @returns {string[]} エラーメッセージの配列
 */
function validateTaskTitle(title) {
  const errors = [];

  if (!title || typeof title !== "string") {
    errors.push("タスク名は必須です");
    return errors;
  }

  const trimmedTitle = title.trim();

  if (
    trimmedTitle.length < VALIDATION.TASK_TITLE_MIN_LENGTH ||
    trimmedTitle.length > VALIDATION.TASK_TITLE_MAX_LENGTH
  ) {
    errors.push(
      `タスク名は${VALIDATION.TASK_TITLE_MIN_LENGTH}文字以上${VALIDATION.TASK_TITLE_MAX_LENGTH}文字以下である必要があります`
    );
  }

  return errors;
}

/**
 * タスク作成のバリデーション
 * @param {object} data - リクエストデータ
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateCreateTask(data) {
  const errors = validateTaskTitle(data.title);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * タスク更新のバリデーション
 * @param {object} data - リクエストデータ
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateUpdateTask(data) {
  const errors = [];

  // titleが提供された場合のみバリデーション
  if (data.title !== undefined) {
    errors.push(...validateTaskTitle(data.title));
  }

  // is_completedが提供された場合、boolean型かチェック
  if (
    data.is_completed !== undefined &&
    typeof data.is_completed !== "boolean"
  ) {
    errors.push("完了状態はtrue/falseで指定してください");
  }

  // 少なくとも1つのフィールドが提供されているか
  if (data.title === undefined && data.is_completed === undefined) {
    errors.push("更新するフィールドを指定してください");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateUsername,
  validatePassword,
  validateRegister,
  validateLogin,
  validateTaskTitle,
  validateCreateTask,
  validateUpdateTask,
};
