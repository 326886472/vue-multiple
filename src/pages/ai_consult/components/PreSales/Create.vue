<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-05-15 11:47:13
 * @LastEditors: wenshuang
 * @Description: 咨询 GPT
 * @FilePath: /mobile-server/src/pages/ai_consult/components/PreSales/Create.vue
-->
<template>
  <div class="create">
    <el-form ref="ruleFormRef" :model="form" label-width="auto" :rules="rules">
      <el-form-item label="BD方案名称" prop="plan_name">
        <el-input v-model.trim="form.plan_name" placeholder="管理咨询服务建议书" />
      </el-form-item>
      <el-form-item label="合作公司名称" prop="company_name">
        <el-input v-model.trim="form.company_name" placeholder="请输入合作公司名称" />
      </el-form-item>
      <el-form-item label="合作服务模块" prop="cate_id_list">
        <el-tree-select
          v-model="form.cate_id_list" placeholder="请选择合作服务模块" :data="categories" show-checkbox multiple
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="交付咨询专家" prop="teacher_id_list">
        <el-select
          v-model="form.teacher_id_list" multiple placeholder="请选择交付咨询专家" collapse-tags collapse-tags-tooltip
          :max-collapse-tags="5"
        >
          <el-option v-for="item in teachers" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item align="right" mt-2>
        <el-button type="primary" :loading="loading" @click="onSubmit(ruleFormRef)">
          保存
        </el-button>
        <el-button @click="handleClose">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { inject, reactive, ref } from 'vue'
import * as req from '@/api/ai_consult'

let sit: any = null
let sitCount = 0
const ruleFormRef = ref<FormInstance>()
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
  cate_id_list: '',
  teacher_id_list: [],
})
// 企业名称
function validateCompanyName(rule: any, value: any, callback: any) {
  console.log('🚀 ~ validateName ~ value:', value)
  if (value === '') {
    callback(new Error('请输入合作公司名称'))
  } else {
    callback()
  }
}
// 报告名称
function validatePlanName(rule: any, value: any, callback: any) {
  console.log('🚀 ~ validateName ~ value:', value)
  if (value === '') {
    callback(new Error('请输入BD方案名称'))
  } else {
    callback()
  }
}
// 检查业务类型
function validateCateIdList(rule: any, value: any, callback: any) {
  console.log('🚀 ~ validateCategory ~ value:', value)
  if (value === '') {
    callback(new Error('请选择合作服务模块'))
  } else {
    callback()
  }
}
// 检查专家选项
function checkTeacherList(rule: any, value: any, callback: any) {
  console.log('🚀 ~ checkExperts ~ value:', value)
  if (value.length === 0) {
    callback(new Error('请选择交付咨询专家'))
  } else {
    callback()
  }
}

// 表单规则
const rules = reactive<FormRules<typeof form>>({
  company_name: [{ validator: validateCompanyName, trigger: 'blur' }],
  plan_name: [{ validator: validatePlanName, trigger: 'blur' }],
  cate_id_list: [{ validator: validateCateIdList, trigger: 'blur' }],
  teacher_id_list: [{ validator: checkTeacherList, trigger: 'blur' }],
})

// 提交处理
async function handleSubmit() {
  const { data: { result } = {} as any } = await req.createPreSalesTask(form)
  console.log('🚀 ~ formEl.validate ~ res:', result)
  if (result) {
    ElMessage({
      message: '操作成功, 报告正在智能生成中，请稍后刷新页面下载~',
      type: 'success',
      duration: 5000,
      onClose: async () => {
        sit && clearInterval(sit)
        sit = setInterval(() => {
          console.log('🚀 ~ sit=setInterval ~ handing.value:', handing?.value)
          if (sitCount > 20 || !handing?.value) {
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
    return
  }
  ElMessage({
    message: '操作失败，请稍后再试~',
    type: 'error',
    onClose: () => loading.value = false,
  })
}

function onSubmit(formEl: FormInstance | undefined) {
  console.log('submit!--create222--', form, formEl)
  if (!formEl) return
  loading.value = true
  formEl.validate((valid) => {
    console.log('🚀 ~ formEl.validate ~ valid:', valid)
    if (valid) {
      handleSubmit()
    } else {
      ElMessage({
        message: '请检查表单内容~',
        type: 'error',
        onClose: () => loading.value = false,
      })
    }
  })
}
</script>

<style lang="scss" scoped></style>
