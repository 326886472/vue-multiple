<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-04-07 16:56:59
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-15 19:20:36
 * @FilePath: /mobile-server/src/pages/pc_tdl/view/Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div v-loading="loading" style="background: #fff;padding-bottom: 20px;">
    <div class="header">
      <i class="line" />
      <span>发现</span>
    </div>
    <div v-if="!empty">
      <!-- 内容 -->
      <div class="content">
        <div class="header_">
          <img :src="author.avatar || 'https://static.cyjiaomu.com/common/img/default_avatar.png'" alt="" class="avatar">
          <div class="user">
            <div class="f1">
              <div class="name">
                {{ author.nickname }}
              </div>
              <medal :medal-list="author.medals" :uid="author.user_id" />
            </div>
            <div class="f2">
              <div class="tag" :class="{ week: +query.type === 2 }">
                {{ +query.type === 1 ? "日计划" : "周目标" }}
              </div>
              <div class="time">
                {{ formateUpdateTime() }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="+query.type === 1" class="day">
          <div class="p_list">
            <div v-for="(item, index) in planList" :key="index" class="sync_item">
              <div class="item" :class="{ active: item.isCheck }">
                <div
                  v-show="item.content !== ''" class="p_list_item"
                >
                  <div class="floor1">
                    <div class="floor1_l">
                      <div class="p_title">
                        工作计划{{ index + 1 || '' }}
                      </div>
                      <div v-if="item.week_target_name" class="sync_line">
                        <div class="line" />
                        <div class="dot" />
                      </div>
                      <div v-if="item.week_target_name" class="addWeekTarget">
                        {{ item.week_target_name }}
                      </div>
                    </div>
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
                      <i class="block" :style="{ background: options.opt2[item.level - 1].color }" />
                      <span class="text" :style="{ color: options.opt2[item.level - 1].color }">
                        {{ formateLevel(item) }}
                      </span>
                    </div>
                  </div>
                  <div class="plan_input">
                    <pre class="text" :class="{ text_done: item.status == 3 }">{{ item.content }} </pre>
                  </div>
                  <div class="active_list">
                    <div
                      v-for="(active, active_index) in item.action_list" v-show="active.content !== ''"
                      :key="active_index" class="active_list_item"
                    >
                      <div class="active_title">
                        实施行动{{ active_index + 1 || '' }}
                      </div>
                      <pre class="text2" :class="{ text_done: item.status == 3 }">{{ active.content }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="subject">
            {{ detail.subject }}
          </div>
        </div>
        <div v-else class="week">
          <div class="p_list">
            <div v-for="(item, index) in planList" :key="index" class="sync_item">
              <div class="select">
                <div class="check" :class="{ active: item.isCheck }" />
              </div>
              <div class="item" :class="{ active: item.isCheck }">
                <div
                  v-show="item.content !== ''" class="p_list_item"
                >
                  <div class="floor1">
                    <div class="floor1_l">
                      <div class="p_title">
                        周目标{{ index + 1 || '' }}
                      </div>
                    </div>

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
                      <i class="block" :style="{ background: options.opt2[item.level - 1].color }" />
                      <span class="text" :style="{ color: options.opt2[item.level - 1].color }">
                        {{ formateLevel(item) }}
                      </span>
                    </div>
                  </div>
                  <div class="plan_input">
                    <pre class="text" :class="{ text_done: item.status == 3 }">{{ item.content }} </pre>
                  </div>
                  <div class="active_list">
                    <div
                      v-for="(active, active_index) in item.assoc_day_target_list" v-show="active.content !== ''"
                      :key="active_index" class="active_list_item"
                    >
                      <div class="active_title">
                        工作计划{{ active_index + 1 || '' }}
                      </div>
                      <pre class="text2" :class="{ text_done: item.status == 3 }">{{ active.content }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="subject">
            {{ detail.subject }}
          </div>
        </div>
      </div>
      <div class="zan" :class="{ active: detail.has_liked }" @click="handleLike">
        <i class="icon" />
        <span class="zan_t"><span v-show="detail.has_liked">已</span>点赞 <span v-show="detail.like_count">{{ detail.like_count }}</span></span>
      </div>
      <comment
        v-if="query.type === '1'" :id="dataDetail?.id" ref="comment"
        :comment-list-api="api.tdlDayInteractionCommentList"
        :comment-add-api="api.tdlDayInteractionCommentAdd"
        :comment-del-api="api.tdlDayInteractionCommentDel"
        :comment-like-api="api.tdlDayInteractionCommentLike"
        :comment-like-cancel-api="api.tdlDayInteractionCommentCancelLike"
      />
      <comment
        v-if="query.type === '2'" :id="dataDetail?.id" ref="comment_week"
        :comment-list-api="api.tdlWeekInteractionCommentList"
        :comment-add-api="api.tdlWeekInteractionCommentAdd"
        :comment-del-api="api.tdlWeekInteractionCommentDel"
        :comment-like-api="api.tdlWeekInteractionCommentLike"
        :comment-like-cancel-api="api.tdlWeekInteractionCommentCancelLike"
      />
    </div>
    <div v-else class="empty_box">
      <img src="../img/矩形@2x.png" alt="" class="empty">
      <span class="empty_text">未找到该内容</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import * as api from '@/api/tdl'
import Comment from '@/components/pc/comment.vue'
import Medal from '@/components/pc/medal.vue'

export default {
  name: 'Home',
  components: {
    Medal,
    Comment,
  },
  data() {
    return {
      name: 'home',
      moment,
      loading: false,
      like_loading: false,
      dataDetail: {},
      detail: {},
      author: {},
      planList: [],
      parentOffsetTop: 0,
      query: {},
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
      api,
      empty: false,
    }
  },
  watch: {
    query(query) {
      setTimeout(() => {
        if (query.type === '1') {
          this.$refs.comment.changeCommentId(+query.id)
        } else {
          this.$refs.comment_week.changeCommentId(+query.id)
        }
      }, 500)
    },
  },

  async mounted() {
    this.loading = true
    window.addEventListener('message', (event) => {
      const query = event.data.query
      if (query) {
        this.query = query
        this.getDetail(query.id, query.type)
      }
    })
  },

  methods: {
    async getDetail(id, type) {
      let res
      if (+type === 1) {
        res = await api.tdlDayCustomDetail({
          id: +id,
        })
      } else {
        res = await api.tdlWeekCustomDetail({
          id: +id,
        })
      }
      this.loading = false

      if (res && res.detail) {
        this.dataDetail = res.detail
        this.author = res.detail.author
        this.detail = res.detail.detail
        this.planList = res.detail.detail?.target_list
        this.empty = false
      } else {
        // window.parent.postMessage({ toTDL: true }, '*')
        this.empty = true
      }
    },
    formateType(item) {
      return this.options.opt1[item.type - 1].label
    },
    formateLevel(item) {
      return ['高', '中', '低']?.[item.level - 1] || '低'
    },
    formateTime(item) {
      return `${item.from} 至 ${item.to}`
    },
    formateUpdateTime() {
      return `更新于${moment(this.detail.publish_time * 1000).format('YYYY-MM-DD')}`
    },
    async handleLike() {
      let res
      const param = {
        id: +this.query.id,
      }
      if (!this.like_loading) {
        this.like_loading = true
        if (+this.query.type === 1) { // 日计划
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
  },
}
</script>

<style lang="scss" scoped>
@import url('../scss/home.scss');
</style>
