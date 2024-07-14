<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-27 10:00:31
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-15 10:39:46
 * @FilePath: /mobile-server/src/pages/signIn/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-14 18:37:46
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-14 16:25:50
 * @FilePath: /mobile-server/src/pages/signIn/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 签到首页 -->
  <div id="content" v-loading="loading">
    <div class="top">
      签到
    </div>
    <div class="logo" />
    <div class="content">
      <div class="phone">
        <div class="area_code" @click="chargeAreaCode">
          +{{ areaCode }}
        </div>
        <el-input v-model="mobile" maxlength="11" style="width: 227px" placeholder="输入手机号" @input="onInputChange" />
      </div>
      <div :disabled="!enableSign" :class="enableSign ? 'active signBtn' : 'signBtn'" @click="sign">
        签到
      </div>
    </div>
  </div>
  <!-- 选择区号 -->
  <div class="selectAreaCode">
    <el-drawer
      v-model="areaCodeVisible"
      class="selectAreaCode"
      size="100%"
      title="选择国家和地区"
      :direction="rtl"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="close" @click="closeAreaCode">
        <el-icon :size="20">
          <arrow-left-bold />
        </el-icon>
      </div>

      <div class="select">
        <div v-for="(group, index) in state_code_list" :key="index" class="group">
          <div class="label">
            {{ group.label }}
          </div>
          <div v-for="(item, index2) in group.options" :key="index2" class="items-base" @click="handleClickAreaCode(item)">
            <span class="name">{{ item.country_name_zh }}</span>
            <span class="code">+{{ item.code }}</span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
  <!-- 签到完成页 -->
  <div v-if="signSuccess" class="signSuccess">
    <div class="top">
      提交成功
    </div>
    <div class="success">
      <div class="successLogo" />
      <span class="successText">签到成功</span>
      <div class="time">
        {{ currentTime }}
      </div>
      <div class="line" />
      <div class="myMobile">
        手机号 + {{ areaCode }} {{ mobile }}
      </div>
    </div>
  </div>
</template>

<script>
import Fingerprint2 from 'fingerprintjs2'
import { SingIn, getCountryCodeList, getNormalCountryCodeList } from '@/api/studentEntry'
import { getCurrentURLParams } from '@/utils/index'

export default {
  name: 'App',
  components: {},
  data() {
    return {
      areaCode: '86',
      mobile: '',
      enableSign: false,
      areaCodeVisible: false,
      state_code_list: [],
      normalCode: ['86', '852', '853', '886'],
      loading: false,
      signSuccess: false,
      currentTime: '',
      interval: null,
      fingerprint: '',
      secId: '',
    }
  },
  watch: {
    // 监听手机号变化
    signSuccess: {
      handler(newVal) {
        if (newVal) {
          this.interval = setInterval(this.updateTime, 1000) // 每秒更新一次时间
        } else {
          clearInterval(this.interval)
        }
      },
    },
  },
  created() {
    this.secId = getCurrentURLParams()?.get('sec_id')
    const finger = localStorage.getItem(`fingerprint:${this.secId}`)
    if (finger) {
      this.signSuccess = true
    }

    const phone = localStorage.getItem(`mobile:${this.secId}`)
    const areaCode = localStorage.getItem(`area_code:${this.secId}`)
    this.mobile = phone
    if (areaCode) {
      this.areaCode = areaCode
    }

    this.GetStateCodeList()
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
  methods: {
    async sign() {
      if (!this.mobile) {
        return
      }
      const res = await SingIn({
        sec_id: +this.secId,
        sign: this.fingerprint,
        state_code: this.areaCode,
        phone: this.mobile,
      })

      if (res && !res.result) {
        this.$message.error(res.msg)
      }

      if (res && res.result) {
        localStorage.setItem(`fingerprint:${this.secId}`, this.fingerprint) // 设置本地指纹存储 再次进入跳过签到
        localStorage.setItem(`mobile:${this.secId}`, this.mobile) // 存签到手机号
        localStorage.setItem(`area_code:${this.secId}`, this.areaCode) // 存签到手机区号
        this.signSuccess = true
      }
    },
    updateTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = (`0${now.getMonth() + 1}`).slice(-2)
      const date = (`0${now.getDate()}`).slice(-2)
      const hours = (`0${now.getHours()}`).slice(-2)
      const minutes = (`0${now.getMinutes()}`).slice(-2)
      const seconds = (`0${now.getSeconds()}`).slice(-2)
      this.currentTime = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`
    },
    onInputChange(value) {
      // 使用正则表达式过滤非数字字符
      const numericValue = value.replace(/\D/g, '')
      // 检查并设置模型值
      this.enableSign = numericValue.length > 5

      this.mobile = numericValue
    },
    closeAreaCode() {
      this.areaCodeVisible = false
    },
    handleClickAreaCode(row) {
      this.areaCodeVisible = false
      this.areaCode = row.code
    },
    chargeAreaCode() {
      this.areaCodeVisible = true
    },
    async GetStateCodeList() {
      const res = await getNormalCountryCodeList()
      this.state_code_list.push({
        label: '常用区号',
        options: [...res.list],
      })
      const res1 = await getCountryCodeList()
      if (res1 && res1.list) {
        res1.list = res1.list.filter(v => !this.normalCode.includes(v.code))
        this.state_code_list.push({
          label: '区号',
          options: [...res1.list],
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#content {
  font-family: PingFangSC, PingFang SC;
}
.top {
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: #333333;
  height: 44px;
  line-height: 44px;
  font-style: normal;
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.06);
  background-color: rgba(255, 255, 255, 1);
}

.logo {
  width: 218px;
  height: 60px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background: url('./img/LOGO@2x.png');
  background-size: 100% 100%;
  margin-top: 71px;
}

.content {
  margin-top: 75px;
  .phone {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 29px;

    .area_code {
      width: 80px;
      height: 51px;
      background: #F7F8FA;
      border-radius: 4px;
      font-weight: 600;
      font-size: 17px;
      color: #FF4F00;
      line-height: 24px;
      font-style: normal;
      text-align: center;
      line-height: 51px;
    }

    :deep(.el-input) {
      height: 51px;
      border-radius: 4px;
      border: none;

      .el-input__wrapper {
        background: #F7F8FA;
        border-radius: 4px;
        box-shadow: none;
      }
      .el-input__inner::placeholder {
        font-size: 13px;
        font-weight: 400;
        color: #A3A3A3;
      }
      .el-input__inner {

        font-weight: 600;
        font-size: 17px;
        color: #333333;
      }
      .if-focus {
        border: none
      }
    }
  }

  .signBtn {
    width: 335px;
    height: 35px;
    background: #FF4F00;
    border-radius: 19px;
    opacity: 0.4;
    font-weight: 600;
    font-size: 15px;
    color: #FFFFFF;
    line-height: 35px;
    text-align: center;
    font-style: normal;
    margin: 0 auto;
    margin-top: 28px;
  }

  .active {
    opacity: 1;
  }

}

.selectAreaCode {
  position: relative;
  :deep(.el-drawer__header) {
    text-align: center;
    height: 44px;
    background: #FFFFFF;
    box-shadow: 0px 1 4px 0px rgba(0,0,0,0.06);
    font-weight: 600;
    font-size: 17px;
    color: #333333;
    line-height: 24px;
    font-style: normal;
  }
  :deep(.el-drawer__body) {
    padding: 0;
  }
  .close {
    position: absolute;
    left: 17px;
    top: 24px;
  }

  .select {
        .group {
          font-weight: 500;
          font-size: 11px;
          color: #AAAAAA;
          text-align: left;
          font-style: normal;

          .label {
            height: 21px;
            background: #F7F8FA;
            line-height: 21px;
            padding-left: 15px;
          }
          .items-base {
            padding: 0 15px;
            height: 40px;
            align-items: center;
            box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.06);
            background-color: rgba(255, 255, 255, 1);
            font-weight: 500;
            font-size: 14px;
            color: #333333;
            line-height: 24px;
            text-align: left;
            font-style: normal;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .code {
              font-weight: 500;
              font-size: 14px;
              color: #666666;
            }
          }
    }
  }
  }

  .signSuccess {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    .top {
      position: relative;
      z-index: 1000;
    }
    .success {
      display: flex;
      width: 100%;
      height: 100%;
      background: #fff;
      flex-direction: column;
      align-items: center;
      .successLogo {
        width: 90px;
        height: 90px;
        margin: 50px auto 0;
        background: url('./img/success.png');
        background-size: 100% 100%;
      }
      .successText {
        font-weight: 600;
        font-size: 17px;
        color: #333333;
        line-height: 28px;
        letter-spacing: 1px;
        font-style: normal;
        margin-top: 8px;
      }
      .time {
        font-weight: 600;
        font-size: 24px;
        color: #FF4F00;
        line-height: 60px;
        text-align: center;
        font-style: normal;
        width: 268px;
        height: 60px;
        background: #F7F7F7;
        border-radius: 12px;
        margin-top: 21px;
      }
      .line {
        width: 315px;
        height: 1px;
        background: #D2D2D2;
        border-radius: 4px;
        margin-top: 36px;
      }
      .myMobile {
        font-weight: 400;
        font-size: 17px;
        color: #606060;
        line-height: 24px;
        text-align: center;
        font-style: normal;
        margin-top: 37px;
      }
    }
  }
</style>
