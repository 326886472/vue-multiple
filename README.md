<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-08 09:21:51
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-03-20 15:10:59
 * @FilePath: /mobile-server/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
## 🌈 安装和使用

- 安装依赖

```bash
# npm i pnpm -g

pnpm i
```

- 开发运行

```bash
pnpm run dev
```

- 访问地址

# 测试环境
 https://dev-mobile.foundingaz.com/
# 生产环境
 https://mobile.cyjiaomu.com/
# 预发布环境
 https://audit-mobile.foundingaz.com/
 

- 编译构建

```bash
# 测试环境
npm run build:test

# 生产环境
npm run build
```

- 新建页面

```sh
# 添加新页面
npm run new

# 输入页面名称(页面名 + 空格 + 中文标题)
# 例如：home 首页
# 或直接在 `src/pages` 或 `public` 目录下新建 html
```

## ✨ 特性

- [x] 移动端组件库：`vant`
- [x] PC端组件库：`element-plus`
- [x] 原子化CSS：`unocss`
- [x] 应用程序级的JS语言：`typeScript`
- [x] 移动端适配：`postcss-px-to-viewport`
- [x] 开发环境区分：`development + test + production`
- [x] 移动端调试工具：`eruda`
- [x] 旧版浏览器兼容：`plugin-legacy`
- [x] 代码格式化：`eslint`
- [x] CSS格式化：`stylelint`
- [x] 文件目录格式化：`ls-lint`
- [x] 代码提交规范：`commitlint`
