/*
 * @Author: wenshuang
 * @Date: 2024-05-07 20:00:40
 * @LastEditTime: 2024-05-13 10:39:56
 * @LastEditors: wenshuang
 * @Description: mock 数据
 * @FilePath: /mobile-server/src/mock/ai_consult.ts
 */
import Mock from 'mockjs'

// 售前咨询列表
export function getPreSalesTaskList() {
  return Mock.mock({
    data: {
      'total|1-100': 100,
      'list|1-10': [{
        id: '@guid',
        company_name: '@cword(2, 50)', // 企业名称
        type: '@pick([1,2,3])', // 任务类型 1.售前报告 2.诊断报告 3.交付报告',
        status: '@pick([1,2,3,4,5])', // '状态 1. 待开始 2.进行中 3.处理完成 4.处理失败 5.已取消
        status_tip: '@pick([存放失败原因、进行中的过程值])', // 状态提示 存放失败原因、进行中的过程值
        creator_id: '@guid', // 创建人id
        creator_name: '@cword(2, 50)', // 创建人名称
        create_time: '@integer(10000)', // 创建时间 单位秒
        start_time: '@integer(10000)', // 开始时间 单位秒
        finish_time: '@integer(10000)', // 完成时间 单位秒
        cost_time: '@integer(10000)', // 执行消耗时间 单位ms
        result_file_name: '@url()', // 结果文件路径
        download_file_name: '@cword(2, 50)', // 下载文件名称
        update_time: '@datetime()', // 更新时间 单位秒
        // name: '@cword(2, 50)',
        // category: '@cword(3, 5)',
        // experts: '@shuffle(["张丽俊", "孟长安", "朱宝珠", "俞朝翎", "王培山", "王培山2", "王培山3", "王培山4", "王培山5", "王培山6", "王培山7", "王培山8", "王培山9", "王培山10"], 2, 10)',
      }],
    },
  })
}

// 咨询老师
export function getPreSalesTeachers() {
  return Mock.mock({
    data: {
      'list|1-10': [{
        id: '@guid',
        name: '@cword(2, 50)',
      }],
    },
  })
}

// 咨询分类
export function getPreSalesCategories() {
  return Mock.mock({
    data: {
      'list|1-10': [{
        'id': '@guid',
        'label': '@cword(2, 10)',
        'children|1-10': [{
          id: '@guid',
          label: '@cword(2, 10)',
        }],
      }],
    },
  })
}

// 咨询分类
export function createPreSalesTask() {
  return Mock.mock({
    data: {
      result: '@boolean',
    },
  })
}
