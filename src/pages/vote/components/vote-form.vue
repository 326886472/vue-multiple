<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 13:45:34
 * @LastEditTime: 2024-02-27 20:04:44
 * @LastEditors: wenshuang
 * @Description 投票表单项
 * @FilePath: /mobile-server/src/pages/vote/components/vote-form.vue
-->
<template>
  <div class="vote-form">
    <div class="title minus_half_word">
      【{{ (VOTE_TYPE as any)[voteDetail?.info?.type] }}】{{ groupCheckedText }}{{ voteDetail?.info?.title }}
    </div>
    <div v-if="disabled || isLookResult" class="vote-box">
      <div
        v-for="(item) in voteDetail?.info?.stats" :key="item.id" class="vote-item"
        :class="item.has_vote ? 'voted' : ''"
      >
        <div class="vote-options">
          <span v-if="item.has_vote" class="minus_half_word">【已选】</span>{{ item.name }}
        </div>
        <div class="vote-percent">
          <span>{{ item.count }}票</span>{{ item.percent }}
        </div>
        <div class="vote-slider">
          <van-slider
            v-model="item.percent_number" max="100" min="0" :disabled="true" bar-height="4px"
            active-color="#FF4F00"
          />
        </div>
      </div>
      <div class="footer">
        <div class="end-time">
          截止时间 {{ formatTime(voteDetail?.info?.finish_time * 1000) }}
        </div>
        <div v-if="isHost" class="vote-info">
          <span class="join-num">参与人数 {{ voteDetail?.info?.join_user_count }} 人</span>
          <span v-if="!isLookResult" class="look-result" @click="lookResult">查看结果</span>
        </div>
        <van-button
          v-if="!isLookResult" round block type="primary" native-type="submit"
          :disabled="disabled || (groupChecked.length === 0 && groupRadio === '')"
        >
          {{ buttonText }}
        </van-button>
      </div>
    </div>
    <van-form v-else @submit="onSubmit">
      <van-field name="checkboxGroup" label="">
        <template #input>
          <van-checkbox-group v-if="voteDetail?.info?.type === 2" v-model="groupChecked" :max="checkboxMax">
            <van-checkbox v-for="(item) in voteDetail?.info?.options" :key="item.vote_id" :name="item.id">
              {{ item.name }}
            </van-checkbox>
          </van-checkbox-group>
          <van-radio-group v-else v-model="groupRadio">
            <van-radio v-for="(item) in voteDetail?.info?.options" :key="item.vote_id" :name="item.id">
              {{ item.name }}
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <div class="footer">
        <div class="end-time">
          截止时间 {{ formatTime(voteDetail?.info?.finish_time * 1000) }}
        </div>
        <div v-if="isHost" class="vote-info">
          <span class="join-num">参与人数 {{ voteDetail?.info?.join_user_count }} 人</span>
          <span v-if="!isLookResult" class="look-result" @click="lookResult">查看结果</span>
        </div>
        <van-button
          v-if="!isLookResult" round block type="primary" native-type="submit"
          :disabled="disabled || (voteDetail?.info?.type === 2 ? voteDetail?.info?.min_vote_num !== 0 ? groupChecked.length < voteDetail?.info?.min_vote_num : groupChecked.length === 0 : groupRadio === '')"
        >
          {{ buttonText }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VOTE_TYPE } from '@/enums/vote'
import { formatTime } from '@/utils/date'

const groupChecked = ref([])
const groupRadio = ref('')
const voteDetail: any = inject('voteDetail')
const lookResult: any = inject('lookResult')
const isLookResult: any = inject('isLookResult')
const isHost: any = inject('isHost')
const vote: any = inject('vote')
console.log('voteDetail-=-=-', voteDetail.value)
const buttonText = computed(() => {
  if (voteDetail?.value?.info?.status === 2) {
    return '投票已截止'
  }
  if (voteDetail?.value?.info?.vote_status === 2) {
    return '已投票'
  }
  if (groupChecked.value.length > 0 || groupRadio.value !== '') {
    return '立即投票'
  }
  return '选中选项后投票'
})
const groupCheckedText = computed(() => {
  const obj = voteDetail?.value?.info
  if (obj && obj.type === 2 && obj.max_vote_num) {
    if (obj.max_vote_num === obj.min_vote_num) {
      return `（选择${obj.max_vote_num}个）`
    } else {
      return `（选择${obj.min_vote_num}-${obj.max_vote_num}个）`
    }
  }
  return ''
})
const checkboxMax = computed(() => {
  const obj = voteDetail?.value?.info
  if (obj && obj.type === 2) {
    return obj.max_vote_num
  } else {
    return 0
  }
})

const disabled = computed(() => {
  return voteDetail?.value?.info?.vote_status === 2 || voteDetail?.value?.info?.status === 2
})

function onSubmit() {
  console.log('onSubmit-=-=-', groupChecked.value, groupRadio.value, voteDetail?.value?.info?.type === 2, voteDetail)
  vote({ vote_id: voteDetail?.value?.info?.id, opt_ids: voteDetail?.value?.info?.type === 2 ? groupChecked?.value : [groupRadio?.value] })
}
</script>

<style lang="scss" scoped>
.vote-form {
  text-align: left;
  padding: 21px 29px 160px 24px;

  .title {
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
  }

  .van-field {
    padding-left: 0;
  }

  .van-checkbox-group,
  .van-radio-group {
    width: 100%;
  }

  .van-checkbox,
  .van-radio {
    margin-bottom: 10px;
    align-items: start;
  }

  .vote-box {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 25px;

    .vote-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;

      &.voted {

        .vote-percent,
        .vote-options {
          color: var(--color-primary);
        }
      }

      .vote-options {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        line-height: 22px;
      }

      .vote-percent {
        font-size: 11px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #B5B5B5;
        line-height: 13px;
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 8px;
      }

      .vote-options,
      .vote-percent,
      .vote-info,
      .vote-slider {
        flex: 1;
        width: 100%;
      }

      .vote-slider {
        margin-top: 3px;
      }

      :deep(.van-slider__button-wrapper) {
        display: none;
      }

      :deep(.van-slider--disabled) {
        opacity: unset;
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8.5px 20px 20px 20px;

    .end-time {
      font-size: 13px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #A5A5A5;
      line-height: 18.5px;
    }

    .vote-info {
      font-size: 13px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 18.5px;
      margin-top: 3px;
      display: flex;
      align-items: center;
      gap: 10px;

      .look-result {
        color: var(--color-primary);
      }
    }

    .van-button {
      width: 335px;
      height: 35px;
      background: #FF4F00;
      border-radius: 18.5px;
      margin-top: 13px;
    }
  }
}
</style>
