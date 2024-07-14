/*
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-27 10:00:31
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-15 13:54:00
 * @FilePath: /mobile-server/build/vite/plugins.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */
import path from 'node:path'
import process from 'node:process'
import vueLegacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver, VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import eruda from 'vite-plugin-eruda'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import tocHtml from '../vite-plugin-toc-html'
import type { PluginOption } from 'vite'

export function pathResolve(dir: string) {
  return path.resolve(process.cwd(), dir)
}

export function createVitePlugins(viteEnv: ImportMetaEnv, _isBuild: boolean) {
  const isProd = viteEnv.VITE_APP_ENV === 'production'
  const isDev = !isProd

  const vitePlugins: PluginOption[] = [
    vue(),
    vueJsx(),
    UnoCSS(),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue', '@vueuse/core'],
      dts: pathResolve('types/auto-imports.d.ts'),
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dirs: [pathResolve('src/components')],
      resolvers: [
        // 自动导入 vant 组件
        VantResolver({ importStyle: false }),
        // 自动注册图标组件
        IconsResolver({
          customCollections: ['custom'],
        }),
        ElementPlusResolver(),
      ],
      dts: pathResolve('types/components.d.ts'),
    }),
    // https://github.com/unplugin/unplugin-icons
    Icons({
      compiler: 'vue3',
      autoInstall: true,
      defaultStyle: 'vertical-align: -0.15em;fill: currentcolor;',
      customCollections: {
        custom: FileSystemIconLoader('src/icons'),
      },
      iconCustomizer(collection, icon, props) {
        props.width = '1em'
        props.height = '1em'
      },
    }),
    vueSetupExtend(),
    tocHtml({
      enabled: isDev,
    }),
  ]

  if (viteEnv.VITE_DEV_TOOLS === 'true') {
    // 不需要的时候先关了
    // vitePlugins.push(eruda())
  }

  if (isProd) {
    // 旧版浏览器支持
    // vitePlugins.push(vueLegacy())
  }

  return vitePlugins
}
