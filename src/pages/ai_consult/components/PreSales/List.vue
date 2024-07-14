<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-14 17:28:51
 * @LastEditors: wenshuang
 * @Description: 咨询 GPT
 * @FilePath: /mobile-server/src/pages/ai_consult/components/PreSales/List.vue
-->
<template>
  <div class="container">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="操作" width="80" fixed>
        <template #default="scope">
          <el-link type="primary" :disabled="scope.row.status !== 3" @click="handleDownload(scope.$index, scope.row)">
            下载方案
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        v-for="column in columns" :key="column.props" :prop="column.props" :label="column.label"
        :min-width="column.width || ''"
      >
        <template v-if="['type', 'status', 'create_time'].includes(column.props)" #default="scope">
          <span v-if="column.props === 'type'">{{ ConsultType[scope.row[column.props]] }}</span>
          <span v-else-if="column.props === 'create_time'">{{ moment(scope.row[column.props] * 1000).format('YYYY-MM-DD HH:mm') }}</span>
          <span v-else>{{ ConsultStatus[scope.row[column.props]] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div w-full flex justify-end mt-1>
      <el-pagination
        v-model:current-page="currentPage" layout="prev, pager, next" :total="total" hide-on-single-page
        @change="getList"
      />
    </div>
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
const columns = inject('columns') as any
const getList = inject('getList') as any
// 数据
const total = inject('total') as any
const tableData = inject('tableData') as any

const currentPage = ref(1)

watch(page, () => {
  console.log('🚀 ~ watch ~ page:', page)
  currentPage.value = page.page
})

// 下载
function handleDownload(index: number, row: any) {
  console.log(index, row)
  const url = `${BaseURL}/consult_gpt/download?task_id=${row.id}&token=${getToken()}`
  console.log('🚀 ~ handleDownload ~ url:', url)
  downloadFile(url, `${row.company_name}${row.plan_name}`)
}
</script>

<style lang="scss" scoped></style>
