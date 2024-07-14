/* eslint-disable import/order */
/*
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-15 11:01:41
 * @LastEditors: wenshuang
 * @Description: 咨询 GPT
 * @FilePath: /mobile-server/src/pages/ai_consult/main.ts
 */
import { createApp } from 'vue'
import 'virtual:uno.css'
import ElementPlus from 'element-plus'
import Vant from 'vant'
import { isMobileDevice } from '@/utils'
import App from './App.vue'
import AppMobile from './AppMobile.vue'

if (isMobileDevice()) {
  import('@/styles/index.scss')
  createApp(AppMobile).use(Vant).mount('#app')
} else {
  import('@/styles/index-pc.scss')
  createApp(App).use(ElementPlus).mount('#app')
}
