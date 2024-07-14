/*
 * @Author: wenshuang
 * @Date: 2024-05-13 11:51:04
 * @LastEditTime: 2024-05-13 17:20:52
 * @LastEditors: wenshuang
 * @Description: 文件处理
 * @FilePath: /mobile-server/src/utils/file.ts
 */

/**
 * @description: 下载
 * @param {*} url 文件下载地址
 * @param {*} fileName 文件名
 * @return {*}
 */
export function downloadFile(url: string, fileName: string) {
  // 创建隐藏的可下载链接
  const element = document.createElement('a')
  element.setAttribute('href', url)
  element.setAttribute('target', '_blank')
  element.setAttribute('download', fileName)

  // 触发点击
  document.body.appendChild(element)
  element.click()

  // 然后移除
  document.body.removeChild(element)
}
