<template>
  <el-drawer
    v-model="visible"
    :with-header="false"
    direction="rtl"
    :append-to-body="true"
    modal-class="custom-drawer-modal"
    class="custom-drawer"
    :lock-scroll="true"
    size="30%"
    :modal="false"
  >
    <div v-loading="loading" class="importBox">
      <!-- 标头 -->
      <div class="title">
        <div class="title-text">
          <span class="title-text-span">导入周目标</span>
        </div>
        <div style="width: 200px;margin-right:50px">
          <el-date-picker
            v-model="time"
            type="daterange"
            style="width: 180px;"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束时间"
            size="small"
            value-format="YYYY-MM-DD"
            @change="selectTime"
          />
        </div>
        <i class="close" @click="visible = false" />
      </div>
      <!-- 列表 -->
      <div v-show="list.length" id="importTargetList" ref="list" v-infinite-scroll="load" class="list" :infinite-scroll-disabled="scroll.disabled" :infinite-scroll-immediate="false">
        <div v-for="(item, index) in list" :key="index" class="item">
          <div class="top">
            <!-- 展开 -->
            <i class="loadAll" :class="{ active: item.loadAll }" @click="item.loadAll = !item.loadAll" />
            <!-- 全选 -->
            <i class="checkAll" :class="{ active: item.checkAll }" @click="checkAll(item, index)" />
            <div class="top_title">
              周目标{{ moment(item.start_day).format('YYYY/MM/DD') }}~{{ moment(item.end_day).format('YYYY/MM/DD') }}
            </div>
            <span class="num">{{ item.target_list.length + item.has_summary }}</span>
          </div>
          <div class="content">
            <!-- 计划概览 -->
            <div v-if="!item.loadAll" class="item_probably">
              目标1: {{ item.target_list[0]?.content }}
            </div>
            <div v-else>
              <!-- 总结 -->
              <div v-if="item.has_summary" class="summary">
                <div class="item_list_top">
                  <i class="is_check" :class="{ active: select_list?.[index]?.summary }" @click="checkSummary(item, index)" />
                  <div class="item_text">
                    总结
                  </div>
                </div>
                <div v-show="item.summary_unfolded" class="content_text">
                  {{ item.summary.slice(0, 188) }}
                  <span v-show="item.summary_has_unfolded">
                    ...
                  </span>
                  <span v-show="item.summary_has_unfolded" class="unfolded" @click="item.summary_unfolded = false">
                    展开
                  </span>
                </div>
                <div v-show="!item.summary_unfolded" class="content_text_unfolded">
                  {{ item.summary }}
                  <span v-show="item.summary_has_unfolded" class="unfolded" @click="item.summary_unfolded = true">
                    收起
                  </span>
                </div>
              </div>
              <!-- 计划列表 -->
              <div class="item_list">
                <div v-for="(target, index2) in item.target_list" :key="index2" class="target_item">
                  <div class="item_list_top">
                    <i class="is_check" :class="{ active: select_list?.[index]?.list?.includes(target.id) }" @click="checkItem(item, index, target)" />
                    <div class="item_text" style="background:#E3F1F9;color:#38647D;">
                      周目标{{ index2 + 1 }}
                    </div>
                    <div class="type">
                      分类
                      <span>{{ options.opt1[target.type - 1]?.label }}</span>
                    </div>
                    <div class="level">
                      优先级
                      <i class="block" :style="{ background: options.opt2[target.level - 1]?.color }" />
                      <span class="text" :style="{ color: options.opt2[target.level - 1]?.color }">
                        {{ options.opt2[target.level - 1]?.label }}
                      </span>
                    </div>
                  </div>
                  <pre class="content_text2">{{ target.content }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-show="scroll.noMore" class="noMore">
          没有更多了
        </p>
      </div>
      <div v-show="!list.length" class="list_empty">
        <div class="empty" />
        <span>暂无内容</span>
      </div>
      <!-- 导入按钮 -->
      <div v-show="list.length" class="bottom">
        <span>已选择{{ count }}条内容</span>
        <el-button type="primary" :disabled="!count" @click="importData">
          导入
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import moment from 'moment'
import * as api from '@/api/tdl'

export default {
  name: 'ImportDayTarget',

  data() {
    return {
      moment,
      options: {
        opt1: [
          { value: 1, label: '工作项目' },
          { value: 2, label: '个人成长' },
          { value: 3, label: '突发情况' },
        ],
        opt2: [
          { value: 1, label: '高', color: '#F54A46' },
          { value: 2, label: '中', color: '#FF8802' },
          { value: 3, label: '低', color: '#3170FF' },
        ],
      },
      visible: false,
      loading: false,
      time: '',
      list: [],
      select_list: [
        // {
        //   summary: false,
        //   list: [1, 2],
        // },
      ],
      count: 0,
      current_date: {},
      page: {
        start_date: '',
        end_date: '',
        page: 1,
        limit: 10,
      },
      scroll: {
        disabled: false,
        scrollDistance: 0,
        noMore: false,
      },
      total: 0,
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            const targetElement = document.querySelector('#importTargetList')
            targetElement.addEventListener('scroll', (event) => {
              const element = event.target
              const scrollTop = element.scrollTop
              this.scroll.scrollDistance = scrollTop
            })
          })
        }
      },
    },
  },
  methods: {
    open(current_date) {
      this.visible = true
      if (this.current_date !== current_date) { // 切换日期
        this.init()
      }
      this.current_date = current_date
      if (!this.scroll.disabled) {
        this.getList()
      }
    },
    closeWithInit() { // 点击发布切换日期时关闭弹窗
      this.init()
      this.visible = false
    },
    selectTime(val) {
      if (val) {
        this.init(true)
        this.page.start_date = val[0]
        this.page.end_date = val[1]
      } else {
        this.init()
        this.page.start_date = ''
        this.page.end_date = ''
      }
      this.getList()
      const targetElement = document.querySelector('#importTargetList')
      targetElement.scrollTop = 0
    },
    init(select_time) {
      if (!select_time) {
        this.time = ''
      }
      this.list = []
      this.select_list = []
      this.count = 0
      this.page = {
        start_date: '',
        end_date: '',
        page: 1,
        limit: 10,
      }
      this.scroll = {
        disabled: false,
        scrollDistance: 0,
        noMore: false,
      }
      this.total = 0
      const targetElement = document.querySelector('#importTargetList')
      if (targetElement) targetElement.scrollTop = 0
    },

    async getList() {
      this.loading = true
      const res = await api.tdlWeekImportList({
        current_week: `${this.current_date?.from}~${this.current_date?.to}`,
        ...this.page,
      })
      this.loading = false
      let list = res.list
      list = list.map((v) => {
        this.select_list.push({
          summary: false,
          list: [],
        })

        const out = {
          ...v,
          loadAll: false,
          checkAll: false,
        }
        if (v.has_summary && v.summary.length > 188) {
          out.summary_unfolded = true
          out.summary_has_unfolded = true
        }
        return out
      })
      this.list.push(...list)
      this.total = res.total
      if (this.total <= this.list.length) {
        this.scroll.disabled = true
        this.scroll.noMore = true
      }
    },
    checkAll(item, index) { // 全选
      const next_state = !item.checkAll
      item.checkAll = next_state
      if (this.list[index].has_summary) {
        this.select_list[index].summary = next_state
      }

      if (next_state) { // 全选
        const ids = item.target_list.map(v => v.id)
        this.select_list[index].list = ids
      } else { // 全取消
        this.select_list[index].list = []
      }
      this.changeCheckNum()
    },
    checkSummary(item, index) { // 复盘总结勾选
      this.select_list[index].summary = !this.select_list?.[index]?.summary

      this.changeCheckNum()
      this.isCheckAll(item, index)
    },
    checkItem(item, index, target) { // 勾选目标
      const id = target.id
      const select_index = this.select_list[index].list.indexOf(id)
      if (select_index === -1) {
        this.select_list[index].list.push(id)
      } else {
        this.select_list[index].list.splice(select_index, 1)
      }
      this.changeCheckNum()
      this.isCheckAll(item, index)
    },
    isCheckAll(item, index) {
      const ids = item.target_list.map(v => v.id)
      const select_list_item = this.select_list[index]

      if (select_list_item.list.length === ids.length && (select_list_item.summary && this.list[index].has_summary || !this.list[index].has_summary && !select_list_item.summary)) {
        item.checkAll = true
      } else {
        item.checkAll = false
      }
    },
    changeCheckNum() {
      let num = 0
      this.select_list.forEach((v) => {
        if (v.summary) {
          num += 1
        }
        if (v.list.length) {
          num += v.list.length
        }
      })
      this.count = num
    },
    async load() {
      this.page.page += 1
      if (!this.scroll.disabled) {
        await this.getList()
      }
    },
    importData() {
      const out = {
        summary: '',
        list: [],
      }

      this.select_list.forEach((v, i) => {
        if (v.summary) {
          out.summary += this.list[i].summary
        }

        for (let index = 0; index < v.list.length; index++) {
          const id = v.list[index]
          const o = this.list[i].target_list.filter(v => v.id === id)[0]
          delete o.id
          out.list.push(o)
        }
      })

      this.$emit('importHistory', out)
      this.init()
      this.visible = false
    },

  },
}
</script>

<style lang="scss" scoped>
@import url('../scss/importTarget.scss');
</style>

<style>
.custom-drawer {
    min-width: 557px;
}
.custom-drawer-modal {
  min-width: 557px;
  width: 30%;
  inset: unset !important;

  right: 0 !important;
  top: 0 !important;
  height: 100%;
}
</style>
