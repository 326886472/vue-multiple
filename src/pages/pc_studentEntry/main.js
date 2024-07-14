/*
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-13 17:21:32
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-03-21 15:53:06
 * @FilePath: /mobile-server/src/pages/studentEntry/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable import/order */
import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import initSentry from '@/utils/init_sentry'
import request from '@/utils/request_el'

// use global function
import GlobalFunction from '../../utils/GlobalFunction'
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入Element Plus的CSS样式

// 导入需要使用的组件

window.gohtml_inject = {
  env: 'test',
}
const app = createApp(App)
app.config.globalProperties.$globalFunction = GlobalFunction
// 全局注册组件
app.use(ElementPlus)
console.log('子页面加载完成')

window.addEventListener('load', () => {
  console.log('子页面resize')
  const iframeHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  console.log('子页面发送消息', iframeHeight)
  window.parent.postMessage({ height: iframeHeight }, '*')
})

request.service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 响应数据为二进制流
    if (res instanceof ArrayBuffer) return res

    return res
  },
  (error) => {
    if (error.includes('登录状态已失效')) {
      let href

      switch (import.meta.env.MODE) {
        case 'test':
          href = 'https://dev-xuexi.foundingaz.com/'
          break
        case 'development':
          href = 'https://dev-xuexi.foundingaz.com/'
          break
        case 'audit':
          href = 'https://audit-xuexi.foundingaz.com/'
          break
        case 'production':
          href = 'https://xuexi.cyjiaomu.com/'
          break
      }
      window.location.href = href
    }
  },

)

initSentry(app, { project: 'pc_学生录入' })

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// app.component(ElButton.name, ElButton)

app.mount('#app')
