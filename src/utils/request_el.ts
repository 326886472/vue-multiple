/*
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-20 13:18:17
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-16 18:09:23
 * @FilePath: /mobile-server/src/utils/request_el.ts
 * @Description: 这里用ElementUI实现的toast 拦截器里的token用的是cookie里的c_token
 */
import axios from 'axios'

import { ElMessage } from 'element-plus'
import { stringify } from 'jsonfile/utils'

// H5 调试用
import { ResponseEnum } from '@/enums/http'
import { getToken } from './auth'
import { FZ_JsBridge } from './js_bridge'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL: any = {
  test: 'https://dev-user-api.foundingaz.com/api/v3',
  development: 'https://dev-user-api.foundingaz.com/api/v3',
  audit: 'https://audit-user-api.foundingaz.com/api/v3',
  production: 'https://user-api.cyjiaomu.com/api/v3',
  prod: 'https://user-api.cyjiaomu.com/api/v3',
}

const PC_API_BASE_URL: any = {
  test: 'https://dev-user-api.foundingaz.com/api',
  development: 'https://dev-user-api.foundingaz.com/api',
  audit: 'https://audit-user-api.foundingaz.com/api',
  production: 'https://user-api.cyjiaomu.com/api',
  prod: 'https://user-api.cyjiaomu.com/api',
}

const HOST_URL: any = {
  test: 'https://dev-xuexi.foundingaz.com/',
  development: 'https://dev-xuexi.foundingaz.com/',
  audit: 'https://audit-xuexi.foundingaz.com/',
  production: 'https://xuexi.cyjiaomu.com/',
  prod: 'https://xuexi.cyjiaomu.com/',
}

window.gohtml_inject = {
  env: 'test',
}
function isURLContains(substring: string): boolean {
  return window.location.href.includes(substring)
}

const URL = (function () {
  if (isURLContains('vote')) {
    return API_BASE_URL[import.meta.env.MODE]
  } else if (isURLContains('studentEntry')) { // 录入学员用
    return PC_API_BASE_URL[import.meta.env.MODE]
  } else {
    return PC_API_BASE_URL[import.meta.env.MODE]
  }
})()

console.log('URL---=', import.meta.env, URL)
const config = {
  // 默认地址
  baseURL: URL,
  // 设置超时时间
  timeout: 10000,
  // 跨域时候允许携带凭证
  withCredentials: true,
}

class RequestHttp {
  service: AxiosInstance
  public constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)

    /**
     * 请求拦截器
     */
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getToken()
        if (token) {
          config.headers.token = token
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    /**
     * 响应拦截器
     */
    this.service.interceptors.response.use(
      // 2xx 时触发
      (response) => {
        const res = response.data
        // 响应数据为二进制流
        if (res instanceof ArrayBuffer) return res
        // 响应错误
        if (res.code !== ResponseEnum.SUCCESS) {
          if(res.code === 401) {
            window.parent.postMessage({ toLogin: true }, '*')
          }
          ElMessage({
            message: res.message || res.msg || 'Request Error',
            type: 'error',
          })
          return Promise.reject(res.message || 'Request Error')
        }
        return res
      },
      // 非 2xx 时触发
      (error) => {
        if (axios.isCancel(error)) {
          console.error(error.message)
        } else if (error?.message) {
          ElMessage({
            message: error.message,
            type: 'error',
          })
        }
        return Promise.reject(error)
      },
    )
  }

  get<T = any>(url: string, params?: Record<string, any>, config: AxiosRequestConfig = {}): Promise<HttpResponse<T>> {
    return this.service.get(url, { params, ...config })
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return this.service.post(url, data, config)
  }

  baseUrl() {
    return URL
  }
}

export default new RequestHttp(config)
