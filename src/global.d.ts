/*
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-20 14:26:43
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-03-20 14:27:05
 * @FilePath: /mobile-server/global.d.ts
 * @Description: 声明变量，避免jenkins打包报错
 */
declare interface Window {
  clog(message?: any, ...optionalParams: any[]): void
  voteUserList: (userList: any) => void
  listenerElHeightById: (id: string, offset?: number) => void
  emitParentCanScroll: (flag: any) => void
}
