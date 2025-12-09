/**
 * ログインページ - JavaScript
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const alertEl = document.getElementById("alert");
  const submitBtn = document.getElementById("submitBtn");

  // 既にログイン済みかチェック
  checkAuthStatus();

  /**
   * 認証状態をチェック
   */
  async function checkAuthStatus() {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (data.authenticated) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      // 未認証状態として続行
    }
  }

  /**
   * アラート表示
   */
  function showAlert(message, type = "error") {
    alertEl.textContent = message;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove("hidden");
  }

  /**
   * アラート非表示
   */
  function hideAlert() {
    alertEl.classList.add("hidden");
  }

  /**
   * ボタンの状態を切り替え
   */
  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? "ログイン中..." : "ログイン";
  }

  /**
   * フォーム送信処理
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // クライアント側バリデーション
    if (!username || !password) {
      showAlert("ユーザー名とパスワードを入力してください");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ログイン成功
        showAlert(data.message || "ログインしました", "success");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      } else {
        // エラー
        showAlert(data.error || "ログインに失敗しました");
      }
    } catch (error) {
      console.error("Login error:", error);
      showAlert("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  });
});
