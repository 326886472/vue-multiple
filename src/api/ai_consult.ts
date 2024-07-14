/*
 * @Author: wenshuang
 * @Date: 2024-05-07 20:02:05
 * @LastEditTime: 2024-05-13 16:30:59
 * @LastEditors: wenshuang
 * @Description: 请求数据
 * @FilePath: /mobile-server/src/api/ai_consult.ts
 */

import * as mock from '@/mock/ai_consult'
import request from '@/utils/request'
import type { AiConsultPreSalesType } from '@/models/ai_consult'
import type { AxiosRequestConfig } from 'axios'

// 售前咨询-----start-------
/**
 * @description: 获取咨询老师列表
 * @param {PagingRequest} params
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
export function getPreSalesTeachers(params?: any, config: AxiosRequestConfig = { headers: { useWebToken: true } }) {
  console.log('🚀 ~ getCategoryList ~ config:', config)
  console.log('🚀 ~ getCategoryList ~ params:', params)
  return request.get<PagingResult<AiConsultPreSalesType.Teachers[]>>('/consult_gpt/teacher/list', params, config)
  // return mock.getPreSalesTeachers()
}

/**
 * @description: 获取咨询产品分类列表
 * @return {*}
 */
export function getPreSalesCategories(params?: any, config: AxiosRequestConfig = { headers: { useWebToken: true } }) {
  console.log('🚀 ~ getCategoryList ~ config:', config)
  console.log('🚀 ~ getCategoryList ~ params:', params)
  return request.get<PagingResult<any[]>>('/consult_gpt/category/list', params, config)
  // return mock.getPreSalesCategories()
}

/**
 * @description: 创建咨询任务
 * @return {*}
 */
export function createPreSalesTask(params: any, config: AxiosRequestConfig = { headers: { useWebToken: true } }) {
  console.log('🚀 ~ createTask ~ config:', config)
  console.log('🚀 ~ getTeacherList ~ params:', params)
  // return mock.createPreSalesTask()
  return request.post<PagingResult<any>>('/consult_gpt/new', params, config)
}

/**
 * @description: 咨询任务表
 * @return {*}
 */
export function getPreSalesTaskList(params: any, config: AxiosRequestConfig = { headers: { useWebToken: true } }) {
  console.log('🚀 ~ getTaskList ~ config:', config)
  console.log('🚀 ~ 咨询任务表 ~ params:', params)
  // return mock.getPreSalesTaskList()
  return request.get<PagingResult<any[]>>('/consult_gpt/task/list', params, config)
}

/**
 * @description: 钉钉登录
 * @return {*}
 */
export function loginStaff(params?: any, config: AxiosRequestConfig = { headers: { useWebToken: true } }) {
  console.log('🚀 ~ loginStaff ~ config:', config)
  console.log('🚀 ~ loginStaff ~ params:', params)
  // return mock.downloadPreSalesPPT()
  return request.post<PagingResult<any>>('/login/staff', params, config)
}

/**
 * @description: 获取授权
 * @return {*}
 */
export function getAuth(params?: any, config: AxiosRequestConfig = { headers: { useWebToken: true } }) {
  console.log('🚀 ~ getAuth ~ config:', config)
  console.log('🚀 ~ getAuth ~ params:', params)
  // return mock.downloadPreSalesPPT()
  return request.get<PagingResult<any>>('/admin/auth', params, config)
}
// 售前咨询-----end-------
