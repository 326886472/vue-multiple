<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-14 16:37:10
 * @LastEditors: wenshuang
 * @Description: 咨询 GPT
 * @FilePath: /mobile-server/src/pages/ai_consult/components/PreSales/Mobile/Search.vue
-->
<template>
  <div>
    <van-sticky>
      <van-form :model="form" inline flex items-center label-width="auto">
        <van-field v-model="form.company_name" placeholder="请输入合作公司名称" />
        <van-field v-model="form.plan_name" placeholder="请输入BD方案名称" />
        <van-button type="primary" icon="search" :loading="loading" @click="onSubmit" />
      </van-form>
    </van-sticky>
    <div fixed right-1 class="bottom-[100px]">
      <van-button type="primary" icon="add-o" @click="showCreate" />
    </div>
    <van-dialog v-if="visible" v-model:show="visible" title="新增" :before-close="handleClose" :show-confirm-button="false">
      <create />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
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
  await getList()
  loading.value = false
}
</script>

<style lang="scss" scoped></style>
