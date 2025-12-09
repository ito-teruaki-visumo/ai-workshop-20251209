<template>
    <div class="quest-board">
        <h1>⚔️ 冒険者のクエストボード</h1>

        <QuestForm @submit="handleCreateQuest" />

        <div class="filter-section">
            <button v-for="filter in filters" :key="filter.value" @click="currentFilter = filter.value"
                class="filter-btn" :class="{ active: currentFilter === filter.value }">
                {{ filter.label }}
            </button>
        </div>

        <div class="quest-list">
            <div v-if="filteredQuests.length === 0" class="empty-state">
                <p>📜 {{ emptyMessage }}</p>
            </div>
            <QuestCard v-for="quest in filteredQuests" :key="quest.id" :quest="quest" @toggle="handleToggleQuest"
                @delete="handleDeleteQuest" />
        </div>

        <div class="stats">
            <p>総クエスト数: {{ quests.length }}</p>
            <p>完了: {{ completedCount }} | 未完了: {{ incompleteCount }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import QuestForm from './QuestForm.vue';
import QuestCard from './QuestCard.vue';
import { questApi, type Quest } from '../services/api';

type FilterType = 'all' | 'incomplete' | 'completed';

const quests = ref<Quest[]>([]);
const currentFilter = ref<FilterType>('all');

const filters = [
    { value: 'all' as FilterType, label: '📋 すべて' },
    { value: 'incomplete' as FilterType, label: '⭕ 未完了' },
    { value: 'completed' as FilterType, label: '✅ 完了済み' },
];

const filteredQuests = computed(() => {
    if (currentFilter.value === 'completed') {
        return quests.value.filter(q => q.isCompleted);
    } else if (currentFilter.value === 'incomplete') {
        return quests.value.filter(q => !q.isCompleted);
    }
    return quests.value;
});

const completedCount = computed(() => quests.value.filter(q => q.isCompleted).length);
const incompleteCount = computed(() => quests.value.filter(q => !q.isCompleted).length);

const emptyMessage = computed(() => {
    if (currentFilter.value === 'completed') return 'まだ完了したクエストがありません';
    if (currentFilter.value === 'incomplete') return 'すべてのクエストを達成しました！🎉';
    return '新しいクエストを受注してください';
});

const loadQuests = async () => {
    console.log('=== loadQuests 開始 ===');
    try {
        console.log('API呼び出し前');
        const result = await questApi.getAll();
        console.log('API呼び出し成功:', result);
        quests.value = result;
        console.log('quests.value更新完了:', quests.value);
    } catch (error) {
        console.error('クエストの取得に失敗しました:', error);
        alert('クエストの取得に失敗しました');
    }
};

const handleCreateQuest = async (title: string) => {
    try {
        const newQuest = await questApi.create({ title });
        quests.value.push(newQuest);
    } catch (error) {
        console.error('クエストの作成に失敗しました:', error);
        alert('クエストの作成に失敗しました');
    }
};

const handleToggleQuest = async (id: number) => {
    try {
        const updatedQuest = await questApi.toggle(id);
        const index = quests.value.findIndex(q => q.id === id);
        if (index !== -1) {
            quests.value[index] = updatedQuest;
        }
    } catch (error) {
        console.error('クエストの更新に失敗しました:', error);
        alert('クエストの更新に失敗しました');
    }
};

const handleDeleteQuest = async (id: number) => {
    if (!confirm('本当にこのクエストを削除しますか？')) return;

    try {
        await questApi.delete(id);
        quests.value = quests.value.filter(q => q.id !== id);
    } catch (error) {
        console.error('クエストの削除に失敗しました:', error);
        alert('クエストの削除に失敗しました');
    }
};

onMounted(() => {
    console.log('=== QuestBoard mounted ===');
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
