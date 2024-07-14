<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-14 12:05:55
 * @LastEditors: wenshuang
 * @Description: AI 百宝箱
 * @FilePath: /mobile-server/src/pages/ai_index/App.vue
-->
<template>
  <div flex justify-center flex-col class="w-[50vw]" m-auto :class="{ 'mobile-view': mobile }">
    <header w-full flex justify-center>
      <img src="https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/ai/zixun_top_bg.png">
    </header>
    <!-- <div> {{ url }} </div> -->
    <main grid grid-cols-3 justify-center p-1 class="gap-[29px]">
      <a
        v-for="nav in navList" :key="nav.title" href="javascript:void(0)" text-center :title="nav.title"
        @click="itemClick(nav)"
      >
        <img v-if="nav.img" :src="nav.img" :title="nav.title" :alt="nav.title">
        <span v-else>{{ nav.title }}</span>
      </a>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useLogin } from '@/pages/ai_index/useLogin'
import { isMobileDevice } from '@/utils'

const { loading, navList = [] } = useLogin()

const mobile = ref(isMobileDevice())
console.log('🚀 ~ mobile:', mobile)
// const url = ref(location.href)

// 项目点击
function itemClick(row: any) {
  if (!row.link) {
    return ElMessage('敬请期待')
  }
  if (loading.value) {
    return ElMessage('处理中，请稍后再试~')
  }
  location.href = row.link
}
</script>

<style lang="scss" scoped>
.mobile-view {
  width: unset;

  header {
    img {
      width: 80%;
    }
  }

  main {
    >a {
      >img {
        width: 100%;
      }
    }
  }
}
</style>
