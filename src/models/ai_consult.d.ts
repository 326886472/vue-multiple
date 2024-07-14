import type { voteResult, voteStatus, voteType } from '@/enums/vote'

/*
 * @Author: wenshuang
 * @Date: 2024-01-31 16:34:10
 * @LastEditTime: 2024-05-13 14:08:09
 * @LastEditors: wenshuang
 * @Description: ai 百宝箱
 * @FilePath: /mobile-server/src/models/ai_consult.d.ts
 */
// 售前
declare namespace AiConsultPreSalesType {
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

  // 投票列表结果
  interface ListItem {
    'id': number // 投票ID
    'title': string
    'finish_time': number // 截止时间 秒时间戳
    'status': voteStatus // 状态 1.进行中 2.已结束
    'vote_status': voteResult // 投票状态 1.未投票 2.已投票
  }

  // Teachers
  interface Teachers {
    'id': number // 投票ID
    'title': string
    'finish_time': number // 截止时间 秒时间戳
    'status': voteStatus // 状态 1.进行中 2.已结束
    'vote_status': voteResult // 投票状态 1.未投票 2.已投票
  }
  // LoginStaff
  interface Teachers {
    'id': number // 投票ID
    'title': string
    'finish_time': number // 截止时间 秒时间戳
    'status': voteStatus // 状态 1.进行中 2.已结束
    'vote_status': voteResult // 投票状态 1.未投票 2.已投票
  }
}
