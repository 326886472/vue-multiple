<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 13:45:34
 * @LastEditTime: 2024-02-26 19:40:21
 * @LastEditors: wenshuang
 * @Description 投票记录列表
 * @FilePath: /mobile-server/src/pages/vote/components/vote-list.vue
-->
<template>
  <van-pull-refresh v-if="voteList.length > 0" v-model="refreshing" @refresh="refresh">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :offset="10" @load="getVoteList">
      <vote-list-item v-for="item in voteList" :key="item.id" :item="item" />
    </van-list>
  </van-pull-refresh>
  <van-empty
    v-else description="暂无投票历史" class="custom-image"
    image="https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/web-h5/image/mobile-server/wuicon.png"
  />
</template>

<script setup lang="ts">
import VoteListItem from './vote-list-item.vue'

defineProps(['voteList', 'refresh', 'mainRef'])

const loading: any = inject('loading')
const finished: any = inject('finished')
const refreshing: any = inject('refreshing')
const getVoteList: any = inject('getVoteList')
</script>

<style lang="scss" scoped>
.custom-image {
  :deep(.van-empty__image) {
    width: 55px;
    height: 58px;
  }

  :deep(.van-empty__description) {
    margin-top: 10px;
    font-size: 13px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #CCCCCC;
    line-height: 18.5px;
  }

}
:deep(.van-list){
  padding-left: 14px;
}
</style>
