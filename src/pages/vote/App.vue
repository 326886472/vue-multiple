<!--
 * @Author: wenshuang
 * @Date: 2024-01-31 10:33:49
 * @LastEditTime: 2024-02-06 09:54:11
 * @LastEditors: wenshuang
 * @Description: 投票
 * @FilePath: /mobile-server/src/pages/vote/App.vue
-->
<template>
  <div class="container">
    <van-nav-bar :title="title" :border="false">
      <template #left>
        <div v-if="!isHome" class="create van-nav-bar__text black_color" @click="goBack">
          <van-icon name="arrow-left" size="18" />
        </div>
        <div v-else class="create van-nav-bar__text black_color" @click="destroy">
          <van-icon name="cross" />
        </div>
      </template>
      <template v-if="!hideRightButton" #right>
        <div class="create van-nav-bar__text" @click="switchPage('create')">
          <van-icon name="plus" size="18" />新建
        </div>
      </template>
    </van-nav-bar>
    <main ref="mainRef">
      <!-- 创建投票 -->
      <vote-form-create v-if="createVisible" @go-back="goBack" />
      <!-- 投票 -->
      <vote-form v-else-if="visible" />
      <!-- 投票列表 -->
      <vote-list v-else :vote-list="voteList" :main-ref="mainRef" @item-click="showVoteDetail" @refresh="goBack" />
    </main>
  </div>
</template>

<script setup lang="ts">
import VanNavBar from 'vant/lib/nav-bar'
import { useVote } from '@/pages/vote/hooks/useVote'
import VoteFormCreate from './components/vote-form-create.vue'
import VoteForm from './components/vote-form.vue'
import VoteList from './components/vote-list.vue'
import 'vant/lib/nav-bar/style'

const mainRef = ref(null)
const { isHost, isHome, destroy, title, isLookResult, lookResult, visible, createVisible, goBack, getVoteDetail, voteDetail, vote, voteList, switchPage, getVoteList, loading, finished, refreshing } = useVote()
const hideRightButton = computed(() => !isHost || createVisible.value || visible.value)
function showVoteDetail(item: any) {
  getVoteDetail(item.id)
  switchPage('detail')
}
provide('onItemClick', showVoteDetail)
provide('voteDetail', voteDetail)
provide('vote', vote)
provide('getVoteList', getVoteList)

provide('loading', loading)
provide('finished', finished)
provide('refreshing', refreshing)
provide('lookResult', lookResult)
provide('isLookResult', isLookResult)
provide('isHost', isHost)
</script>

<style lang="scss" scoped>
html,
body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }
}

.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;

  .create {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: var(--color-primary);
    line-height: 21px;

    &.black_color {
      :deep(.van-icon) {
        color: #333333;
      }
    }
  }

  >main {
    flex: 1;
    height: calc(100vh - 46px);
    overflow-x: hidden;
    overflow-y: auto;
  }

  .loading {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
