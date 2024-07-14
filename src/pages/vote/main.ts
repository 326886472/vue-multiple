/*
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-02-04 17:24:45
 * @LastEditors: wenshuang
 * @Description: 投票入口
 * @FilePath: /mobile-server/src/pages/vote/main.ts
 */
import 'virtual:uno.css'
import '@/styles/index.scss'
import '@/pages/vote/iconfont/iconfont.css'
import { createApp } from 'vue'
import initSentry from '@/utils/init_sentry'
import App from './App.vue'
import '@/utils/windowFunction'

const app = createApp(App)

initSentry(app, { project: 'H5_投票' })

app.mount('#app')
