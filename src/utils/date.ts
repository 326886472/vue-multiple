/*
 * @Author: wenshuang
 * @Date: 2024-02-02 15:58:39
 * @LastEditTime: 2024-02-04 16:24:30
 * @LastEditors: wenshuang
 * @Description: ge'shi'hu
 * @FilePath: /mobile-server/src/utils/date.ts
 */
// 定义将字符串转换为 Date 对象的函数（如果传入的就是 Date 类型则直接返回）
export function parseDate(dateInput: any) {
  if (dateInput instanceof Date) return dateInput
  return new Date(dateInput)
}

// 定义格式化时间的函数
export function formatTime(dateString: any, pattern = 'yyyy-MM-dd HH:mm') {
  const date = parseDate(dateString)

  const year: any = date.getFullYear()
  const month: any = (`0${date.getMonth() + 1}`).slice(-2)
  const day: any = (`0${date.getDate()}`).slice(-2)
  const hours: any = (`0${date.getHours()}`).slice(-2)
  const minutes: any = (`0${date.getMinutes()}`).slice(-2)

  return pattern.replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
}
