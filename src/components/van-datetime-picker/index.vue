<!--
 * @Author: wenshuang
 * @Date: 2024-02-01 11:29:11
 * @LastEditTime: 2024-02-02 09:22:24
 * @LastEditors: wenshuang
 * @Description: 日期时间选择器
 * @FilePath: /mobile-server/src/components/van-datetime-picker/index.vue
-->
<template>
  <van-picker-group title="预约日期" :tabs="['选择日期', '选择时间']" @confirm="handleConfirm" @cancel="onCancel as any">
    <van-date-picker v-model="currentDate" :min-date="minDate" :max-date="maxDate" />
    <van-time-picker v-model="currentTime" />
  </van-picker-group>
</template>

<script setup lang="ts">
import VanDatePicker from 'vant/lib/date-picker'
import VanPickerGroup from 'vant/lib/picker-group'
import VanTimePicker from 'vant/lib/time-picker'
import { ref } from 'vue'
import 'vant/lib/date-picker/style'
import 'vant/lib/picker-group/style'
import 'vant/lib/time-picker/style'
import 'vant/lib/toast/style'

const props = defineProps({
  minDate: {
    type: Date,
    default: new Date(),
  },
  maxDate: {
    type: Date,
    default: new Date(2099, 12, 31),
  },
  onConfirm: {
    type: Function,
  },
  onCancel: {
    type: Function,
  },
})

const currentDateTime = new Date()
const currentDate: any = ref([currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, currentDateTime.getDate()])
const currentTime: any = ref([currentDateTime.getHours(), currentDateTime.getMinutes()])

// 确认
function handleConfirm() {
  props.onConfirm && props.onConfirm([currentDate.value.join('-'), currentTime.value.join(':')].join(' '))
}
</script>

<style lang="scss" scoped></style>
