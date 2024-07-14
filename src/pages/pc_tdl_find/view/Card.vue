<template>
  <div ref="card" class="card" :style="{ height: `${cardHeight + 20}px`, gridRowEnd: `span ${cardHeight + 32}` }">
    <div class="card_content_box">
      <div ref="card_content">
        <div v-if="plan.type === 1" class="day card_content" @click="toDetail()">
          <div v-for="(item, index) in detail.target_list" :key="index" style="margin-bottom: 20px;">
            <!-- 头部 -->
            <div class="top">
              <div class="time_box">
                <span>时间</span>
                <span class="text">{{ formateTime(item) }}</span>
              </div>
              <div class="select1">
                <span>分类</span>
                <span class="text">
                  {{ formateType(item) }}
                </span>
              </div>
              <div class="select2">
                <span>优先级</span>
                <i class="block" :style="{ background: options.opt2[item?.level - 1].color }" />
                <span class="text" :style="{ color: options.opt2[item?.level - 1].color }">
                  {{ formateLevel(item) }}
                </span>
              </div>
            </div>
            <!-- 列表详情 -->
            <div>
              <div class="floor1">
                <div class="floor1_l">
                  <div class="p_title">
                    工作计划{{ index + 1 || '' }}
                  </div>
                  <div v-if="item.week_target_name" class="sync_line">
                    <div class="line" />
                    <div class="dot" />
                  </div>
                  <div v-if="item.week_target_name" class="addWeekTarget" style="cursor: auto;">
                    {{ item.week_target_name }}
                  </div>
                </div>
              </div>
              <div class="plan_input">
                <!-- <div class="isDone" :class="{ done: item.status == 3 }" /> -->
                <div class="text" :class="{ text_done: item.status == 3 }">
                  {{ item.content }}
                </div>
              </div>
              <div class="active_list">
                <div
                  v-for="(active, active_index) in item.action_list" v-show="active.content !== ''"
                  :key="active_index" class="active_list_item"
                >
                  <div class="active_title">
                    实施行动{{ active_index + 1 || '' }}
                  </div>
                  <div class="text2" :class="{ text_done: item.status == 3 }">
                    {{ active.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 毛玻璃 -->
          <div class="glass" />
        </div>
        <div v-else class="week card_content" @click="toDetail()">
          <div v-for="(item, index) in detail.target_list" :key="index" style="margin-bottom: 20px;">
            <!-- 头部 -->
            <div class="top">
              <div class="percent_box">
                <span>进度</span>
                <div class="percent">
                  <span class="num">{{ item.percent / 100 }}%</span>
                  <div class="line">
                    <div class="line_" :style="{ width: `${item.percent / 100}%` }" />
                  </div>
                </div>
              </div>
              <div class="select1">
                <span>分类</span>
                <span class="text">
                  {{ formateType(item) }}
                </span>
              </div>
              <div class="select2">
                <span>优先级</span>
                <i class="block" :style="{ background: options.opt2[item?.level - 1].color }" />
                <span class="text" :style="{ color: options.opt2[item?.level - 1].color }">
                  {{ formateLevel(item) }}
                </span>
              </div>
            </div>
            <!-- 列表详情 -->
            <div>
              <div class="floor1">
                <div class="floor1_l">
                  <div class="p_title">
                    周目标{{ index + 1 || '' }}
                  </div>
                  <div v-if="item.week_target_name" class="sync_line">
                    <div class="line" />
                    <div class="dot" />
                  </div>
                  <div v-if="item.week_target_name" class="addWeekTarget" style="cursor: auto;">
                    {{ item.week_target_name }}
                  </div>
                </div>
              </div>
              <div class="plan_input">
                <!-- <div class="isDone" :class="{ done: item.status == 3 }" /> -->
                <div class="text" :class="{ text_done: item.status == 3 }">
                  {{ item.content }}
                </div>
              </div>
              <div class="active_list">
                <div
                  v-for="(active, active_index) in item.assoc_day_target_list" v-show="active.content !== ''"
                  :key="active_index" class="active_list_item"
                >
                  <div class="active_title">
                    工作计划{{ active_index + 1 || '' }}
                  </div>
                  <div class="text2" :class="{ text_done: item.status == 3 }">
                    {{ active.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 毛玻璃 -->
          <div class="glass" />
        </div>
        <div class="authorInfo">
          <div style="cursor: pointer;" @click="toDetail()">
            <div class="f1">
              <div class="tag" :class="{ week: plan.type === 2 }">
                {{ plan.type === 1 ? "日计划" : "周目标" }}
              </div>
              <div class="time">
                {{ plan.type === 1 ? formateTime2(detail.day) : `${formateTime2(detail.start_day)}-${formateTime2(detail.end_day)}` }}
              </div>
            </div>
            <div v-if="detail.subject" class="subject">
              {{ detail.subject }}
            </div>
          </div>

          <div class="f2">
            <img :src="author.avatar || 'https://static.cyjiaomu.com/common/img/default_avatar.png'" alt="" class="avatar">
            <div class="name">
              {{ author.nickname }}
            </div>
            <medal :medal-list="author.medals" :uid="author.user_id" />
            <div class="zan">
              <i class="icon" :class="{ active: detail.has_liked }" @click.stop="handleLike" />
              <span v-show="detail.like_count" class="num" :class="{ active: detail.has_liked }">{{ detail.like_count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import * as api from '@/api/tdl'
import Medal from '@/components/pc/medal.vue'

export default {
  name: 'Card',
  components: {
    Medal,
  },
  props: {
    plan: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {},
    },
  },
  data() {
    return {
      options: {
        opt1: [
          { value: 1, label: '工作项目' },
          { value: 2, label: '个人成长' },
          { value: 3, label: '突发情况' },
        ],
        opt2: [
          { value: 1, label: '优先级高', color: '#F54A46' },
          { value: 2, label: '优先级中', color: '#FF8802' },
          { value: 3, label: '优先级低', color: '#3170FF' },
        ],
      },
      cardHeight: 0,
      like_loading: false,
    }
  },
  computed: {
    detail() {
      if (this.plan.type === 1) {
        return this.plan?.tdl_day?.detail
      } else {
        return this.plan?.tdl_week?.detail
      }
    },
    author() {
      if (this.plan.type === 1) {
        return this.plan?.tdl_day?.author
      } else {
        return this.plan?.tdl_week?.author
      }
    },
  },
  created() {
  },
  mounted() {
    this.updateDynamicGridRow()
  },
  updated() {
    this.updateDynamicGridRow()
  },
  methods: {
    formateTime2(time) {
      return moment(time).format('YYYY年MM月DD日')
    },
    updateDynamicGridRow() {
      const cardElement = this.$refs.card
      const card_content = this.$refs.card_content
      if (cardElement) {
        const cardHeight = card_content.offsetHeight // 获取卡片的实际高度
        this.cardHeight = cardHeight
      }
    },
    toDetail() {
      const openPage = {
        id: this.plan.id,
        type: this.plan.type,
      }
      window.parent.postMessage({
        openPage,
      }, '*')
    },
    async handleLike() {
      let res
      const param = {
        id: this.detail.id,
      }
      if (!this.like_loading) {
        this.like_loading = true
        if (this.plan.type === 1) { // 日计划
          if (this.detail.has_liked) { // 已经点赞
            res = await api.tdlDayCancelLike(param)
          } else { // 未点赞
            res = await api.tdlDayLike(param)
          }
        } else { // 周计划
          if (this.detail.has_liked) { // 已经点赞
            res = await api.tdlWeekCancelLike(param)
          } else { // 未点赞
            res = await api.tdlWeekLike(param)
          }
        }
        this.like_loading = false

        if (res) {
          this.detail.has_liked = !this.detail.has_liked
          this.detail.like_count = res.count
        }
      }
    },
    formateTime(item) {
      return `${item?.from} 至 ${item?.to}`
    },
    formateType(item) {
      return this.options.opt1[item?.type - 1]?.label
    },
    formateLevel(item) {
      return ['高', '中', '低']?.[item?.level - 1] || '低'
    },
  },
}
</script>

<style scope lang="scss">
@import url('../scss/card.scss');
</style>
