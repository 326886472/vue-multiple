<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-04-07 16:56:59
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-15 19:20:36
 * @FilePath: /mobile-server/src/pages/pc_tdl/view/Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="header">
    <span :class="{ active: type === 'day' }" @click="handleType('day')">日计划</span>
    <span :class="{ active: type === 'week' }" @click="handleType('week')">周目标</span>
  </div>
  <time-line ref="time" :type="type" :s-date="selectedDate" :c-date="currentDate" @updateC="(d) => updateDate(d, 'current')" @updateS="(d) => updateDate(d, 'select')" @changeWeek="changeWeek" />
  <t-d-l-content v-if="type === 'day'" ref="tdlContent" :s-date="selectedDate" @goToWeek="goToWeek" />
  <week-t-d-l-content v-if="type === 'week'" ref="weekTdlContent" :s-date="selectedDate" :week="week" />
</template>

<script>
import Cookies from 'js-cookie'
import moment from 'moment'
import TDLContent from './TDLContent.vue'
import TimeLine from './Time.vue'
import WeekTDLContent from './WeekTDLContent.vue'

export default {
  name: 'Home',
  components: {
    TimeLine,
    TDLContent,
    WeekTDLContent,
  },
  data() {
    return {
      name: 'home',
      type: 'day',
      currentDate: moment().format('YYYY-MM-DD'),
      selectedDate: moment().format('YYYY-MM-DD'),
      // parentOffsetTop: 0,
      week: {
        from: moment().startOf('week').format('YYYY-MM-DD'),
        to: moment().startOf('week').add(6, 'days').format('YYYY-MM-DD'),
      },
    }
  },
  created() {
    const tdl_type = Cookies.get('tdl_type')
    if (tdl_type) {
      this.type = tdl_type
    }
  },
  methods: {
    handleType(type) {
      this.type = type
      Cookies.set('tdl_type', type)
      this.$emit('changeType', type)
    },
    goToWeek(sDate) {
      this.type = 'week'
      if (sDate) {
        this.$refs.time.toSomeDay(sDate)
      }
    },
    updateDate(date, type) {
      if (type === 'select') {
        this.selectedDate = date
      } else {
        this.currentDate = date
      }
    },
    changeWeek(week) {
      if (week.length) {
        this.week = {
          from: week[0]?.date,
          to: week[week.length - 1]?.date,
        }
      }
    },
    importData() {
      if (this.type === 'week') {
        this.$refs.weekTdlContent.importData()
      } else {
        this.$refs.tdlContent.importData()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
* {
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

#tdl {

    .header {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-weight: 600;
        border-bottom: 1px solid #EBEBEB;

        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 20px;
        color: #333333;
        background: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;

        .line {
            display: inline-block;
            width: 4px;
            height: 18px;
            background-image: url(../img/矩形备份.png);
            margin-left: 20px;
            vertical-align: -1.5px;
        }
        span {
            margin-left: 6px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: #333333;
            line-height: 28px;
            text-align: left;
            font-style: normal;
            cursor: pointer;
        }
        span.active {
          color: #FF4F00;
          display: inline-block;
          position: relative;
        }

        span.active::before {
            content: '';
            position: absolute;
            width: 40px;
            height: 3px;
            background: #F25A00;
            border-radius: 2px;
            left: 0;
            right: 0;
            margin: 0 auto;
            bottom: -6px;
          }
    }
}
</style>
