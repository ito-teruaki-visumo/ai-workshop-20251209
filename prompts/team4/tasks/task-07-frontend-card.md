# タスク 07: フロントエンド - QuestCard コンポーネント

## 目的

個別のクエスト（タスク）を表示し、完了切り替えと削除を行うカードコンポーネントを作成する

## 実装場所

`TodoApp/src/components/QuestCard.vue`

## 実装内容

```vue
<template>
  <div class="quest-card" :class="{ completed: quest.isCompleted }">
    <div class="quest-content">
      <h3 class="quest-title" :class="{ 'strike-through': quest.isCompleted }">
        {{ quest.title }}
      </h3>
      <p class="quest-date">作成: {{ formatDate(quest.createdAt) }}</p>
    </div>
    <div class="quest-actions">
      <button
        @click="$emit('toggle', quest.id)"
        class="action-btn toggle-btn"
        :class="{ completed: quest.isCompleted }"
      >
        {{ quest.isCompleted ? "✅" : "⭕" }}
      </button>
      <button @click="$emit('delete', quest.id)" class="action-btn delete-btn">
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Quest } from "../services/api";

defineProps<{
  quest: Quest;
}>();

defineEmits<{
  toggle: [id: number];
  delete: [id: number];
}>();

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.quest-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.quest-card:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.quest-card.completed {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.quest-content {
  flex: 1;
}

.quest-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #2d3748;
}

.quest-title.strike-through {
  text-decoration: line-through;
  color: #a0aec0;
}

.quest-date {
  margin: 0;
  font-size: 12px;
  color: #718096;
}

.quest-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 12px;
  font-size: 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.action-btn:hover {
  transform: scale(1.1);
}

.toggle-btn {
  background: #e2e8f0;
}

.toggle-btn.completed {
  background: #48bb78;
}

.delete-btn {
  background: #feb2b2;
}

.delete-btn:hover {
  background: #fc8181;
}
</style>
```

## チェックリスト

- [ ] `src/components/QuestCard.vue`を作成
- [ ] テンプレート部分を実装（タイトル、日付、ボタン）
- [ ] props で quest を受け取る
- [ ] emit で toggle と delete イベントを発火
- [ ] 完了済みクエストに打ち消し線を表示
- [ ] 日付フォーマット関数を実装
- [ ] スタイルを実装（ホバーエフェクト含む）

## 所要時間

約 20 分

## 次のタスク

→ タスク 08: QuestBoard コンポーネントの作成
