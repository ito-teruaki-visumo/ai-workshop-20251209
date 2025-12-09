import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

console.log('=== main.ts 実行開始 ===')

const app = createApp(App)

console.log('=== App作成完了、マウント前 ===')
app.mount('#app')
console.log('=== マウント完了 ===')
