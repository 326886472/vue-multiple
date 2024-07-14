import type { ProxyOptions } from 'vite'

type ProxyTargetList = Record<string, ProxyOptions>

export function createProxy(env: ImportMetaEnv) {
  console.log('env-=-=-=', env)
  const { VITE_DEV_PROXY_PATH, VITE_DEV_PROXY_TARGET } = env
  const proxy: ProxyTargetList = {}

  if (VITE_DEV_PROXY_PATH) {
    proxy[VITE_DEV_PROXY_PATH] = {
      target: VITE_DEV_PROXY_TARGET,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${VITE_DEV_PROXY_PATH}`), ''),
    }
  }

  console.log('env-=proxy-=-=', proxy)
  return proxy
}
