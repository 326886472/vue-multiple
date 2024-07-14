<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-04-07 16:56:59
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-15 19:20:36
 * @FilePath: /mobile-server/src/pages/pc_tdl/view/Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="header">
    <span :class="{ active: type === 'Guide' }" @click="handleType('Guide')">填写指南</span>
    <span :class="{ active: type === 'Examples' }" @click="handleType('Examples')">优秀范例</span>
  </div>
  <examples v-if="type === 'Examples'" />
  <guide v-else />
</template>

<script>
import Cookies from 'js-cookie'
import moment from 'moment'
import Examples from './Examples.vue'
import Guide from './Guide.vue'

export default {
  name: 'Home',
  components: {
    Examples,
    Guide,
  },
  data() {
    return {
      name: 'home',
      type: 'Guide',
    }
  },
  created() {
    const tdl_type = Cookies.get('tdl_find_type')
    if (tdl_type) {
      this.type = tdl_type
    }
  },
  methods: {
    handleType(type) {
      this.type = type
      Cookies.set('tdl_find_type', type)
    },

  },
}
</script>

<style lang="scss" scoped>
* {
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

#tdl {
    #tdl_content {
        position: relative;
        margin: 0 auto;
        background: #FAFAFA;
    }

    .header {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-weight: 600;
        border-bottom: 1px solid #EBEBEB;

        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 20px;
        color: #333333;
        background: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;

        .line {
            display: inline-block;
            width: 4px;
            height: 18px;
            margin-left: 20px;
            vertical-align: -1.5px;
        }
        span {
            margin-left: 6px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 20px;
            color: #333333;
            line-height: 28px;
            text-align: left;
            font-style: normal;
            cursor: pointer;
        }
        span.active {
          color: #FF4F00;
          display: inline-block;
          position: relative;
        }

        span.active::before {
            content: '';
            position: absolute;
            width: 40px;
            height: 3px;
            background: #F25A00;
            border-radius: 2px;
            left: 0;
            right: 0;
            margin: 0 auto;
            bottom: -6px;
          }
    }
}
</style>
