<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-16 16:45:28
 * @LastEditors: wenshuang
 * @Description: 咨询 GPT
 * @FilePath: /mobile-server/src/pages/ai_consult/components/PreSales/Search.vue
-->
<template>
  <div class="flex items-center justify-between">
    <el-form :model="form" inline flex items-center label-width="auto">
      <el-form-item class="!mb-0 p-0">
        <el-input v-model="form.company_name" placeholder="请输入合作公司名称" />
      </el-form-item>
      <el-form-item class="!mb-0 p-0">
        <el-input v-model="form.plan_name" placeholder="请输入BD方案名称" />
      </el-form-item>
      <el-form-item class="!mb-0 p-0">
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSubmit">
          搜索
        </el-button>
        <el-button htmltype="reset" :loading="loading" @click="reset">
          重置
        </el-button>
        <el-button htmltype="reset" :icon="Refresh" :loading="loading" @click="refreshList" />
      </el-form-item>
    </el-form>
    <div fixed top-1 right-2>
      <el-button type="primary" :icon="Plus" @click="showCreate">
        新增
      </el-button>
    </div>
    <el-dialog v-if="visible" v-model="visible" title="新增" width="45%" :before-close="handleClose">
      <create />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import { inject, ref } from 'vue'
import Create from './Create.vue'

const visible = inject('visible') as any
const page = inject('page') as any
const form = inject('keyword') as any
const getList = inject('getList') as any
const showCreate = inject('showCreate') as any
const handleClose = inject('handleClose') as any
const loading = ref<boolean>(false)

async function onSubmit() {
  loading.value = true
  console.log('submit--search--!', form)
  page.page = 1
  await getList(1, 10)
  loading.value = false
}

// 刷新
async function refreshList() {
  loading.value = true
  console.log('submit--search--!', form)
  await getList(page.page, page.limit)
  loading.value = false
}

// 重置
async function reset() {
  loading.value = true
  console.log('submit--search--!', form)
  form.company_name = ''
  form.plan_name = ''
  page.page = 1
  await getList(1, 10)
  loading.value = false
}
</script>

<style lang="scss" scoped></style>
