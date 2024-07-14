/*
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-14 14:49:53
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-16 18:11:11
 * @FilePath: /mobile-server/src/api/studentEntry.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request_el'

// 获取TDL日计划详情
export function tdlDayDetail(params) {
  return request.post('/v/tdl/day/detail?v=1.0', params).then(res => res.data)
}
// 获取TDL周计划详情
export function tdlWeekDetail(params) {
  return request.post('/v/tdl/week/detail?v=1.0', params).then(res => res.data)
}

// 11. 新建TDL日计划
export function tdlDayNew(params) {
  return request.post('/v/tdl/day/add?v=1.0', params).then(res => res.data)
}
// 11. 新建TDL周目标
export function tdlWeekNew(params) {
  return request.post('/v/tdl/week/add?v=1.0', params).then(res => res.data)
}
// 15. 编辑TDL日计划
export function tdlDayUpdate(params) {
  return request.post('/v/tdl/day/update?v=1.0', params).then(res => res.data)
}
// 15. 编辑TDL周计划
export function tdlWeekUpdate(params) {
  return request.post('/v/tdl/week/update?v=1.0', params).then(res => res.data)
}
// 10. 获取TDL日计划总览
export function tdlDayOverview(params) {
  return request.post('/v/tdl/day/overview?v=1.0', params).then(res => res.data)
}
// 11. 获取TDL周计划总览

export function tdlWeekOverview(params) {
  return request.post('/v/tdl/week/overview?v=1.0', params).then(res => res.data)
}

// 12. 总结TDL日计划
export function tdlDaySummary(params) {
  return request.post('/v/tdl/day/summary?v=1.0', params).then(res => res.data)
}
// 12. 总结TDL周计划
export function tdlWeekSummary(params) {
  return request.post('/v/tdl/week/summary?v=1.0', params).then(res => res.data)
}
// 13. 完成TDL日计划目标
export function tdlDayFinishTarget(params) {
  return request.post('/v/tdl/day/finish_target?v=1.0', params).then(res => res.data)
}

// 14. 取消完成TDL日计划目标
export function tdlDayRecoverTarget(params) {
  return request.post('/v/tdl/day/recover_target?v=1.0', params).then(res => res.data)
}
// 16. 获取上一次日计划目标
export function tdlLastDayTarget(params) {
  return request.post('/v/tdl/day/last_targets?v=1.0', params).then(res => res.data)
}

// 18. 修改日计划目标
export function tdlLastDayModifyTarget(params) {
  return request.post('/v/tdl/day/modify/target?v=1.0', params).then(res => res.data)
}
// 18. 修改周计划目标
export function tdlLastWeekModifyTarget(params) {
  return request.post('/v/tdl/week/modify/target?v=1.0', params).then(res => res.data)
}

// 29. 获取上周计划目标
export function tdlLastWeekList(params) {
  return request.post('/v/tdl/week/last_targets?v=1.0', params).then(res => res.data)
}
// 41. 更新周目标进度
export function tdlWeekUpdatePercent(params) {
  return request.post('/v/tdl/week/finish_target?v=1.0', params).then(res => res.data)
}

// 41. 获取TDL发现列表
export function tdlRecommend(params) {
  return request.post('/v/tdl/recommend?v=1.0', params).then(res => res.data)
}
//  点赞周计划
export function tdlWeekLike(params) {
  return request.post('/v/tdl/week/interaction/like?v=1.0', params).then(res => res.data)
}
//  取消点赞周计划
export function tdlWeekCancelLike(params) {
  return request.post('/v/tdl/week/interaction/cancel-like?v=1.0', params).then(res => res.data)
}
//  点赞日计划
export function tdlDayLike(params) {
  return request.post('/v/tdl/day/interaction/like?v=1.0', params).then(res => res.data)
}
//  取消点赞日计划
export function tdlDayCancelLike(params) {
  return request.post('/v/tdl/day/interaction/cancel-like?v=1.0', params).then(res => res.data)
}

//  获取勋章详情

export function medalDetail(params) {
  return request.post('/v/medal/detail?v=1.0', params).then(res => res.data)
}
// 17. 获取日计划三方详情 /tdl/day/custom_detail
export function tdlDayCustomDetail(params) {
  return request.post('/v/tdl/day/custom_detail?v=1.0', params).then(res => res.data)
}

// 18 获取周计划三方详情 /tdl/week/custom_detail
export function tdlWeekCustomDetail(params) {
  return request.post('/v/tdl/week/custom_detail?v=1.0', params).then(res => res.data)
}
//  获取日计划评论列表
export function tdlDayInteractionCommentList(params) {
  return request.post('/v/tdl/day/interaction/comment/list?v=1.0', params).then(res => res.data)
}
//  新增日计划评论
export function tdlDayInteractionCommentAdd(params) {
  return request.post('/v/tdl/day/interaction/comment/add?v=1.0', params).then(res => res.data)
}
//  删除日计划评论
export function tdlDayInteractionCommentDel(params) {
  return request.post('/v/tdl/day/interaction/comment/delete?v=1.0', params).then(res => res.data)
}
//  点赞日计划评论
export function tdlDayInteractionCommentLike(params) {
  return request.post('/v/tdl/day/interaction/comment/like?v=1.0', params).then(res => res.data)
}
//  取消点赞日计划评论
export function tdlDayInteractionCommentCancelLike(params) {
  return request.post('/v/tdl/day/interaction/comment/cancel-like?v=1.0', params).then(res => res.data)
}

//  获取周计划评论列表
export function tdlWeekInteractionCommentList(params) {
  return request.post('/v/tdl/week/interaction/comment/list?v=1.0', params).then(res => res.data)
}
//  新增周计划评论
export function tdlWeekInteractionCommentAdd(params) {
  return request.post('/v/tdl/week/interaction/comment/add?v=1.0', params).then(res => res.data)
}
//  删除周计划评论
export function tdlWeekInteractionCommentDel(params) {
  return request.post('/v/tdl/week/interaction/comment/delete?v=1.0', params).then(res => res.data)
}
//  点赞周计划评论
export function tdlWeekInteractionCommentLike(params) {
  return request.post('/v/tdl/week/interaction/comment/like?v=1.0', params).then(res => res.data)
}
//  取消点赞周计划评论
export function tdlWeekInteractionCommentCancelLike(params) {
  return request.post('/v/tdl/week/interaction/comment/cancel-like?v=1.0', params).then(res => res.data)
}
// 更新日计划状态
export function tdlDayModifyStatus(params) {
  return request.post('/v/tdl/day/modify/status?v=1.0', params).then(res => res.data)
}
// 更新周计划状态
export function tdlWeekModifyStatus(params) {
  return request.post('/v/tdl/week/modify/status?v=1.0', params).then(res => res.data)
}
// 获取日计划导入列表
export function tdlDayImportList(params) {
  return request.post('/v/tdl/day/import_list?v=1.0', params).then(res => res.data)
}
// 获取周计划导入列表
export function tdlWeekImportList(params) {
  return request.post('/v/tdl/week/import_list?v=1.0', params).then(res => res.data)
}

// 删除日计划
export function tdlDayDelete(params) {
  return request.post('/v/tdl/day/delete?v=1.0', params).then(res => res.data)
}
// 删除周计划
export function tdlWeekDelete(params) {
  return request.post('/v/tdl/week/delete?v=1.0', params).then(res => res.data)
}


export function baseUrl() {
  return request.baseUrl()
}
