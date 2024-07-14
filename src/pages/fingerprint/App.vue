<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-14 18:37:46
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-03-20 11:39:30
 * @FilePath: /mobile-server/src/pages/fingerprint/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <p>设备指纹: {{ fingerprint }}</p>
  </div>
</template>

<script>
import Fingerprint2 from 'fingerprintjs2'

export default {
  data() {
    return {
      fingerprint: '',
    }
  },
  mounted() {
    const options = {
      excludes: {
        plugins: true,
        localStorage: true,
        adBlock: true,
        screenResolution: true,
        availableScreenResolution: true,
        enumerateDevices: true,
      },
    }

    Fingerprint2.get(options, (components) => {
      const values = components.map(component => component.value)
      const fingerprint = Fingerprint2.x64hash128(values.join(''), 31)
      this.fingerprint = fingerprint
    })
  },
}
</script>
