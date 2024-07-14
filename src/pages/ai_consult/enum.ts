/*
 * @Author: wenshuang
 * @Date: 2024-05-11 20:37:06
 * @LastEditTime: 2024-05-11 20:38:37
 * @LastEditors: wenshuang
 * @Description: 配置枚举
 * @FilePath: /mobile-server/src/pages/ai_consult/enum.ts
 */
export enum ConsultType {
  '售前报告' = 1,
  '诊断报告' = 2,
  '交付报告' = 3,
}
export enum ConsultStatus {
  '待开始' = 1,
  '进行中' = 2,
  '处理完成' = 3,
  '处理失败' = 4,
  '已取消' = 5,
}
