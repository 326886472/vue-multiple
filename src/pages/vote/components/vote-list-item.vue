<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 13:45:34
 * @LastEditTime: 2024-02-04 15:47:44
 * @LastEditors: wenshuang
 * @Description 投票记录
 * @FilePath: /mobile-server/src/pages/vote/components/vote-list-item.vue
-->
<template>
  <div class="vote-list-item" :class="item.status === 2 ? 'end' : ''" @click="onItemClick(item)">
    <tag class="status" :type="(item.vote_status === 2 || item.status === 2) ? 'normal' : 'primary'">
      {{ VOTE_RESULT[item.vote_status] }}
    </tag>
    <div class="title">
      {{ item.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from '@/components/tag/index.vue'
import { VOTE_RESULT } from '@/enums/vote'
import type { VoteType } from '@/models/vote'

defineProps<{ item: VoteType.ListItem }>()

const onItemClick: any = inject('onItemClick')

// console.log statement removed
</script>

<style lang="scss" scoped>
.vote-list-item {
  height: 69px;
  padding-left: 10px;
  border-bottom: 1px solid #F7F8FA;
  display: flex;
  align-items: center;
  gap: 10px;

  &.end {
    .title {
      color: #C2C2C2;
    }
  }

  .title {
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    overflow: hidden;
    max-width: 268px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
