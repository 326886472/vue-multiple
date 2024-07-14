import type { voteResult, voteStatus, voteType } from '@/enums/vote'

/*
 * @Author: wenshuang
 * @Date: 2024-01-31 16:34:10
 * @LastEditTime: 2024-02-01 19:33:06
 * @LastEditors: wenshuang
 * @Description: 投票
 * @FilePath: /mobile-server/src/models/vote.d.ts
 */
declare namespace VoteType {
  // 请求投票列表参数
  interface ListParams {
    dm_id: string// 会议ID
    page: number // 页码
    limit: number // 每页条数
  }

  // 获取投票详情请求参数
  interface DetailParams {
    id: string | number // 投票ID
  }

  // 创建投票请求参数
  interface CreateParams {
    'dm_id': number // 会议ID
    'type': voteType // 投票类型 1.单选 2.多选
    'title': string // '<投票标题>'
    'options': Array<string | number> // ['<选项内容>']
    'finish_time': string// '<截止时间 时间格式为 2006-01-02 15:04:05>'
  }

  // 投票请求参数
  interface VoteParams {
    'vote_id': number // 投票ID
    'opt_ids': Array<number> //
  }

  // 投票列表结果
  interface ListItem {
    'id': number // 投票ID
    'title': string
    'finish_time': number // 截止时间 秒时间戳
    'status': voteStatus // 状态 1.进行中 2.已结束
    'vote_status': voteResult // 投票状态 1.未投票 2.已投票
  }

  // 投票选项
  interface VoteOptionsItem {
    'id': number
    'vote_id': number
    'name': string
  }
  // 投票列表结果
  interface VoteStatusItem {
    'id': number
    'vote_id': number
    'name': string
    'count': number
    'has_vote': boolean
    'percent': string
  }

  // 投票列表详情
  interface VoteDetail {
    info: {
      'id': number
      'title': string
      'type': number
      'finish_time': number
      'status': number
      'vote_status': number
      'options': Array<VoteOptionsItem>
      'stats': Array<VoteStatusItem>
      'join_user_count': number
    }
  }

  // 创建投票列表元素
  interface CreateItem {
    'dm_id': number // 会议ID
    'type': voteType // 投票类型 1.单选 2.多选
    'title': string // '<投票标题>'
    'options': Array<VoteOptions> // ['<选项内容>']
    'finish_time': string // '<截止时间 时间格式为 2006-01-02 15:04:05>'
  }

  // 投票选项
  interface VoteOptions {
    'id': number // 选项ID
    'name': string // '<选项名称>'
    'vote_id': number // 投票ID
  }

  // 投票结果选项
  interface VoteResultItem {
    'id': 1 // 选项ID
    'vote_id': 1 // 投票ID
    'name': '<选项名称>'
    'count': 1 // 投票数量
    'has_vote': true // 是否已投
    'percent': '<占比 100% >'
  }

  // 获取投票详情
  interface VoteDetail {
    'id': number // 投票ID
    'title': string // '<投票标题>'
    'type': voteType // 类型 1.单选 2.多选
    'finish_time': number // 截止时间 秒时间戳
    'status': voteStatus // 状态 1.进行中 2.已结束
    'vote_status': voteResult // 投票状态 1.未投票 2.已投票
    // 投票选项
    'options': Array<VoteOptions>
    // 投票统计  注意，该内容只有在投票状态是已投票 或 当前人是主持人的情况下返回
    'stats': Array<VoteResultItem> // 投票结果选项
    'join_user_count': number // 参与人数 注意，该内容只有在投票状态是已投票 或 当前人是主持人的情况下返回
  }
}
