/*
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-13 17:21:32
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-15 11:41:32
 * @FilePath: /mobile-server/src/pages/studentEntry/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable import/order */
import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import '@/components/pc/comment/css/element.scss'
import initSentry from '@/utils/init_sentry'

// use global function
import GlobalFunction from '../../utils/GlobalFunction'
import ElementPlus from 'element-plus'

import locale from 'element-plus/dist/locale/zh-cn.mjs'

import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import '../../utils/windowFunction'
import '@/utils/setZoom.js'

// 导入Element Plus的CSS样式

window.gohtml_inject = {
  env: 'test',
}

const app = createApp(App)

app.config.globalProperties.$globalFunction = GlobalFunction
// 全局注册组件
app.use(ElementPlus, {
  locale,
})

window.addEventListener('load', () => {
  console.log('子页面load')
  const iframeHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  console.log('子页面发送消息', iframeHeight)
  window.parent.postMessage({ height: iframeHeight }, '*')
})

listenerElHeightById('app')

window.addEventListener('resize', () => {
  console.log('子页面resize--')
  const iframeHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  console.log('子页面发送消息', iframeHeight)
  window.parent.postMessage({ height: iframeHeight }, '*')
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// app.component(ElButton.name, ElButton)

initSentry(app, { project: 'pc_tdl_发现广场' })

app.mount('#app')
