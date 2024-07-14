<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-04-07 14:22:26
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-16 16:35:26
 * @FilePath: /mobile-server/src/pages/pc_tdl/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="tdl">
    <div id="tdl_content">
      <div class="fix">
        <div class="fix_box">
          <div class="fix_box_top">
            <div class="find" @click="toPage('explore')">
              <i />
              <span>发现广场</span>
            </div>
            <div class="inspiration" @click="toPage('inspiration')">
              <i />
              <span>填写助手</span>
            </div>
          </div>
        </div>
      </div>
      <home />
    </div>
  </div>
</template>

<script>
import Home from './view/Home.vue'

export default {
  components: {
    Home,
  },
  data() {
    return {
      name: 'TDL',
      parentOffsetTop: 0,
    }
  },
  mounted() {
    // 监听父页面的消息
    window.addEventListener('message', (event) => {
      this.parentOffsetTop = event.data.scrollTop
    })
  },
  methods: {
    toPage(page) {
      window.parent.postMessage({
        page,
      }, '*')
    },
  },
}
</script>

<style lang="scss" scoped>
@import url('./scss/app.scss');
</style>
