<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-04-08 13:45:05
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-16 10:44:56
 * @FilePath: /mobile-server/src/pages/pc_tdl/view/TimeLine.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="time-line">
    <div class="content">
      <span class="month">
        {{ moment(currentDate).format('YYYY年') }}
        <span class="emonth">
          {{ moment(currentDate).format('MM月') }}
        </span>
      </span>
      <div class="selectTime">
        <div class="left-btn" @click="previousWeek" />
        <div class="time">
          {{ week[0] ? moment(week?.[0]?.date).format('YYYY年MM月DD日') : '' }} - {{
            week?.[6] ? moment(week[6].date).format('YYYY年MM月DD日') : '' }}
        </div>
        <div class="right-btn" @click="nextWeek" />
      </div>
      <div class="today" @click="toToday">
        今天
      </div>
    </div>
    <div class="weekLine">
      <div
        v-for="(item, index) in week" :key="index" class="weekDay" :class="{ active: item.date === selectDate.format('YYYY-MM-DD') && type === 'day' }"
        :style="{ cursor: type === 'day' ? 'pointer' : 'default' }" @click="selectDay(item)"
      >
        <span class="day" :class="{ active: item.date === moment().format('YYYY-MM-DD') }">{{ item.day }}</span>
        <span class="mday">日</span>
        <span class="enDay">
          {{ item.enName }}
        </span>
        <span v-show="showTag(item.date)" class="tag">
          {{ item.tagText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import * as api from '@/api/tdl'

export default {
  props: {
    sDate: { // 选中的日期
      type: String,
      required: true,
    },
    cDate: { // 当前周所在日期
      type: String,
      required: true,
    },
    type: { // 类型
      type: String,
      required: true,
    },
  },
  data() {
    return {
      moment,
      currentDate: moment(this.cDate, 'YYYY-MM-DD'),
      selectDate: moment(this.sDate, 'YYYY-MM-DD'),
      week: [],
      todayHasPlan: false,
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const res = await api.tdlDayDetail({
        day: moment().format('YYYY-MM-DD'),
      })

      if (res && res?.detail) {
        if (res.detail?.id) {
          this.todayHasPlan = true
        }
      }
      this.formattedWeekDays()
    },
    previousWeek() {
      this.currentDate.subtract(7, 'days')
      this.$emit('updateC', moment(this.currentDate).format('YYYY-MM-DD'))
      this.formattedWeekDays()
      this.$nextTick(() => {
        this.$emit('changeWeek', this.week)
      })
    },
    nextWeek() {
      this.currentDate.add(7, 'days')
      this.$emit('updateC', moment(this.currentDate).format('YYYY-MM-DD'))
      this.formattedWeekDays()
      this.$nextTick(() => {
        this.$emit('changeWeek', this.week)
      })
    },
    selectDay(day) {
      if (this.type === 'week') {
        return
      }
      this.selectDate = moment(day?.date)
      this.$emit('updateS', moment(this.selectDate).format('YYYY-MM-DD'))
    },
    toToday() {
      const today = moment().format('YYYY-MM-DD')
      this.currentDate = moment(today, 'YYYY-MM-DD')
      this.selectDate = moment(today, 'YYYY-MM-DD')

      this.formattedWeekDays()
      this.$emit('updateC', today)
      this.$emit('updateS', today)
      this.$emit('changeWeek', this.week)
    },
    toSomeDay(date) {
      const today = date
      this.currentDate = moment(today, 'YYYY-MM-DD')
      this.selectDate = moment(today, 'YYYY-MM-DD')

      this.formattedWeekDays()
      this.$emit('updateC', today)
      this.$emit('updateS', today)
      this.$emit('changeWeek', this.week)
    },
    showTag(date) {
      if (this.type === 'week') return
      return moment().format('YYYY-MM-DD') === date || moment().add(1, 'days').format('YYYY-MM-DD') === date
    },
    formattedWeekDays() {
      const days = []
      const weekEnName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      for (let i = 0; i < 7; i++) {
        const day = this.currentDate.clone().startOf('week').add(i, 'days')
        let tagText = ''
        if (day.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') || day.format('YYYY-MM-DD') === moment().add(1, 'days').format('YYYY-MM-DD')) {
          tagText = '去规划 >'
          if (day.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') && moment().valueOf() > moment(day.format('YYYY-MM-DD')).valueOf() + 18 * 3600 * 1000) {
            tagText = '去规划 >'
            if (this.todayHasPlan) {
              tagText = '去复盘 >'
            }
          }
        }
        days.push({
          day: day.date(),
          date: day.format('YYYY-MM-DD'),
          enName: weekEnName[i],
          tagText,
        })
      }
      this.week = days
    },
  },
}
</script>

<style lang="scss" scoped>
* {
    background-size: 100% 100%;
    background-repeat: no-repeat;

}

.time-line {
    height: 85px;
    width: 100%;

    .content {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 58px;
        padding: 0 20px;
        background: #fff;

        .month {
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 20px;
            color: #333333;
            line-height: 28px;
            font-style: normal;
            flex: 1;

            .emonth {
                font-weight: 600;
            }
        }

        .selectTime {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 280px;

            .left-btn,
            .right-btn {
                width: 27px;
                height: 27px;
                cursor: pointer;
            }

            .left-btn:hover {
                background-image: url(../img/left.png);
            }

            .right-btn:hover {
                background-image: url(../img/right.png);
            }

            .left-btn {
                background-image: url(../img/arrow-l.png);
            }

            .right-btn {
                background-image: url(../img/arrow-r.png);
            }

            .time {
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 12px;
                color: #333333;
                line-height: 17px;
                text-align: left;
                font-style: normal;

            }

        }

        .today {
            width: 51px;
            height: 22px;
            background: #FBFBFB;
            border-radius: 4px;
            border: 1px solid #E4E4E4;

            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 12px;
            color: #333333;
            line-height: 22px;
            text-align: center;
            font-style: normal;
            margin-left: 16px;
            cursor: pointer;

        }

        .today:hover {
            color: #F4572A;
        }
    }

    .weekLine {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1px;
        height: 25px;
        background: #fff;
        border-bottom: 2px solid #fff;

        .weekDay {
            background: #FAFAFA;
            width: 100%;
            height: 100%;
            position: relative;
            cursor: pointer;

            .day,
            .mday {
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #6D6D6D;
                line-height: 25px;
                text-align: left;
                font-style: normal;
            }

            .day {
                margin-left: 21px;
            }

            .day.active {
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #6D6D6D;
                line-height: 21px;
                text-align: left;
                font-style: normal;
                width: 21px;
                height: 21px;
                display: inline-block;
                border-radius: 50%;
                background: #F7B500;
                color: #FFFFFF;
                text-align: center;
            }

            .enDay {
                margin-left: 3px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 12px;
                color: #AEAEAE;
                line-height: 15px;
                text-align: left;
                font-style: normal;
            }

            .tag {
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                font-size: 12px;
                color: #FF4F00;
                line-height: 21px;
                font-style: normal;
                margin-left: 10px;
            }
        }

        .weekDay.active {
            background: #FFF1EB;

            ::before {
                content: '';
                position: absolute;
                width: 4px;
                height: 25px;
                background-image: url(../img/tag.png);
                left: -4px;
                z-index: 1;
            }

            .mday,
            .day,
            .enDay {
                color: #333333;
            }

            .day.active {
                color: #FFFFFF;
            }

        }
    }
}
</style>
