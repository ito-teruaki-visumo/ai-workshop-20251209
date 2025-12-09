# タスク 06: フロントエンド - QuestForm コンポーネント

## 目的

新しいクエストを追加するためのフォームコンポーネントを作成する

## 実装場所

`TodoApp/src/components/QuestForm.vue`

## 実装内容

```vue
<template>
  <div class="quest-form">
    <h2>🗡️ 新しいクエストを受注</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <input
          v-model="title"
          type="text"
          placeholder="クエスト名を入力..."
          class="quest-input"
          required
        />
      </div>
      <button type="submit" class="submit-btn" :disabled="!title.trim()">
        ⚔️ クエストを受注する
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const title = ref("");

const emit = defineEmits<{
  submit: [title: string];
}>();

const handleSubmit = () => {
  if (title.value.trim()) {
    emit("submit", title.value.trim());
    title.value = ""; // 入力欄をクリア
  }
};
</script>

<style scoped>
.quest-form {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quest-form h2 {
  color: white;
  margin: 0 0 16px 0;
  font-size: 20px;
}

.form-group {
  margin-bottom: 12px;
}

.quest-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.quest-input:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: #48bb78;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #38a169;
}

.submit-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}
</style>
```

## チェックリスト

- [ ] `src/components/QuestForm.vue`を作成
- [ ] テンプレート部分を実装（input + button）
- [ ] スクリプト部分を実装（ref, emit, handleSubmit）
- [ ] スタイル部分を実装（RPG 風のデザイン）
- [ ] 空の入力を防ぐバリデーションを追加
- [ ] 送信後に入力欄をクリアする処理を追加

## 所要時間

約 15 分

## 次のタスク

→ タスク 07: QuestCard コンポーネントの作成
