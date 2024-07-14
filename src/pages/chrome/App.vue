<!--
 * @Author: wenshuang
 * @Date: 2024-03-19 10:12:44
 * @LastEditTime: 2024-03-19 10:23:44
 * @LastEditors: wenshuang
 * @Description: 描述
 * @FilePath: /mobile-server/src/pages/chrome/App.vue
-->
<template>
  <a class="download_chrome" :href="url" download="chrome浏览器">
    下载 chrome 浏览器
  </a>
</template>

<script setup lang="ts">
const url = ref('')

function getSystemInfo() {
  const userAgent: any = navigator.userAgent
  const systemInfo: any = {
    os: null,
    version: null,
    bits: null,
  }

  if (userAgent.includes('Windows')) {
    systemInfo.os = 'Windows'
    // 解析Windows版本号
    if (userAgent.includes('Windows NT 10.0')) {
      systemInfo.version = 10
    } else if (userAgent.includes('Windows NT 6.3')) {
      systemInfo.version = 8
    } else if (userAgent.includes('Windows NT 6.2')) {
      systemInfo.version = 8
    } else if (userAgent.includes('Windows NT 6.1')) {
      systemInfo.version = 7
    } else if (userAgent.includes('Windows NT 6.0')) {
      systemInfo.version = 6
    } else if (userAgent.includes('Windows NT 5.2')) {
      systemInfo.version = 5
    } else if (userAgent.includes('Windows NT 5.1')) {
      systemInfo.version = 5
    } else if (userAgent.includes('Windows NT 5.0')) {
      systemInfo.version = 5
    }
    // 判断Windows位数
    if (navigator.platform === 'Win64' || userAgent.includes('WOW64')) {
      systemInfo.bits = 64
    } else {
      systemInfo.bits = 32
    }
  } else if (userAgent.includes('Mac')) {
    systemInfo.os = 'Mac'
    // 解析Mac版本号
    const macVersionArr = userAgent.match(/Mac OS X (\d+)_(\d+)_?(\d+)?/)
    if (macVersionArr) {
      const version = macVersionArr.slice(1).map(Number)
      systemInfo.version = `${version[0]}.${version[1]}.${version[2] || 0}`
    }
    // 判断Mac位数
    systemInfo.bits = 64
  }

  return systemInfo
}

const chromeList: any = {
  windows: {
    7: {
      32: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/chrome/Chrome_Windows7_8_32%E4%BD%8D_109.0.5414.120.exe',
      64: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/chrome/Chrome_Windows7_8_64%E4%BD%8D_109.0.5414.120.exe',
    },
    8: {
      32: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/chrome/Chrome_Windows7_8_32%E4%BD%8D_109.0.5414.120.exe',
      64: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/chrome/Chrome_Windows7_8_64%E4%BD%8D_109.0.5414.120.exe',
    },
    10: {
      32: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/chrome/Chrome_Windows11_10_32%E4%BD%8D_122.0.6261.129.exe',
      64: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/chrome/Chrome_Windows11_10_64%E4%BD%8D_122.0.6261.129.exe',
    },
    11: {
      32: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/chrome/Chrome_Windows11_10_32%E4%BD%8D_122.0.6261.129.exe',
      64: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/chrome/Chrome_Windows11_10_64%E4%BD%8D_122.0.6261.129.exe',
    },
  },
  mac: 'https://cyjm-static.oss-cn-zhangjiakou.aliyuncs.com/chrome/Chrome_macOS_ARM64_X64%E9%80%9A%E7%94%A8%E7%89%88_122.0.6261.129.dmg',
}
onMounted(() => {
  const systemInfo = getSystemInfo()
  if (systemInfo.os === 'Mac') {
    url.value = chromeList.mac
  } else if (systemInfo.os === 'Windows') {
    url.value = chromeList.windows[systemInfo.version][systemInfo.bits] || ''
  }

  console.log(`OS: ${systemInfo.os} ${systemInfo.version}`)
  console.log(`Bitness: ${systemInfo.bits}`)
})
</script>

<style scoped>
.download_chrome {
  margin-top: 50px;
  display: block;
}
</style>
