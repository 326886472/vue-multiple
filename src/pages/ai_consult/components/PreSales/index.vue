<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-16 16:42:22
 * @LastEditors: wenshuang
 * @Description: 咨询 GPT
 * @FilePath: /mobile-server/src/pages/ai_consult/components/PreSales/index.vue
-->
<template>
  <el-empty v-if="empty" :description="empty" w-full />
  <div v-else class="container p-1">
    <search />
    <list />
  </div>
</template>

<script setup lang="ts">
import { inject, provide, reactive, ref, watch } from 'vue'
import * as req from '@/api/ai_consult'
import List from './List.vue'
import Search from './Search.vue'

const empty = ref('')
const handing = ref(false) // 是否正在处理
const visible = ref(false)
const keyword = reactive({ company_name: '', plan_name: '' })
const staffLoading = inject('staffLoading') as any
const page = reactive({
  page: 1,
  limit: 10,
})
// 数据
const total = ref(0)
const tableData = ref([] as any)
const teachers = ref([] as any) // 讲师
const categories = ref([] as any) // 分类
// 列配置
const columns = [{
  props: 'company_name',
  label: '企业名称',
}, {
  props: 'plan_name',
  label: '计划名称',
  width: 150,
}, {
  props: 'type',
  label: '任务类型',
  width: 100,
}, {
  props: 'status',
  label: '状态',
  width: 100,
}, {
  props: 'creator_name',
  label: '创建人',
  width: 100,
}, {
  props: 'create_time',
  label: '创建时间',
  width: 150,
}]

/**
 * @description: 重新加载列表数据
 * @return {*}
 */
function reloadList() {
  page.page = 1
  getList(page.page, page.limit)
}

// 获取记录数据
async function getList(currentPage: number, pageSize: number) {
  try {
    console.log('🚀 ~ getList ~ currentPage:', currentPage)
    console.log('🚀 ~ getList ~ pageSize:', pageSize)
    if (currentPage) {
      page.page = currentPage
    }
    if (pageSize) {
      page.limit = pageSize
    }
    const params: any = {
      ...page,
      company_name: keyword.company_name,
      plan_name: keyword.plan_name,
    }
    console.log('🚀 ~ getList ~ params:', params)
    const res = await req.getPreSalesTaskList(params)
    console.log('🚀 ~ getList ~ res:', res)
    const { data: { list = [], total: totalCount = 0 } = {} as any } = res
    total.value = totalCount
    tableData.value = Array.isArray(list) ? list : []
    handing.value = tableData.value.some((item: any) => [1, 2].includes(item.status))
    console.log('🚀 ~ getList ~ total.value:', list)
  } catch (error) {
    console.log('🚀 ~ getList ~ error:', error)
    empty.value = error as string
  }
}

// 获取讲师
async function getPreSalesTeachers() {
  try {
    teachers.value = (await req.getPreSalesTeachers())?.data?.list || []
    console.log('🚀 ~ getPreSalesTeachers ~ teachers.value:', teachers.value)
  } catch (error) {
    console.log('🚀 ~ getPreSalesTeachers ~ error:', error)
  }
}

function handleTreeData(data: Array<any> = []): Array<any> {
  console.log('🚀 ~ handleTreeData ~ data:', data)
  return data.map((item) => {
    return {
      ...item,
      value: item.id,
      children: item.children ? handleTreeData(item.children) : [],
    }
  })
}

// 获取分类
async function getPreSalesCategories() {
  try {
    categories.value = handleTreeData((await req.getPreSalesCategories())?.data?.list || [])
    console.log('🚀 ~ getPreSalesCategories ~ categories.value:', categories.value)
  } catch (error) {
    console.log('🚀 ~ getPreSalesCategories ~ error:', error)
  }
}

// 显示弹窗
function showCreate() {
  visible.value = true
}
// 关闭弹窗
function handleClose() {
  visible.value = false
}

// 生命周期--挂载前
watch(staffLoading, async () => {
  console.log('watch---staffLoading', staffLoading.value)
  if (staffLoading.value) return
  await getPreSalesTeachers()
  await getPreSalesCategories()
  getList(page.page, page.limit)
})

provide('keyword', keyword)
provide('tableData', tableData)
provide('total', total)
provide('columns', columns)
provide('getList', getList)
provide('reloadList', reloadList)
provide('page', page)
provide('visible', visible)
provide('showCreate', showCreate)
provide('handleClose', handleClose)
provide('teachers', teachers)
provide('categories', categories)
provide('handing', handing)
</script>

<style lang="scss" scoped></style>
