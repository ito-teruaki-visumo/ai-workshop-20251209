/**
 * タスクモデル
 */
const database = require("../config/database");

class Task {
  /**
   * ユーザーのタスク一覧を取得
   * @param {number} userId - ユーザーID
   * @param {object} options - フィルタオプション
   * @returns {Promise<object[]>} タスクの配列
   */
  static async findByUserId(userId, options = {}) {
    const { status = "all", search = "", sort = "created" } = options;

    let query = `
      SELECT id, title, is_completed, created_at, updated_at 
      FROM tasks 
      WHERE user_id = ?
    `;
    const params = [userId];

    // ステータスフィルタ
    if (status === "completed") {
      query += " AND is_completed = TRUE";
    } else if (status === "pending") {
      query += " AND is_completed = FALSE";
    }

    // 検索フィルタ
    if (search) {
      query += " AND title LIKE ?";
      params.push(`%${search}%`);
    }

    // ソート
    if (sort === "updated") {
      query += " ORDER BY updated_at DESC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    const [rows] = await database.pool.query(query, params);
    return rows;
  }

  /**
   * タスクをIDで取得（ユーザーIDで所有権を確認）
   * @param {number} id - タスクID
   * @param {number} userId - ユーザーID
   * @returns {Promise<object|null>} タスクオブジェクトまたはnull
   */
  static async findById(id, userId) {
    const [rows] = await database.pool.query(
      `SELECT id, title, is_completed, created_at, updated_at 
       FROM tasks 
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * 新しいタスクを作成
   * @param {number} userId - ユーザーID
   * @param {string} title - タスクタイトル
   * @returns {Promise<object>} 作成されたタスク
   */
  static async create(userId, title) {
    const [result] = await database.pool.query(
      "INSERT INTO tasks (user_id, title) VALUES (?, ?)",
      [userId, title.trim()]
    );

    // 作成されたタスクを取得して返す
    return this.findById(result.insertId, userId);
  }

  /**
   * タスクを更新
   * @param {number} id - タスクID
   * @param {number} userId - ユーザーID
   * @param {object} updates - 更新データ
   * @returns {Promise<object|null>} 更新されたタスクまたはnull
   */
  static async update(id, userId, updates) {
    // タスクの存在と所有権を確認
    const existingTask = await this.findById(id, userId);
    if (!existingTask) {
      return null;
    }

    const fields = [];
    const params = [];

    if (updates.title !== undefined) {
      fields.push("title = ?");
      params.push(updates.title.trim());
    }

    if (updates.is_completed !== undefined) {
      fields.push("is_completed = ?");
      params.push(updates.is_completed);
    }

    if (fields.length === 0) {
      return existingTask;
    }

    params.push(id, userId);

    await database.pool.query(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
      params
    );

    // 更新されたタスクを取得して返す
    return this.findById(id, userId);
  }

  /**
   * タスクを削除
   * @param {number} id - タスクID
   * @param {number} userId - ユーザーID
   * @returns {Promise<boolean>} 削除成功かどうか
   */
  static async delete(id, userId) {
    const [result] = await database.pool.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result.affectedRows > 0;
  }

  /**
   * ユーザーのタスク統計を取得
   * @param {number} userId - ユーザーID
   * @returns {Promise<object>} 統計情報
   */
  static async getStats(userId) {
    const [rows] = await database.pool.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_completed = TRUE THEN 1 ELSE 0 END) as completed_count
       FROM tasks 
       WHERE user_id = ?`,
      [userId]
    );
    return {
      total: rows[0].total || 0,
      completed_count: rows[0].completed_count || 0,
    };
  }
}

module.exports = Task;
