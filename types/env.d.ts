/*
 * @Author: wenshuang
 * @Date: 2023-11-10 14:53:56
 * @LastEditTime: 2024-02-01 15:55:20
 * @LastEditors: wenshuang
 * @Description: 环境配置
 * @FilePath: /mobile-server/types/env.d.ts
 */
interface ImportMetaEnv {
  /** 环境变量 */
  VITE_APP_ENV: 'production' | 'development' | 'test' | 'local' | 'audit'

  /** 开发服务端口号 */
  VITE_DEV_PORT: number

  /** 开发代理路径 */
  VITE_DEV_PROXY_PATH?: string

  /** 开发代理地址 */
  VITE_DEV_PROXY_TARGET?: string

  /** 调试工具 eruda */
  VITE_DEV_TOOLS: 'true' | 'false'

  /** 打包生成的文件目录 */
  VITE_BUILD_OUTPUT_DIR: string

  /** 接口地址 */
  VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
