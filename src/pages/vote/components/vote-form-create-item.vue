<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 13:45:34
 * @LastEditTime: 2024-02-04 17:52:51
 * @LastEditors: wenshuang
 * @Description 创建投票表单
 * @FilePath: /mobile-server/src/pages/vote/components/vote-form-create-item.vue
-->
<template>
  <div class="options">
    <div v-for="(item, index) in fields " :key="index" class="row" type="flex" gutter="20">
      <van-icon
        class-prefix="vote-icon" name="option" class="icon-minus" :class="fields.length > 2 ? ' highlight' : ''"
        @click.prevent="removeField(index)"
      />
      <div class="col">
        <van-field
          v-model="item.value" placeholder="请输入选项" :rules="[{ required: true, message: '请输入选项' }]"
          :maxlength="20"
          @blur="emitChange"
        />
      </div>
    </div>
    <div :class="fields.length < MAX_OPTIONS_LENGTH ? '' : 'van-button--disabled'" class="add-option" @click="addField">
      <van-icon name="add-o" size="20" />添加选项
    </div>
  </div>
</template>

<script setup lang="ts">
import VanField from 'vant/lib/field'
import VanIcon from 'vant/lib/icon'
import 'vant/lib/icon/style'
import 'vant/lib/field/style'

defineProps(['change'])
const emit = defineEmits(['change'])
// 最大选项数
const MAX_OPTIONS_LENGTH = 10
const fields = ref([{ value: '' }, { value: '' }])

function emitChange() {
  console.log('fields-=-=-', fields.value.map(it => it.value))
  emit('change', fields.value.map(it => it.value))
}

function addField() {
  if (fields.value.length >= MAX_OPTIONS_LENGTH) {
    return
  }
  fields.value.push({ value: '' })
  emitChange()
}

function removeField(index: number) {
  if (fields.value.length <= 2) {
    return
  }
  fields.value.splice(index, 1)
  emitChange()
}
</script>

<style lang="scss" scoped>
.options {
  display: flex;
  flex-direction: column;
  width: 100%;

  .row {
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid #D8D8D8;

    .icon-minus {
      color: #D8D8D8;
      &.highlight {
        color: #F50F0F;
      }
    }

    .col {
      flex: 1;
    }

    :deep(.van-icon) {
      display: flex;
      align-items: center;
    }
  }

  .add-option {
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: var(--color-primary);
    line-height: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 5.5px;
    margin-top: 15px;
    padding-bottom: 5px;
  }
}
</style>
