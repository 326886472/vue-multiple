/*
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-14 18:37:46
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-14 10:34:13
 * @FilePath: /mobile-server/src/pages/signIn/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import 'virtual:uno.css'
import '@/styles/index.scss'
import { createApp } from 'vue'
import initSentry from '@/utils/init_sentry'
import request from '@/utils/request_el'
import App from './App.vue'

import 'element-plus/dist/index.css'
import * as GlobalFunction from '@/utils/GlobalFunction'

// 导入Element Plus的CSS样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import ElementPlus from 'element-plus'

// GlobalFunction.clog()
// 全局注册组件
const app = createApp(App)

request.service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 响应数据为二进制流
    if (res instanceof ArrayBuffer) return res

    return res
  },
)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)

initSentry(app, { project: '1980签到' })

app.mount('#app')
