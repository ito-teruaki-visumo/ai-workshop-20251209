# タスク 08: フロントエンド - QuestBoard コンポーネント

## 目的

クエスト一覧を表示し、フィルタリング機能を提供するメインコンポーネントを作成する

## 実装場所

`TodoApp/src/components/QuestBoard.vue`

## 実装内容

```vue
<template>
  <div class="quest-board">
    <h1>⚔️ 冒険者のクエストボード</h1>

    <QuestForm @submit="handleCreateQuest" />

    <div class="filter-section">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="currentFilter = filter.value"
        class="filter-btn"
        :class="{ active: currentFilter === filter.value }"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="quest-list">
      <div v-if="filteredQuests.length === 0" class="empty-state">
        <p>📜 {{ emptyMessage }}</p>
      </div>
      <QuestCard
        v-for="quest in filteredQuests"
        :key="quest.id"
        :quest="quest"
        @toggle="handleToggleQuest"
        @delete="handleDeleteQuest"
      />
    </div>

    <div class="stats">
      <p>総クエスト数: {{ quests.length }}</p>
      <p>完了: {{ completedCount }} | 未完了: {{ incompleteCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import QuestForm from "./QuestForm.vue";
import QuestCard from "./QuestCard.vue";
import { questApi, type Quest } from "../services/api";

type FilterType = "all" | "incomplete" | "completed";

const quests = ref<Quest[]>([]);
const currentFilter = ref<FilterType>("all");

const filters = [
  { value: "all" as FilterType, label: "📋 すべて" },
  { value: "incomplete" as FilterType, label: "⭕ 未完了" },
  { value: "completed" as FilterType, label: "✅ 完了済み" },
];

const filteredQuests = computed(() => {
  if (currentFilter.value === "completed") {
    return quests.value.filter((q) => q.isCompleted);
  } else if (currentFilter.value === "incomplete") {
    return quests.value.filter((q) => !q.isCompleted);
  }
  return quests.value;
});

const completedCount = computed(
  () => quests.value.filter((q) => q.isCompleted).length
);
const incompleteCount = computed(
  () => quests.value.filter((q) => !q.isCompleted).length
);

const emptyMessage = computed(() => {
  if (currentFilter.value === "completed")
    return "まだ完了したクエストがありません";
  if (currentFilter.value === "incomplete")
    return "すべてのクエストを達成しました！🎉";
  return "新しいクエストを受注してください";
});

const loadQuests = async () => {
  try {
    quests.value = await questApi.getAll();
  } catch (error) {
    console.error("クエストの取得に失敗しました:", error);
    alert("クエストの取得に失敗しました");
  }
};

const handleCreateQuest = async (title: string) => {
  try {
    const newQuest = await questApi.create({ title });
    quests.value.push(newQuest);
  } catch (error) {
    console.error("クエストの作成に失敗しました:", error);
    alert("クエストの作成に失敗しました");
  }
};

const handleToggleQuest = async (id: number) => {
  try {
    const updatedQuest = await questApi.toggle(id);
    const index = quests.value.findIndex((q) => q.id === id);
    if (index !== -1) {
      quests.value[index] = updatedQuest;
    }
  } catch (error) {
    console.error("クエストの更新に失敗しました:", error);
    alert("クエストの更新に失敗しました");
  }
};

const handleDeleteQuest = async (id: number) => {
  if (!confirm("本当にこのクエストを削除しますか？")) return;

  try {
    await questApi.delete(id);
    quests.value = quests.value.filter((q) => q.id !== id);
  } catch (error) {
    console.error("クエストの削除に失敗しました:", error);
    alert("クエストの削除に失敗しました");
  }
};

onMounted(() => {
  loadQuests();
});
</script>

<style scoped>
.quest-board {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  text-align: center;
  color: #2d3748;
  margin-bottom: 32px;
  font-size: 32px;
}

.filter-section {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.filter-btn {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.quest-list {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: #a0aec0;
  font-size: 18px;
}

.stats {
  margin-top: 24px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 8px;
  text-align: center;
  color: #4a5568;
}

.stats p {
  margin: 4px 0;
}
</style>
```

## チェックリスト

- [ ] `src/components/QuestBoard.vue`を作成
- [ ] QuestForm と QuestCard をインポート
- [ ] クエストの状態管理（ref）を実装
- [ ] フィルター機能を実装（computed）
- [ ] 統計情報（完了数/未完了数）を実装
- [ ] loadQuests 関数を実装
- [ ] handleCreateQuest 関数を実装
- [ ] handleToggleQuest 関数を実装
- [ ] handleDeleteQuest 関数を実装
- [ ] onMounted でクエストを読み込み
- [ ] スタイルを実装

## 所要時間

約 30 分

## 次のタスク

→ タスク 09: App.vue で QuestBoard を表示
