/*
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-08 09:21:51
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-03-20 18:43:02
 * @FilePath: /mobile-server/types/global.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 普通函数
 */
interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

/**
 * 异步函数
 */
interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

/**
 * 分页请求
 */
interface PagingRequest {
  pageNum: number
  pageSize: number
}

/**
 * 返回分页信息
 */
interface PagingResult<T> {
  count: number
  list: T
}

/**
 * 返回封装
 */
interface HttpResponse<T = unknown> {
  msg: string
  code: number
  data: T
}

declare interface Window {
  clog(message?: any, ...optionalParams: any[]): void
  gohtml_inject?: any
}
