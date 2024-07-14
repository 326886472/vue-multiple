<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 13:45:34
 * @LastEditTime: 2024-02-06 10:03:58
 * @LastEditors: wenshuang
 * @Description 创建投票表单
 * @FilePath: /mobile-server/src/pages/vote/components/vote-form-create.vue
-->
<template>
  <div class="vote-form">
    <van-form @submit="onSubmit">
      <van-field
        v-model="createVoteInfo.title" class="gap" maxlength="50" placeholder="请输入投票主题" rows="2" type="textarea"
        show-word-limit autosize
      />
      <van-field name="type" class="gap sub-item">
        <template #input>
          <vote-form-create-item @change="updateVoteItem" />
        </template>
      </van-field>
      <van-field name="type" label="允许多选">
        <template #input>
          <van-switch v-model="createVoteInfo.type" size="20" />
        </template>
      </van-field>
      <van-field v-show="createVoteInfo.type" name="type" label="多选投票限制">
        <template #input>
          <van-switch v-model="createVoteInfo.multiple_type" size="20" />
        </template>
      </van-field>
      <div v-show="createVoteInfo.multiple_type">
        <van-cell-group>
          <van-cell>
            <div class="max_item small_num_input" style="margin-bottom: 16px;">
              最多选
              <van-field
                v-model="createVoteInfo.max_vote_num"
                type="number"
                @input="validateNumber('max_vote_num')"
              />
              个选项
            </div>
            <div class="min_item small_num_input">
              最少选
              <van-field
                v-model="createVoteInfo.min_vote_num"
                type="number"
                @input="validateNumber('min_vote_num')"
              />
              个选项
            </div>
          </van-cell>
        </van-cell-group>
      </div>
      <van-field
        v-model="createVoteInfo.finishTime" readonly clickable name="finish_time" label="截止时间" right-icon="arrow"
        placeholder="点击选择时间" @click.prevent="showPicker = true"
      />
      <van-field label="投票资格" style="align-items: center;" @click="createVoteInfo.show_role_permission = !createVoteInfo.show_role_permission">
        <template #input>
          <div class="role_permission_box">
            <div class="role_permission">
              <div>{{ createVoteInfo.role_type === 0 ? '不限' : '指定成员' }}</div>
              <div v-show="createVoteInfo.role_type" class="role_permission_num">
                已选<span>{{ user_id_list_length }}</span>人
              </div>
            </div>
            <div class="van-field__right-icon">
              <i class="van-badge__wrapper van-icon van-icon-arrow" />
            </div>
          </div>
        </template>
      </van-field>
      <div class="submit">
        <van-button round block type="primary" native-type="submit" :disabled="!canSubmit">
          创建投票
        </van-button>
      </div>
    </van-form>
    <van-action-sheet
      v-model:show="createVoteInfo.show_role_permission"
      :actions="createVoteInfo.role_permission_actions"
      cancel-text="取消"
      @select="onSelectPermission"
    />
  </div>
  <van-popup v-model:show="showPicker" position="bottom">
    <van-datetime-picker
      v-model="finishTime" :datetime-picker-props="{ 'visible-item-count': 3, 'title': '选择完整时间' }"
      :picker-props="{ 'visible-item-count': 3 }" @confirm="onDateTimeConfirm" @cancel="showPicker = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
import VanButton from 'vant/lib/button'
import VanField from 'vant/lib/field'
import VanForm from 'vant/lib/form'
import VanPopup from 'vant/lib/popup'
import VanDatetimePicker from '@/components/van-datetime-picker/index.vue'
import { useVoteCreate } from '@/pages/vote/hooks/useVoteCreate'
import { FZ_JsBridge } from '@/utils/js_bridge'
import VoteFormCreateItem from './vote-form-create-item.vue'
import 'vant/lib/button/style'
import 'vant/lib/form/style'
import 'vant/lib/field/style'
import 'vant/lib/popup/style'
import { fi } from 'element-plus/es/locale'
import qs from 'qs'

defineProps(['goBack'])
const emit = defineEmits(['goBack'])

const query: any = qs.parse(location.search.slice(1))

const { canSubmit, updateVoteItem, showPicker, createVoteInfo, onCreateVote, onDateTimeConfirm } = useVoteCreate()

const { finishTime } = toRefs(createVoteInfo)

async function onSubmit() {
  const res = await onCreateVote()
  if (res) {
    emit('goBack')
  }
}

onMounted(() => {
  (window as any).voteUserList = function (userList: any) {
    createVoteInfo.user_id_list = JSON.parse(userList)
  }
})

function validateNumber(this: any, field: string | number) {
  const value = this.createVoteInfo[field]
  const regex = /^\d*$/ // 正则表达式，匹配整数
  if (!regex.test(value)) {
    this.createVoteInfo[field] = value.replace(/[^0-9]*/g, '')
  }
}

function onSelectPermission(item: any) {
  createVoteInfo.show_role_permission = false
  if (item.name === '不限') {
    createVoteInfo.role_type = 0
  } else if (item.name === '指定成员') {
    createVoteInfo.role_type = 1
    FZ_JsBridge.openVoteUserList(query.dm_id, JSON.stringify(createVoteInfo.user_id_list))
  }
}

const user_id_list_length = computed(() => {
  return createVoteInfo.user_id_list.length
})
</script>

<style lang="scss" scoped>
.vote-form {
  padding-top: 24.5px;
  padding-bottom: 300px;

  .options {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  :deep(.van-cell) {
    &:after {
      right: 0;
    }

    &:not(.gap):after {
      border-bottom-width: 1px;
    }

    &.gap:after {
      display: block;
      border-color: #E8E8E8;
      border-bottom-width: 4px;
      left: 0;
    }

    &.sub-item {
      padding-right: 0;
    }
  }

  :deep(.van-field__word-limit){
    color: #D1D1D1;
  }

  :deep(.van-field__control:read-only) {
    text-align: right;
    justify-content: end;
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 55px;
    background: #FFFFFF;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.van-button) {
      width: 335px;
      height: 35px;
      border-radius: 18.5px;
    }
  }
}

.small_num_input {
  font-family: PingFangSC, PingFang SC;
  color: #333333;
  @include flex-row();

  :deep {
    .van-field {
      width: 72px;
      height: 38px;
      margin: 0 16px;
      background: #F6F6F6;
      border-radius: 6px;
      line-height: 13px
    }
  }
}

.role_permission_box {
  @include flex-row();
  .role_permission {
    font-size: 13px;
  }
  .role_permission_num {
    color: #666666;
    span {
      color: $param;
    }
  }
}
</style>
