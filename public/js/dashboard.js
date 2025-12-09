/**
 * ダッシュボードページ - JavaScript
 */
document.addEventListener("DOMContentLoaded", () => {
  // DOM要素
  const alertEl = document.getElementById("alert");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const logoutBtn = document.getElementById("logoutBtn");
  const addTaskForm = document.getElementById("addTaskForm");
  const newTaskTitle = document.getElementById("newTaskTitle");
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const taskList = document.getElementById("taskList");
  const loading = document.getElementById("loading");
  const emptyState = document.getElementById("emptyState");
  const completedCount = document.getElementById("completedCount");
  const totalCount = document.getElementById("totalCount");

  // 状態
  let currentFilter = "all";
  let searchQuery = "";
  let debounceTimer = null;

  // 初期化
  init();

  /**
   * 初期化処理
   */
  async function init() {
    const isAuthenticated = await checkAuthStatus();
    if (isAuthenticated) {
      await loadTasks();
    }
  }

  /**
   * 認証状態をチェック
   */
  async function checkAuthStatus() {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (!data.authenticated) {
        window.location.href = "/login";
        return false;
      }
      usernameDisplay.textContent = data.user.username;
      return true;
    } catch (error) {
      window.location.href = "/login";
      return false;
    }
  }

  /**
   * アラート表示
   */
  function showAlert(message, type = "error") {
    alertEl.textContent = message;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove("hidden");
    // 5秒後に非表示
    setTimeout(() => hideAlert(), 5000);
  }

  /**
   * アラート非表示
   */
  function hideAlert() {
    alertEl.classList.add("hidden");
  }

  /**
   * タスク一覧を読み込み
   */
  async function loadTasks() {
    loading.classList.remove("hidden");
    taskList.classList.add("hidden");
    emptyState.classList.add("hidden");

    try {
      const params = new URLSearchParams();
      if (currentFilter !== "all") {
        params.append("status", currentFilter);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const url = `/api/tasks${params.toString() ? "?" + params.toString() : ""}`;
      const response = await fetch(url);

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("タスクの取得に失敗しました");
      }

      const data = await response.json();
      renderTasks(data.data);
      updateStats(data.completed_count, data.total);
    } catch (error) {
      console.error("Load tasks error:", error);
      showAlert(error.message || "タスクの読み込みに失敗しました");
    } finally {
      loading.classList.add("hidden");
    }
  }

  /**
   * タスク一覧を描画
   */
  function renderTasks(tasks) {
    if (tasks.length === 0) {
      taskList.classList.add("hidden");
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");
    taskList.classList.remove("hidden");

    taskList.innerHTML = tasks
      .map(
        (task) => `
      <li class="task-item ${task.is_completed ? "completed" : ""}" data-id="${task.id}">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.is_completed ? "checked" : ""} 
          data-id="${task.id}"
        />
        <div class="task-content">
          <div class="task-title">${escapeHtml(task.title)}</div>
          <div class="task-date">${formatDate(task.created_at)}</div>
        </div>
        <div class="task-actions">
          <button class="btn btn-danger delete-btn" data-id="${task.id}">削除</button>
        </div>
      </li>
    `
      )
      .join("");

    // チェックボックスのイベント
    taskList.querySelectorAll(".task-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", handleToggleComplete);
    });

    // 削除ボタンのイベント
    taskList.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", handleDelete);
    });
  }

  /**
   * 統計情報を更新
   */
  function updateStats(completed, total) {
    completedCount.textContent = completed;
    totalCount.textContent = total;
  }

  /**
   * タスク追加
   */
  async function handleAddTask(e) {
    e.preventDefault();

    const title = newTaskTitle.value.trim();
    if (!title) {
      showAlert("タスク名を入力してください");
      return;
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (response.ok) {
        newTaskTitle.value = "";
        showAlert(data.message || "タスクを追加しました", "success");
        await loadTasks();
      } else {
        if (data.details && Array.isArray(data.details)) {
          showAlert(data.details.join("\n"));
        } else {
          showAlert(data.error || "タスクの追加に失敗しました");
        }
      }
    } catch (error) {
      console.error("Add task error:", error);
      showAlert("タスクの追加に失敗しました");
    }
  }

  /**
   * 完了状態を切り替え
   */
  async function handleToggleComplete(e) {
    const taskId = e.target.dataset.id;
    const isCompleted = e.target.checked;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_completed: isCompleted }),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }

      await loadTasks();
    } catch (error) {
      console.error("Toggle complete error:", error);
      showAlert("タスクの更新に失敗しました");
      e.target.checked = !isCompleted; // 元に戻す
    }
  }

  /**
   * タスク削除
   */
  async function handleDelete(e) {
    const taskId = e.target.dataset.id;

    if (!confirm("このタスクを削除しますか？")) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (response.ok || response.status === 204) {
        showAlert("タスクを削除しました", "success");
        await loadTasks();
      } else {
        const data = await response.json();
        showAlert(data.error || "タスクの削除に失敗しました");
      }
    } catch (error) {
      console.error("Delete task error:", error);
      showAlert("タスクの削除に失敗しました");
    }
  }

  /**
   * フィルター変更
   */
  function handleFilterChange(e) {
    const newFilter = e.target.dataset.filter;
    if (newFilter === currentFilter) return;

    // ボタンのアクティブ状態を更新
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    currentFilter = newFilter;
    loadTasks();
  }

  /**
   * 検索処理（デバウンス付き）
   */
  function handleSearch(e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value.trim();
      loadTasks();
    }, 300);
  }

  /**
   * ログアウト
   */
  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        showAlert("ログアウトに失敗しました");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showAlert("ログアウトに失敗しました");
    }
  }

  /**
   * HTMLエスケープ
   */
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 日付フォーマット
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // イベントリスナー設定
  addTaskForm.addEventListener("submit", handleAddTask);
  searchInput.addEventListener("input", handleSearch);
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", handleFilterChange);
  });
  logoutBtn.addEventListener("click", handleLogout);
});
