/**
 * 登録ページ - JavaScript
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
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
    submitBtn.textContent = isLoading ? "登録中..." : "登録";
  }

  /**
   * バリデーション
   */
  function validateForm(username, password) {
    const errors = [];

    if (!username || username.length < 3 || username.length > 50) {
      errors.push("ユーザー名は3文字以上50文字以下で入力してください");
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push("ユーザー名は英数字とアンダースコアのみ使用できます");
    }

    if (!password || password.length < 8) {
      errors.push("パスワードは8文字以上で入力してください");
    }

    return errors;
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
    const errors = validateForm(username, password);
    if (errors.length > 0) {
      showAlert(errors.join("\n"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 登録成功
        showAlert(data.message || "ユーザー登録が完了しました", "success");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        // エラー
        if (data.details && Array.isArray(data.details)) {
          showAlert(data.details.join("\n"));
        } else {
          showAlert(data.error || "登録に失敗しました");
        }
      }
    } catch (error) {
      console.error("Register error:", error);
      showAlert("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  });
});
