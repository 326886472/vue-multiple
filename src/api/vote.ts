/*
 * @Author: wenshuang
 * @Date: 2024-01-31 16:33:23
 * @LastEditTime: 2024-03-14 15:11:57
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Description: 投票
 * @FilePath: /mobile-server/src/api/vote.ts
 */
import request from '@/utils/request'
import type { VoteType } from '@/models/vote'
import type { AxiosRequestConfig } from 'axios'

// 获取投票列表
export function fetchVoteList(params: PagingRequest & VoteType.ListParams, config?: AxiosRequestConfig) {
  return request.get<PagingResult<VoteType.ListItem[]>>('/delivery_meeting/vote/list', params, config)
}

// 获取投票详情
export function fetchVoteDetail(params: PagingRequest & VoteType.DetailParams, config?: AxiosRequestConfig) {
  return request.get<PagingResult<VoteType.VoteDetail>>('/delivery_meeting/vote/info', params, config)
}

// 创建投票
export function createVote(params: PagingRequest & VoteType.CreateParams, config?: AxiosRequestConfig) {
  return request.post<PagingResult<VoteType.ListItem>>('/delivery_meeting/vote/add', params, config)
}

// 投票
export function fetchVote(params: PagingRequest & VoteType.VoteParams, config?: AxiosRequestConfig) {
  return request.post<PagingResult<VoteType.ListItem>>('/delivery_meeting/vote/vote', params, config)
}
