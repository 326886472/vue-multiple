<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-15 11:11:13
 * @LastEditors: wenshuang
 * @Description: 咨询 GPT
 * @FilePath: /mobile-server/src/pages/ai_consult/components/PreSales/mobile/Create.vue
-->
<template>
  <div class="create">
    <van-form ref="ruleFormRef" :model="form" label-width="auto" class="pre-sales-form max-h-[70vh]" overflow-y-auto>
      <van-field v-model.trim="form.plan_name" name="plan_name" label="BD方案名称" placeholder="管理咨询服务建议书" />
      <van-field v-model.trim="form.company_name" name="company_name" label="合作公司名称" placeholder="请输入合作公司名称" />
      <van-field name="cate_id_list" label="合作服务模块">
        <template #input>
          <van-checkbox-group
            v-model="form.cate_id_list"
            direction="horizontal"
            label="合作服务模块"
            placeholder="请选择合作服务模块"
          >
            <div v-for="item in categories" :key="item.id" :name="item.id">
              <div>{{ item.label }}</div>
              <div grid grid-cols-1 gap="4px">
                <van-checkbox v-for="it in item.children" :key="it.id" :name="it.id">
                  {{ it.label }}
                </van-checkbox>
              </div>
            </div>
          </van-checkbox-group>
        </template>
      </van-field>
      <van-field name="teacher_id_list" label="交付咨询专家">
        <template #input>
          <van-checkbox-group
            v-model="form.teacher_id_list"
            label="交付咨询专家"
            placeholder="请选择交付咨询专家"
          >
            <div grid grid-cols-1 gap="4px">
              <van-checkbox v-for="item in teachers" :key="item.id" :name="item.id">
                {{ item.name }}
              </van-checkbox>
            </div>
          </van-checkbox-group>
        </template>
      </van-field>
    </van-form>
    <van-sticky :container="ruleFormRef" position="bottom" bottom="0" w-full>
      <div flex justify-between item-center w-full>
        <van-button type="primary" :loading="loading" flex-1 @click="onSubmit()">
          保存
        </van-button>
        <van-button flex-1 @click="handleClose">
          取消
        </van-button>
      </div>
    </van-sticky>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { inject, reactive, ref } from 'vue'
import * as req from '@/api/ai_consult'
import { sleep } from '@/utils'

let sit: any = null
let sitCount = 0
const ruleFormRef = ref()
const loading = ref<boolean>(false)
const handleClose: any = inject('handleClose')
const reloadList: any = inject('reloadList')
const categories = inject('categories') as any
const teachers = inject('teachers') as any
const handing = inject('handing') as any
console.log('🚀 ~ teachers:', teachers)
console.log('🚀 ~ categories:', categories)
// do not use same name with ref
const form = reactive({
  company_name: '',
  plan_name: '管理咨询服务建议书',
  cate_id_list: [],
  teacher_id_list: [],
})
// 企业名称
function validateCompanyName(value: any) {
  console.log('🚀 ~ validateName ~ value:', value)
  if (value === '') {
    return '请输入合作公司名称'
  }
  return false
}
// 报告名称
function validatePlanName(value: any) {
  if (value === '') {
    return '请输入BD方案名称'
  }
  return false
}
// 检查业务类型
function validateCateIdList(value: any) {
  console.log('🚀 ~ validateCategory ~ value:', value)
  if (value === '') {
    return '请选择合作服务模块'
  }
  return false
}
// 检查专家选项
function checkTeacherList(value: any) {
  console.log('🚀 ~ checkExperts ~ value:', value)
  if (value.length === 0) {
    return '请选择交付咨询专家'
  } else {
    return false
  }
}

function validateForm() {
  const arr = [
    validateCompanyName(form.company_name),
    validatePlanName(form.plan_name),
    validateCateIdList(form.cate_id_list),
    checkTeacherList(form.teacher_id_list),
  ]
  return arr.every(item => !item)
}

async function onSubmit() {
  const valid = validateForm()
  if (valid) {
    loading.value = true
    const { data: { result } = {} as any } = await req.createPreSalesTask(form)
    console.log('🚀 ~ formEl.validate ~ res:', result)
    if (result) {
      sitCount = 0
      showToast({
        message: '操作成功, 报告正在智能生成中，请稍后刷新页面下载~',
        type: 'success',
        duration: 5000,
        onClose: async () => {
          sit && clearInterval(sit)
          sit = setInterval(() => {
            console.log('🚀 ~ sit=setInterval ~ handing.value:', handing.value)
            if (sitCount > 20 || !handing.value) {
              console.log('🚀 ~ sit=setInterval ~ clearInterval ~ handing.value:', sitCount, handing.value)
              sit && clearInterval(sit)
            }
            reloadList()
            sitCount++
          }, 5000)
        },
      })
      await reloadList()
      loading.value = false
      handleClose()
      return true
    }
    showToast({
      message: '操作失败，请稍后再试~',
      type: 'fail',
      onClose: () => loading.value = false,
    })
  }
  showToast({
    message: '请检查表单内容~',
    type: 'fail',
    onClose: () => loading.value = false,
  })
  return false
}
</script>

<style lang="scss" scoped>
</style>
