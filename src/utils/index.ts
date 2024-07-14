/*
 * @Author: wenshuang
 * @Date: 2023-11-10 14:53:56
 * @LastEditTime: 2024-05-14 12:04:55
 * @LastEditors: wenshuang
 * @Description: 工具函数
 * @FilePath: /mobile-server/src/utils/index.ts
 */

/**
 * 获取当前页面的URL参数
 */
export function getCurrentURLParams(): Map<string, string> {
  const params = new Map<string, string>()

  new URLSearchParams(window.location.search).forEach((value, key) => {
    params.set(key, value)
  })

  return params
}

/**
 * 获取指定范围内的随机整数
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * sleep
 */
export function sleep(ms = 800) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * isAndroid
 */
export function isAndroid() {
  return /Android/i.test(navigator.userAgent)
}

/**
 * isMobile
 */
export function isMobileDevice() {
  return /mobile|android|iphone|ipad/i.test(navigator.userAgent)
}

// 枚举转数组
export function enum2Array(params: any) {
  const res: Array<any> = []
  Object.entries(params).forEach(([key, value]) => {
    if (!Number.isNaN(Number(key))) {
      return // 过滤掉数字键
    }
    res.push({
      key,
      value,
    })
  })
  return res
}

// 监听键盘事件将输入框放入可视区
export function scrollIntoView(el: any) {
  // 防止底部“其他登录方式”被软键盘顶起
  el?.target?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  })
}
