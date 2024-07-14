/*
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-14 14:49:53
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-03-20 13:41:15
 * @FilePath: /mobile-server/src/api/studentEntry.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request_el'

// 获取训练营列表
export function deliveryList(params) {
  return request.get('/v9/delivery/list', params)
}

// 获取学员列表
export function studentList(params) {
  return request.get('/v9/student/list', params)
}

// 删除学员
export function removeStudent(params) {
  return request.post('/v9/student/remove', params)
}

// 获取国际区号列表
export function getCountryCodeList(params) {
  return request.get('/country-code-list', params)
}

// 获取常用国际区号列表
export function getNormalCountryCodeList(params) {
  return request.get('/normal-country-code-list', params)
}

// 新增学员
export function addStudent(params) {
  return request.post('/v9/student/add', params)
}

// 导入学员
export function importStudent(url, params, config = {}) {
  return request.post(url, params, config)
}

export function ApiEnums() {
  return {

  }
}

export function SingIn(params) {
  return request.post('/v9/delivery/section/sign_in', params)
}

export function baseUrl() {
  return request.baseUrl()
}
