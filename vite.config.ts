/*
 * @Author: wenshuang
 * @Date: 2023-11-10 14:53:56
 * @LastEditTime: 2024-02-01 16:20:52
 * @LastEditors: wenshuang
 * @Description: vite 配置
 * @FilePath: /mobile-server/vite.config.ts
 */
import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import { createProxy, createVitePlugins, entryPoints } from './build/vite'
import type { ConfigEnv, UserConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const isBuild = command === 'build'
  const isProd = mode === 'production'
  const env = loadEnv(mode, root) as ImportMetaEnv

  return {
    base: './',
    root: path.resolve(root, 'src/pages'),
    publicDir: path.resolve(root, 'public'),
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: `${path.resolve(__dirname, './src')}/`,
        },
      ],
    },
    server: {
      host: '0.0.0.0',
      port: env.VITE_DEV_PORT,
      https: false,
      proxy: createProxy(env),
      // {
      //   '/api': {
      //     target: 'https://dev-user-api.foundingaz.com/api/v3',
      //     changeOrigin: true,
      //     rewrite: path => path.replace(/\/api/, ''),
      //   },
      // },
      open: '/__toc__.html',
    },
    plugins: createVitePlugins(env, isBuild),
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
    },
    build: {
      emptyOutDir: true,
      outDir: path.resolve(root, env.VITE_BUILD_OUTPUT_DIR),
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        input: entryPoints(),
        output: {
          manualChunks: {
            vue: ['vue', '@vueuse/core'],
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import './src/assets/scss/main.scss';`,
        },
      },
    },
  }
})
