<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-15 11:17:46
 * @LastEditors: wenshuang
 * @Description: 咨询 GPT
 * @FilePath: /mobile-server/src/pages/ai_consult/components/PreSales/Mobile/List.vue
-->
<template>
  <div class="container" pb-10>
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getList">
      <div
        v-for="item in tableData" :key="item" :title="item" border-0 border-b border-dashed border-slate-200 grid
        grid-cols-2
      >
        <div v-for="column in columns" :key="column.props" flex items-center>
          <span text-orange-500 whitespace-nowrap>{{ column.label }}:</span>
          <span v-if="column.props === 'type'">{{ ConsultType[item[column.props]] }}</span>
          <span v-else-if="column.props === 'status'">{{ ConsultStatus[item[column.props]] }}</span>
          <span v-else-if="column.props === 'create_time'">{{ moment(item[column.props] * 1000).format('YYYY-MM-DD HH:mm') }}</span>
          <span v-else>{{ item[column.props] }}</span>
        </div>
        <a href="javascript:void(0);" :disabled="item.status !== 3" @click="handleDownload(item)">
          下载方案
        </a>
      </div>
    </van-list>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { computed, inject, ref, watch } from 'vue'
import { ConsultStatus, ConsultType } from '@/pages/ai_consult/enum'
import { getToken } from '@/utils/auth'
import { downloadFile } from '@/utils/file'
import { BaseURL } from '@/utils/request'

const page = inject('page') as any
console.log('🚀 ~ page:', page.page)
const loading = inject('loading') as any
const finished = inject('finished') as any
const columns = inject('columns') as any
const getList = inject('getList') as any
// 数据
const tableData = inject('tableData') as any

// 下载
function handleDownload(row: any) {
  const url = `${BaseURL}/consult_gpt/download?task_id=${row.id}&token=${getToken()}`
  console.log('🚀 ~ handleDownload ~ url:', url)
  downloadFile(url, `${row.company_name}${row.plan_name}`)
}
</script>

<style lang="scss" scoped></style>
