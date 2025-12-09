/**
 * ユーザーモデル
 */
const bcrypt = require("bcrypt");
const { BCRYPT } = require("../config/constants");

// プールはdatabase.jsからgetterで取得
const database = require("../config/database");

class User {
  /**
   * ユーザー名でユーザーを検索
   * @param {string} username - ユーザー名
   * @returns {Promise<object|null>} ユーザーオブジェクトまたはnull
   */
  static async findByUsername(username) {
    const [rows] = await database.pool.query(
      "SELECT id, username, password_hash, created_at, updated_at FROM users WHERE username = ?",
      [username]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * IDでユーザーを検索
   * @param {number} id - ユーザーID
   * @returns {Promise<object|null>} ユーザーオブジェクトまたはnull
   */
  static async findById(id) {
    const [rows] = await database.pool.query(
      "SELECT id, username, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * 新しいユーザーを作成
   * @param {string} username - ユーザー名
   * @param {string} password - プレーンテキストのパスワード
   * @returns {Promise<object>} 作成されたユーザーオブジェクト
   */
  static async create(username, password) {
    // パスワードをハッシュ化
    const passwordHash = await bcrypt.hash(password, BCRYPT.SALT_ROUNDS);

    const [result] = await database.pool.query(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [username.trim(), passwordHash]
    );

    return {
      id: result.insertId,
      username: username.trim(),
    };
  }

  /**
   * パスワードを検証
   * @param {string} password - プレーンテキストのパスワード
   * @param {string} passwordHash - ハッシュ化されたパスワード
   * @returns {Promise<boolean>} パスワードが一致するかどうか
   */
  static async verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  /**
   * ユーザー名の重複をチェック
   * @param {string} username - ユーザー名
   * @returns {Promise<boolean>} 重複しているかどうか
   */
  static async isUsernameTaken(username) {
    const user = await this.findByUsername(username.trim());
    return user !== null;
  }
}

module.exports = User;
