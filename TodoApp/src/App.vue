<template>
  <div id="app">
    <QuestBoard />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import QuestBoard from './components/QuestBoard.vue';

console.log('=== App.vue script setup 実行 ===');

onMounted(() => {
  console.log('=== App.vue mounted ===');
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  padding: 24px;
}
</style>
