/*
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-14 12:05:09
 * @LastEditors: wenshuang
 * @Description: AI 百宝箱
 * @FilePath: /mobile-server/src/pages/ai_index/main.ts
 */
import 'virtual:uno.css'
import { createApp } from 'vue'
import { isMobileDevice } from '@/utils'
import App from './App.vue'

if (isMobileDevice()) {
  import('@/styles/index.scss')
} else {
  import('@/styles/index-pc.scss')
}

createApp(App).mount('#app')
