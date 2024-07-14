<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-16 15:59:20
 * @LastEditors: wenshuang
 * @Description: 咨询 GPT
 * @FilePath: /mobile-server/src/pages/ai_consult/App.vue
-->
<template>
  <div class="container h-screen flex flex-col">
    <header w-full flex justify-center relative>
      <div w-full h-4 p-0 m-0 flex justify-start items-center pl-1>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item cursor-pointer font-bold @click="goHome">
            智能百宝箱
          </el-breadcrumb-item>
          <el-breadcrumb-item>咨询百宝箱</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- <h3 w-full h-4 p-0 m-0 flex justify-center items-center>
        咨询百宝箱
      </h3> -->
    </header>
    <el-divider class="!m-0" />
    <div class="flex flex-1 w-full" relative>
      <div ref="menuRef">
        <el-menu default-active="1" class="h-full relative" @open="handleOpen" @close="handleClose">
          <el-menu-item v-for="item in menuList" :key="item.value" :index="String(item.value)" @click="clickMenu(item)">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <main ref="mainRef" class="pos-absolute right-0">
        <component :is="componentName" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
import { computed, provide, ref } from 'vue'
import { useLogin } from '@/pages/ai_index/useLogin'
import PreSales from './components/PreSales/index.vue'

// 登录
const { homeUrl, loading } = useLogin()
const menuRef = ref(null) as any
const mainRef = ref(null) as any
// 激活菜单
const active = ref(1)

// 菜单
const menuList = [
  {
    value: 1,
    label: 'BD 报告',
    component: PreSales,
    icon: Document,
  },
]

const componentName = computed(() => {
  return menuList[active.value - 1].component
})

// 跳转首页
function goHome() {
  window.location.replace(homeUrl)
}

// 菜单点击
function clickMenu(item: any) {
  console.log('🚀 ~ clickMenu ~ item:', item)
  active.value = item.value
}

function handleOpen(key: string, keyPath: string[]) {
  console.log(key, keyPath)
}
function handleClose(key: string, keyPath: string[]) {
  console.log(key, keyPath)
}
onMounted(() => {
  try {
    const menuWidth = menuRef.value?.offsetWidth
    console.log('🚀 ~ onMounted ~ menuWidth:', menuWidth)
    mainRef.value.style.left = `${menuWidth}px`
  } catch (error) {
    console.log('🚀 ~ onMounted ~ error:', error)
  }
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
