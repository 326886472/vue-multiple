/*
 * @Author: wenshuang
 * @Date: 2023-11-10 14:53:56
 * @LastEditTime: 2024-05-13 16:32:34
 * @LastEditors: wenshuang
 * @Description: 请求
 * @FilePath: /mobile-server/src/utils/request.ts
 */
import axios from 'axios'

import { stringify } from 'jsonfile/utils'

// H5 调试用
import { showToast } from 'vant'
import { ResponseEnum } from '@/enums/http'
import { getToken } from './auth'
import { FZ_JsBridge } from './js_bridge'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

export const API_BASE_URL: any = {
  test: 'https://dev-user-api.foundingaz.com/api/v3',
  development: 'https://dev-user-api.foundingaz.com/api/v3',
  audit: 'https://audit-user-api.foundingaz.com/api/v3',
  production: 'https://user-api.cyjiaomu.com/api/v3',
  prod: 'https://user-api.cyjiaomu.com/api/v3',
}

export const PC_API_BASE_URL: any = {
  test: 'https://dev-user-api.foundingaz.com/api',
  development: 'https://dev-user-api.foundingaz.com/api',
  audit: 'https://audit-user-api.foundingaz.com/api',
  production: 'https://user-api.cyjiaomu.com/api',
  prod: 'https://user-api.cyjiaomu.com/api',
}

export const AI_API_BASE_URL: any = {
  test: 'https://dev-analyze.foundingaz.com/api',
  development: 'https://dev-analyze.foundingaz.com/api',
  audit: 'https://audit-analyze.foundingaz.com/api',
  production: 'https://crm.foundingaz.com/api',
  prod: 'https://crm.foundingaz.com/api',
}

function isURLContains(substring: string): boolean {
  return window.location.href.includes(substring)
}

export const BaseURL = (function () {
  if (isURLContains('vote')) {
    return API_BASE_URL[import.meta.env.MODE]
  } else if (isURLContains('studentEntry')) {
    return PC_API_BASE_URL[import.meta.env.MODE]
  } else if (isURLContains('ai_')) { // AI相关
    return AI_API_BASE_URL[import.meta.env.MODE]
  } else {
    return PC_API_BASE_URL[import.meta.env.MODE]
  }
})()

console.log('URL---=', import.meta.env, BaseURL)
const config = {
  // 默认地址
  baseURL: BaseURL,
  // 设置超时时间
  timeout: 10000,
  // 跨域时候允许携带凭证
  // withCredentials: true,
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
        console.log('🚀 ~ RequestHttp ~ constructor ~ config:', config)
        const isWeb = window.location.href.includes('localhost') || config?.headers?.useWebToken
        delete config?.headers?.useWebToken
        const token = isWeb ? getToken() : FZ_JsBridge.getToken()
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
          return Promise.reject(res.message || 'Request Error')
        }
        return res
      },
      // 非 2xx 时触发
      (error) => {
        if (axios.isCancel(error)) {
          console.error(error.message)
        } else if (error?.message) {
          showToast(error.message)
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
