/*
 * @Author: wenshuang
 * @Date: 2024-01-31 16:04:31
 * @LastEditTime: 2024-02-06 10:56:11
 * @LastEditors: wenshuang
 * @Description: 处理投票逻辑
 * @FilePath: /mobile-server/src/pages/vote/hooks/useVote.ts
 */
// mouse.js
import qs from 'qs'
import { showToast } from 'vant'
import { onUnmounted, ref } from 'vue'
import { fetchVote, fetchVoteDetail, fetchVoteList } from '@/api/vote'
import { FZ_JsBridge } from '@/utils/js_bridge'
import type { VoteType } from '@/models/vote'

const query: any = qs.parse(location.search.slice(1))
const pageInfo = {
  page: 1,
  limit: 10,
}

export function useVote() {
  const isHost = +query.role === 1
  const isHome = ref<boolean>(true) // 是否首页
  const visible = ref<boolean>(false) // 是否显示投票弹窗
  const isLookResult = ref<boolean>(false) // 是否强制查看结果【主持人特有】
  const createVisible = ref<boolean>(false) // 是否显示创建投票弹窗
  const voteList = ref<Array<VoteType.ListItem>>([]) // 投票列表
  const createVoteList = ref<Array<string>>(['']) // 创建投票列表
  const voteDetail = ref<any>({}) // 投票详情
  const title = ref<string>('投票') // 标题管理

  // 加载逻辑
  const loading = ref(false)
  const finished = ref(false)
  const refreshing = ref(false)

  // 查看结果
  function lookResult() {
    title.value = '查看结果'
    isLookResult.value = true
  }

  // 获取投票列表
  async function getVoteList() {
    console.log('获取投票列表...', loading.value)
    if (refreshing.value) {
      pageInfo.page = 1
      voteList.value = []
      refreshing.value = false
    }
    try {
      loading.value = true
      // 请求投票列表
      const res = await fetchVoteList({
        ...pageInfo,
        dm_id: query.dm_id,
      } as any)
      voteList.value = [...voteList.value, ...res.data.list]
      if (res.data.list.length === pageInfo.limit) {
        pageInfo.page++
        finished.value = false
      } else {
        finished.value = true
      }
    } finally {
      loading.value = false
    }
  }
  // 获取投票详情
  async function getVoteDetail(id: string) {
    // 请求投票列表
    const res = await fetchVoteDetail({ id } as any)
    console.log('res-getVoteDetail--', res)
    voteDetail.value = res.data
  }

  // 投票
  async function vote(params: any) {
    console.log('params---=-=', params)
    try {
      const { code, message = '投票失败' }: any = await fetchVote(params)
      console.log('res--投票-=-=', code)
      if (code !== 0) {
        return showToast(message)
      }
      showToast('投票成功')
      getVoteDetail(params.vote_id)
    } catch (error: any) {
      console.log('error-=-=-', error)
      showToast(error)
    }
  }

  // 重置数据
  function resetData() {
    pageInfo.page = 1
    title.value = '投票'
    isHome.value = true
    visible.value = false
    createVisible.value = false
    isLookResult.value = false
    voteList.value = []
    createVoteList.value = []
    voteDetail.value = null
  }

  // 返回
  function goBack() {
    resetData()
    nextTick(getVoteList)
  }

  // 销毁弹窗
  function destroy() {
    console.log('销毁弹窗')
    FZ_JsBridge.closeDialog()
  }

  // 切换页面
  function switchPage(page: string) {
    switch (page) {
      case 'create':
        isHome.value = false
        createVisible.value = true
        visible.value = false
        title.value = '创建投票'
        break
      case 'detail':
        isHome.value = false
        createVisible.value = false
        visible.value = true
        title.value = '投票'
        break
      default:
        isHome.value = false
        createVisible.value = false
        visible.value = true
        title.value = '投票'
        break
    }
  }

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => {
    console.log('onBeforeMount')
    getVoteList()
    document.body.removeChild(document.getElementById('skeleton_screen') as HTMLDivElement)
  })

  // 初始化数据
  onUnmounted(resetData)

  // 通过返回值暴露所管理的状态
  return {
    title,
    loading,
    isHost,
    isHome,
    isLookResult,
    finished,
    refreshing,
    query,
    destroy,
    goBack,
    visible,
    voteList,
    voteDetail,
    vote,
    lookResult,
    switchPage,
    getVoteDetail,
    getVoteList,
    createVoteList,
    createVisible,
  }
}
