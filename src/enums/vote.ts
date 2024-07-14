/*
 * @Author: wenshuang
 * @Date: 2024-01-31 16:35:24
 * @LastEditTime: 2024-02-04 15:17:08
 * @LastEditors: wenshuang
 * @Description: 投票
 * @FilePath: /mobile-server/src/enums/vote.ts
 */
// 投z状态
export enum voteStatus {
  '进行中' = 1,
  '已结束' = 2,
}
// 投票类型
export enum voteType {
  '单选' = 1,
  '多选' = 2,
}
// 投票结果类型
export const VOTE_TYPE = {
  1: '单选',
  2: '多选',
}
// 投票结果对象
export const VOTE_RESULT = {
  1: '未投票',
  2: '已投票',
}
// 投票结果
export enum voteResult {
  '未投票' = 1,
  '已投票' = 2,
}
