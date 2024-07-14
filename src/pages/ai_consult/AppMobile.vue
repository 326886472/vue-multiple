<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-16 15:59:09
 * @LastEditors: wenshuang
 * @Description: 咨询 GPT
 * @FilePath: /mobile-server/src/pages/ai_consult/AppMobile.vue
-->
<template>
  <div class="container h-screen flex flex-col">
    <div class="flex flex-1">
      <component :is="componentName" />
      <van-tabbar v-model="active">
        <van-tabbar-item v-for="item in tabBar" :key="item.value" :icon="item.icon">
          {{ item.label }}
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLogin } from '@/pages/ai_index/useLogin'
import PreSales from './components/PreSales/Mobile/index.vue'
import UserCenter from './components/UserCenter/Mobile/index.vue'

// 登录
const { loading } = useLogin()

// 激活菜单
const active = ref(0)

// 全量菜单
const tabBar = [
  {
    value: 0,
    label: '售前报告',
    component: PreSales,
    icon: 'tv-o',
  },
  {
    value: 1,
    label: '诊断报告',
    component: UserCenter,
    icon: 'service-o',
  },
  {
    value: 2,
    label: '交付报告',
    component: UserCenter,
    icon: 'flag-o',
  },
]
const componentName = computed(() => {
  console.log('🚀 ~ componentName ~ active.value:', active.value)
  return tabBar.find(item => item.value === active.value)?.component
})
provide('staffLoading', loading)
</script>

<style lang="scss" scoped>
.menu-container {
  width: 10vw;
}

.arrow-icon {
  font-size: 8px;
  background-color: white;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 30%;
  margin-right: -4px;
  transform: translateY(-50%);
  border: 1px solid #E8E8E8;
  border-radius: 50%;
  padding: 1px;
}
</style>
