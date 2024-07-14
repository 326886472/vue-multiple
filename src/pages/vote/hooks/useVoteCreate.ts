/*
 * @Author: wenshuang
 * @Date: 2024-01-31 16:04:31
 * @LastEditTime: 2024-02-27 11:36:38
 * @LastEditors: wenshuang
 * @Description: 处理投票逻辑
 * @FilePath: /mobile-server/src/pages/vote/hooks/useVoteCreate.ts
 */
// mouse.js
import qs from 'qs'
import { showToast } from 'vant'
import { ref } from 'vue'
import { createVote } from '@/api/vote'

const query = qs.parse(location.search.slice(1))

export function useVoteCreate() {
  // 展示投票时间弹窗
  const showPicker = ref(false)
  const canSubmit = ref(false) // 是否可以提交
  // 创建表单信息
  const createVoteInfo = reactive({
    title: '', // 投票标题
    type: false, // 投票类型 false:单选 true:多选[1.单选 2.多选]
    options: ['', ''], // 选项内容
    finishTime: '', // 投票结束时间<截止时间 时间格式为 2006-01-02 15:04:05>
    multiple_type: false, // 多选类型 false:单选 true:多选[1.单选 2.多选]
    max_vote_num: 1,
    min_vote_num: 1,
    user_id_list: [], // 投票人列表
    role_type: 0, // 投票权限类型 0.不限 1.指定人群
    show_role_permission: false, // 投票资格弹窗
    role_permission_actions: [
      {
        name: '不限',
      },
      {
        name: '指定成员',
      },
    ],
  })

  const { options, finishTime } = toRefs(createVoteInfo)

  // 校验表单
  function validate(newCreateVoteInfo: any) {
    console.log('newCreateVoteInfo', newCreateVoteInfo)
    if (newCreateVoteInfo.title?.trim().length > 0 && !newCreateVoteInfo.options?.some((it: any) => it?.trim().length === 0) && newCreateVoteInfo.finishTime) {
      return canSubmit.value = true
    }
    return canSubmit.value = false
  }

  // 监听整个createVoteInfo对象的变化
  watch(
    () => createVoteInfo,
    validate,
    { deep: true }, // 设置deep为true以深度监听对象内部属性的变化
  )

  // 创建投票
  async function onCreateVote() {
    try {
      const params: any = {
        dm_id: +(query.dm_id || ''),
        title: createVoteInfo.title, // 投票标题
        type: createVoteInfo.type ? 2 : 1, // 投票类型 1.单选 2.多选
        options: createVoteInfo.options, // 选项内容
        finish_time: [createVoteInfo.finishTime, '00'].join(':'), // 投票结束时间<截止时间 时间格式为 2006-01-02 15:04:05>
        role_type: createVoteInfo.role_type,
        user_id_list: createVoteInfo.user_id_list,
      }

      if (createVoteInfo.multiple_type) {
        params.min_vote_num = Number(createVoteInfo.min_vote_num)
        params.max_vote_num = Number(createVoteInfo.max_vote_num)
      }

      if (createVoteInfo.multiple_type) {
        if (!createVoteInfo.max_vote_num || !createVoteInfo.min_vote_num) {
          showToast('请填写多选限制')
          return
        }
        if (createVoteInfo.max_vote_num && createVoteInfo.options.length < createVoteInfo.max_vote_num) {
          showToast('多选投票限制数与投票选择数冲突，请查验')
          return
        }
        if (createVoteInfo.max_vote_num && createVoteInfo.options.length < createVoteInfo.min_vote_num) {
          showToast('多选投票限制数与投票选择数冲突，请查验')
          return
        }
        if (createVoteInfo.max_vote_num < createVoteInfo.min_vote_num) {
          showToast('多选最大投票限制数不能小于最小投票数')
          return
        }
      }

      console.log('params---=-=', params, createVoteInfo)
      const { code } = await createVote(params)
      console.log('res--创建投票-=-=', code)
      if (code !== 0) {
        showToast('创建投票失败')
        return
      }
      showToast('创建投票成功')
      return true
    } catch (error: any) {
      showToast(error)
    }
  }

  // 修改选项
  function updateVoteItem(newOptions: Array<string>) {
    options.value = newOptions
  }
  // 时间选择
  function onDateTimeConfirm(dateTime: string) {
    finishTime.value = dateTime
    // 关闭选择器
    showPicker.value = false
  }

  // 通过返回值暴露所管理的状态
  return {
    canSubmit,
    showPicker,
    createVoteInfo,
    onCreateVote,
    updateVoteItem,
    onDateTimeConfirm,
  }
}
