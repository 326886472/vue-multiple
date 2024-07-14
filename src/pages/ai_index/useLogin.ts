/*
 * @Author: wenshuang
 * @Date: 2024-05-13 14:55:05
 * @LastEditTime: 2024-05-16 15:38:35
 * @LastEditors: wenshuang
 * @Description: 登录
 * @FilePath: /mobile-server/src/pages/ai_index/useLogin.ts
 */
// 导入类型定义（如果有的话）
import { ElLoading } from 'element-plus'
import qs from 'qs'
import { ref } from 'vue'
import { getAuth, loginStaff } from '@/api/ai_consult'
import { sleep } from '@/utils'
import { getToken, setToken } from '@/utils/auth'

// 假设loginStaff已正确导出

interface QueryParams {
  dd_userid?: string // 根据实际情况定义查询参数类型
}

const query = qs.parse(location.search.slice(1)) as QueryParams

const navList = [{
  key: 'CherryGPT',
  title: 'cherry 数字分身',
  img: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/ai/%E6%95%B0%E5%AD%97%E4%BA%BA.png',
  link: `https://chat.cyjiaomu.com?${location.search.slice(1)}`,
}, {
  key: 'ConsultGPT',
  title: '咨询百宝箱',
  img: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/ai/%E5%92%A8%E8%AF%A2gpt.png',
  link: `/ai_consult.html?${location.search.slice(1)}`,
}, {
  key: 'TextOptimization',
  title: '文本优化',
  img: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/ai/%E6%96%87%E6%9C%AC%E4%BC%98%E5%8C%96.png',
  link: '',
}]

export function useLogin() {
  const loading = ref(true)
  const authList = ref([] as any)
  let loadingInstance: any // 具体类型取决于ElLoading.service返回类型

  async function init() {
    try {
      localStorage.removeItem('c_token')
      const { data: { token } = {} as any } = await loginStaff({ staff_id: query.dd_userid }) // 登录
      console.log('🚀 ~ token:', token)
      localStorage.setItem('c_token', token)
      const { data: { auth_list = [] } = {} as any } = await getAuth() // 获取授权
      console.log('🚀 ~ init ~ auth:', auth_list)
      for (let index = 0; index < navList.length; index++) {
        const element = navList[index]
        if (auth_list.includes(element.key)) {
          authList.value.push(element)
        }
      }
      loading.value = false
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      if (loadingInstance) {
        loadingInstance.close()
      }
    }
  }

  // 使用onMounted确保DOM已挂载再执行初始化
  onMounted(() => {
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    init()
  })

  return { loading, navList: authList, homeUrl: `/ai_index.html?${location.search.slice(1)}` }
}
