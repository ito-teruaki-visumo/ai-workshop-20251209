# タスク 09: フロントエンド - App.vue の更新

## 目的

App.vue で QuestBoard コンポーネントを表示し、アプリを完成させる

## 実装場所

`TodoApp/src/App.vue`

## 実装内容

```vue
<template>
  <div id="app">
    <QuestBoard />
  </div>
</template>

<script setup lang="ts">
import QuestBoard from "./components/QuestBoard.vue";
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  padding: 24px;
}
</style>
```

## チェックリスト

- [ ] `src/App.vue`を開く
- [ ] 既存のコードを削除
- [ ] QuestBoard コンポーネントをインポート
- [ ] テンプレートに QuestBoard を配置
- [ ] グローバルスタイルを追加（背景色など）

## 所要時間

約 5 分

## 次のタスク

→ タスク 10: 動作確認とデバッグ
