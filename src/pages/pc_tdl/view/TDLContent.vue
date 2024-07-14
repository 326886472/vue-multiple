<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-04-09 13:35:53
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-16 17:52:32
 * @FilePath: /mobile-server/src/pages/pc_tdl/view/TDLContent.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="content" ref="content" v-loading="loading">
    <div class="title">
      <i class="icon" />
      <span class="myPlan">
        我的日程：
        <span v-show="Overview.delay_count" class="plan_">
          未完成
          <span class="planNub">
            {{ Overview.delay_count }}
          </span>
          条
        </span>
        <span v-show="Overview.done_count" class="plan_">
          已完成
          <span class="planNub">
            {{ Overview.done_count }}
          </span>
          条
        </span>
        <span v-show="Overview.pending_count" class="plan_">
          待开始
          <span class="planNub">
            {{ Overview.pending_count }}
          </span>
          条
        </span>
        <span v-show="Overview.process_count" class="plan_">
          进行中
          <span class="planNub">
            {{ Overview.process_count }}
          </span>
          条
        </span>
        <span class="plan_">
          总结
          <span class="planNub">
            {{ ['待开始', '已完成', '未完成'][Overview.summary_status - 1] }}
          </span>
        </span>

      </span>
    </div>
    <div v-if="dataDetail?.id || planList.length" class="plan_list">
      <div v-if="pageInfo.isEditModel" class="editModel">
        <div class="p_list">
          <div
            v-for="(item, index) in planList" :key="index"
            class="p_list_item" :class="{ p_list_item_active: pageInfo.activeIndex === index }" @click="pageInfo.activeIndex = index"
          >
            <div class="floor1">
              <div class="floor1_l">
                <div class="p_title">
                  计划{{ index + 1 || '' }}
                </div>
                <div class="sync_line">
                  <div class="line" />
                  <div class="dot" />
                </div>
                <div class="addWeekTarget" @click="addWeekTarget(index, item)">
                  {{ item.week_target_name ? item.week_target_name : '+ 添加对齐周目标' }}
                </div>
              </div>

              <div class="time_box">
                <el-time-select
                  v-model="item.from"
                  style="width: 100px;font-size: 12px;"
                  size="small"
                  end-placeholder="开始时间"
                  start="00:00"
                  end="23:45"
                  step="00:15"
                  :clearable="false"
                  @change="selectStartTime(item, index)"
                />
                <span style="margin: 0 5px; font-size: 12px;">至</span>
                <el-time-select
                  v-model="item.to"
                  style="width: 100px"
                  size="small"
                  start="00:00"
                  end="23:45"
                  start-placeholder="结束时间"
                  step="00:15"
                  :clearable="false"
                  @change="selectEndTime(item, index)"
                />
              </div>
              <el-select
                v-model="item.type" popper-class="custom-select-dropdown" size="small" class="select1" placeholder="请选择"
                @blur="update"
              >
                <el-option
                  v-for="itemOpt1 in options.opt1" :key="itemOpt1.value"
                  :label="itemOpt1.label" :value="itemOpt1.value"
                />
              </el-select>

              <el-select
                v-model="item.level" size="small" class="select2"
                :style="{ color: options.opt2?.[item.level - 1]?.color }" placeholder="请选择"
                @blur="update"
              >
                <el-option
                  v-for="itemOpt2 in options.opt2" :key="itemOpt2.value" class="opt"
                  :label="itemOpt2.label" :value="itemOpt2.value"
                >
                  <div class="select_text flex items-center">
                    <div class="dot" style="float: left" :style="{ background: itemOpt2.color }" />
                    <span class="text" style="float: left" :style="{ color: itemOpt2.color }">{{ itemOpt2.label }}</span>
                  </div>
                </el-option>
                <template #prefix>
                  <div class="dot" style="float: left" :style="{ background: formateLevelColor(item.level) }" />
                  <span class="select_text_tag" style="float: left" :style="{ color: formateLevelColor(item.level) }">{{ options?.opt2?.[item.level - 1]?.label }}</span>
                </template>
              </el-select>
              <div class="close" @click="closePlan(index)" />
            </div>
            <div class="plan_input">
              <el-input
                v-model="item.content" class="input_textarea_text input_text" autosize maxlength="200"
                :show-word-limit="item.content !== ''" type="textarea"
                placeholder="好的工作计划应具体明确，避免笼统模糊。例如，不只是“完成报告”，而是“完成市场分析报告初稿，包含数据分析与趋势预测”"
                @mouseleave="inputChangePlan(item, index)" @blur="inputChangePlan(item, index)"
              />
            </div>
            <div class="active_list">
              <div
                v-for="(active, active_index) in item.action_list" :key="active_index"
                class="active_list_item"
              >
                <div class="active_title">
                  实施行动{{ active_index + 1 || '' }}
                </div>
                <el-input
                  v-model="active.content" autosize class="input_textarea_text input_text" type="textarea" maxlength="200"
                  :show-word-limit="active.content !== ''" placeholder="实施行动应清晰可执行，具体描述每一步行动操作，按照完成的优先级排列各项行动。"
                  @blur="inputChangeActive(index, active_index)" @mouseleave="inputChangeActive(index, active_index)"
                />
                <div class="close" @click="closeActive(index, active_index)" />
              </div>
              <div class="add_active">
                <span @click="addActive(item, index)">+ 添加实施行动</span>
              </div>
            </div>
          </div>
        </div>
        <div class="addPlan">
          <span @click="addPlan">+ 添加工作计划</span>
        </div>
        <!-- 复盘 -->
        <div class="summary" :class="{ active: showSaveBtn }" style="padding-bottom: 30px">
          <div class="summary_top">
            <div class="title">
              总结复盘
            </div>

            <el-popover
              ref="popover" placement="right-start" title="复盘总结可从以下三方面展开：" :width="351"
              trigger="click"
            >
              <div>
                <p class="popover_title">
                  1.对比目标与实际成果，分析问题
                </p>
                <p class="popover_text">
                  回顾当日设定的工作目标与实际完成的工作成果，对比二者差距，分析工作过程中遇到的问题和挑战。
                </p>
                <p class="popover_title">
                  2.总结经验与教训，持续精进
                </p>
                <p class="popover_text">
                  做得好的将其沉淀成可复制的经验方法，待改进的尝试找出可优化的路径策略。
                </p>
                <p class="popover_title">
                  3.收获与反思
                </p>
                <p class="popover_text">
                  提炼当日工作有哪些收获，更好地了解自己的表现。发现潜在问题和改进方向。
                </p>
              </div>
              <template #reference>
                <i class="icon" @click="visible = !visible" />
              </template>
            </el-popover>
          </div>
          <div style="position: relative;">
            <el-input
              v-model="dataDetail.summary" autosize type="textarea" class="summary_input" placeholder="复盘总结可从以下三方面展开：

1.对比目标与实际成果，分析问题
回顾当日设定的工作目标与实际完成的工作成果，对比二者差距，分析工作过程中遇到的问题和挑战。
2.总结经验与教训，持续精进
做得好的将其沉淀成可复制的经验方法，待改进的尝试找出可优化的路径策略。
3.收获与反思
提炼当日工作有哪些收获，更好地了解自己的表现。发现潜在问题和改进方向。"
              @click="pageInfo.activeIndex = -1"
              @input="summaryHandleInputChange" @focusout="showSaveBtn = false" @focus="showSaveBtn = true"
            />
            <span v-show="dataDetail.summary" class="word-count" :class="{ 'word-count-warning': pageInfo.summary_word_count > 1000 || dataDetail?.summary?.length > 1000 }">{{ dataDetail?.summary?.length }} / 1000</span>
          </div>
        </div>
        <div class="footer">
          <div class="public">
            <span>公开发布</span>
            <el-switch
              v-model="pageInfo.is_public"
              style="margin-left: 8px; --el-switch-on-color: #f1500b"
              @change="changePublic"
            />
          </div>
          <el-input
            v-show="pageInfo.is_public" v-model="dataDetail.subject" class="input_subject" autosize
            maxlength="200" :show-word-limit="dataDetail.subject !== ''" type="textarea"
            placeholder="填写公开此计划的简介内容" @blur="publish_content_blur"
          />

          <div class="btns">
            <div class="sub_btn" :style="planList.length > 0 ? '' : 'opacity:0.4'" @click="submit">
              发布
            </div>
            <div class="sub_cancel" @click="submitCancel">
              取消
            </div>
            <div v-show="pageInfo.localSaveTime" class="localSaveTime">
              {{ pageInfo.localSaveTime }} 本地自动保存成功
            </div>
          </div>
        </div>
      </div>
      <div v-if="pageInfo.isEditModel === false" class="previewModel">
        <div class="p_list">
          <div class="top">
            <div class="left">
              <span>To Do List 复盘总结</span>
              <b>{{ formateDate() }}</b>
            </div>

            <div class="right">
              <el-popover
                placement="top"
                :width="64"
                trigger="hover"
                popper-class="c-popover"
                content="修改TDL"
              >
                <template #reference>
                  <div class="icon_box">
                    <i class="icon" @click="againEdit" />
                  </div>
                </template>
              </el-popover>
              <el-popover
                placement="bottom-end"
                :width="104"
                trigger="hover"
                popper-class="c-popover2"
                :show-arrow="false"
                @click="againEdit"
              >
                <div class="popover-btn" @click="deleteTdl">
                  删除全部内容
                </div>
                <template #reference>
                  <div class="icon_box">
                    <i class="hidden" />
                  </div>
                </template>
              </el-popover>
            </div>
          </div>
          <div
            v-for="(item, index) in planList" v-show="item.content !== ''" :key="index" class="p_list_item"
            @click="pageInfo.activeIndex = index"
          >
            <div class="floor1">
              <div class="floor1_l">
                <div class="isDone" :class="{ done: item.status == 3 }" @click="done(item, index)" />
                <div class="p_title">
                  计划{{ index + 1 || '' }}
                </div>
                <div class="sync_line">
                  <div class="line" />
                  <div class="dot" />
                </div>
                <div class="addWeekTarget" @click="addWeekTarget(index, item)">
                  {{ item.week_target_name ? item.week_target_name : '+ 添加对齐周目标' }}
                </div>
              </div>
              <div class="time_box">
                <el-time-select
                  v-model="item.from"
                  style="width: 100px;font-size: 12px;"
                  size="small"
                  end-placeholder="开始时间"
                  start="00:00"
                  end="23:45"
                  step="00:15"
                  :clearable="false"
                  @change="selectStartTime(item, index, 2)"
                />
                <span style="margin: 0 5px; font-size: 12px;">至</span>
                <el-time-select
                  v-model="item.to"
                  style="width: 100px"
                  size="small"
                  start="00:00"
                  end="23:45"
                  start-placeholder="结束时间"
                  step="00:15"
                  :clearable="false"
                  @change="selectEndTime(item, index, 2)"
                />
              </div>
              <el-select
                v-model="item.type" popper-class="custom-select-dropdown" size="small" class="select1" placeholder="请选择"
                @change="update2(item)"
              >
                <el-option
                  v-for="itemOpt1 in options.opt1" :key="itemOpt1.value"
                  :label="itemOpt1.label" :value="itemOpt1.value"
                />
              </el-select>

              <el-select
                v-model="item.level" size="small" class="select2"
                :style="{ color: options.opt2[item.level - 1].color }" placeholder="请选择"
                @change="update2(item)"
              >
                <el-option
                  v-for="itemOpt2 in options.opt2" :key="itemOpt2.value" class="opt"
                  :label="itemOpt2.label" :value="itemOpt2.value"
                >
                  <div class="select_text flex items-center">
                    <div class="dot" style="float: left" :style="{ background: itemOpt2.color }" />
                    <span class="text" style="float: left" :style="{ color: itemOpt2.color }">{{ itemOpt2.label }}</span>
                  </div>
                </el-option>
                <template #prefix>
                  <div class="dot" style="float: left" :style="{ background: formateLevelColor(item.level) }" />
                  <span class="select_text_tag" style="float: left" :style="{ color: formateLevelColor(item.level) }">{{ options?.opt2?.[item.level - 1]?.label }}</span>
                </template>
              </el-select>
            </div>
            <div class="plan_input">
              <pre class="text" :class="{ text_done: item.status == 3 }">{{ item.content }}</pre>
            </div>
            <div class="active_list" :class="{ no_active_list: item.action_list.length === 0 }">
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
        <!-- 复盘 -->
        <div class="summary" :class="{ active: showSaveBtn }">
          <div class="summary_top">
            <div class="title">
              总结复盘
            </div>

            <el-popover
              ref="popover" placement="right-start" title="复盘总结可从以下三方面展开：" :width="351"
              trigger="click"
            >
              <div>
                <p class="popover_title">
                  1.对比目标与实际成果，分析问题
                </p>
                <p class="popover_text">
                  回顾当日设定的工作目标与实际完成的工作成果，对比二者差距，分析工作过程中遇到的问题和挑战。
                </p>
                <p class="popover_title">
                  2.总结经验与教训，持续精进
                </p>
                <p class="popover_text">
                  做得好的将其沉淀成可复制的经验方法，待改进的尝试找出可优化的路径策略。
                </p>
                <p class="popover_title">
                  3.收获与反思
                </p>
                <p class="popover_text">
                  提炼当日工作有哪些收获，更好地了解自己的表现。发现潜在问题和改进方向。
                </p>
              </div>
              <template #reference>
                <i class="icon" @click="visible = !visible" />
              </template>
            </el-popover>
          </div>
          <div style="position: relative;">
            <el-input
              v-model="dataDetail.summary" autosize type="textarea" class="summary_input" maxlength="1000" :show-word-limit="dataDetail.summary.length"
              placeholder="复盘总结可从以下三方面展开：

1.对比目标与实际成果，分析问题
回顾当日设定的工作目标与实际完成的工作成果，对比二者差距，分析工作过程中遇到的问题和挑战。
2.总结经验与教训，持续精进
做得好的将其沉淀成可复制的经验方法，待改进的尝试找出可优化的路径策略。
3.收获与反思
提炼当日工作有哪些收获，更好地了解自己的表现。发现潜在问题和改进方向。"
              @input="summaryHandleInputChange" @focusout="inputChange3" @focus="showSaveBtn = true"
            />
          </div>

          <div class="summary_footer">
            <div class="save_btn" :style="dataDetail.summary && showSaveBtn ? '' : 'opacity:0.4'" @click="save(false)">
              保存
            </div>
          </div>
        </div>

        <div style="height: 22px;" />
      </div>
    </div>
    <div v-else class="empty">
      <div class="icon" />
      <div class="t1">
        {{ emptyTimeText }}
        <span>暂无计划</span>
      </div>
      <div class="t2">
        凡事预则立，不预则废。精心规划每一天，是迈向成功的坚实步伐。现在就列出今日计划，让每一个目标都清晰可见。
      </div>
      <div class="add_btn" @click="addPlan('new')">
        + 新建日计划
      </div>
    </div>

    <div v-show="pageInfo.dialogVisible" class="dialog" loading="loading2">
      <div id="syncDialog" class="sync">
        <div class="sync_title">
          同步工作计划
          <div class="sync_close" @click="closeSync2" />
        </div>
        <div class="sync_list">
          <div v-for="(item, index) in lastPlanList" :key="index" class="sync_item">
            <div class="select">
              <div class="check" :class="{ active: item.isCheck }" @click="item.isCheck = !item.isCheck" />
            </div>
            <div class="item" :class="{ active: item.isCheck }" @click="pageInfo.lastActiveIndex = index">
              <div class="statusBox">
                <div class="status" :style="{ background: item.status == 3 ? '#40C46F' : '#F04641' }">
                  {{ item.status == 3 ? '已完成' : '未完成' }}
                </div>
              </div>

              <div
                v-show="item.content !== ''" class="p_list_item"
                @click="pageInfo.lastActiveIndex = index"
              >
                <div class="floor1">
                  <div class="floor1_l">
                    <div class="p_title">
                      计划{{ index + 1 || '' }}
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
                  <div class="isDone" :class="{ done: item.status == 3 }" @click="done(item, index)" />
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
              <div class="glass" />
            </div>
          </div>
        </div>
        <div class="checkAll">
          <div class="select" :class="{ active: pageInfo.isCheckAll }" @click="checkAll" />
          <span>全选</span>
        </div>
        <div class="sync_btn" :style="{ opacity: lastPlanList.filter(item => item.isCheck).length === 0 ? 0.5 : 1 }" @click="syncSub">
          同步昨日的日计划
        </div>
      </div>
    </div>

    <el-dialog v-model="pageInfo.align_week_dialog" v-loading="align_loading" title="对齐周目标" center class="align_week_dialog" @close="pageInfo.align_check = null">
      <div v-if="week_plan_list.length" class="align_week">
        <div class="align_week_list">
          <div v-for="(item, index) in week_plan_list" :key="index" class="align_week_list_item">
            <div class="check" :class="{ active: index == pageInfo.align_check }" @click="pageInfo.align_check = index" />
            <div class="week">
              周目标{{ index + 1 }}
            </div>
            <pre class="content" :class="{ active: index == pageInfo.align_check }">{{ item.content }}</pre>
          </div>
        </div>
        <div class="align_save_btn" :style="{ opacity: pageInfo.align_check !== null ? 1 : 0.5 }" @click="save_align()">
          保存
        </div>
      </div>

      <div v-else class="align_empty">
        <div class="icon" />
        <div class="text">
          暂无周目标
        </div>
        <div class="add_align_btn" @click="goToWeek">
          去填写周目标
        </div>
      </div>
    </el-dialog>
  </div>

  <!-- 导入目标 -->
  <import-day-target ref="drawer" @importHistory="importHistory" />
  <comment
    v-if="pageInfo.isEditModel === false" :id="dataDetail?.id" ref="comment"
    :comment-list-api="api.tdlDayInteractionCommentList"
    :comment-add-api="api.tdlDayInteractionCommentAdd"
    :comment-del-api="api.tdlDayInteractionCommentDel"
    :comment-like-api="api.tdlDayInteractionCommentLike"
    :comment-like-cancel-api="api.tdlDayInteractionCommentCancelLike"
  >
    <template #header>
      <div class="comment_header">
        <!-- <div class="sub_type" @click="commentOpt.showSelect = !commentOpt.showSelect"> -->
        <div class="sub_type">
          {{ dataDetail.status === 2 ? '公开发布' : '仅自己可见' }}
          <!-- <i class="bottom" /> -->
          <div v-show="commentOpt.showSelect" class="select">
            <div class="item" :class="{ active: dataDetail.status === 2 }" @click="changePublicHandle(2)">
              公开发布
            </div>
            <div class="item" :class="{ active: dataDetail.status === 3 }" @click="changePublicHandle(3)">
              仅自己可见
            </div>
          </div>
        </div>
        <div class="zan" :class="{ active: dataDetail.has_liked }" @click="zan">
          <i class="z" />
          <span>
            <span v-show="dataDetail.has_liked">已</span>点赞
            <span v-show="dataDetail.like_count">
              {{ dataDetail.like_count }}
            </span>
          </span>
        </div>
      </div>
    </template>
  </comment>
</template>

<script>
import moment from 'moment'
import * as api from '@/api/tdl'
import Comment from '@/components/pc/comment.vue'
import { getToken } from '@/utils/auth'
import { getLocalData, getLocalSummary, removeLocalData, removeLocalSummary, setLocalData, setLocalSummary } from '../util/util'
import ImportDayTarget from './ImportDayTarget.vue'

export default {
  name: 'TDLContent',
  components: {
    Comment,
    ImportDayTarget,
  },
  props: {
    sDate: { // 选中的日期
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // TdlDayTargetItem: {
      //     "id": 1,
      //     "week_target_id": 1, // 周目标id
      //     "week_target_name": "<周目标内容>",
      //     "type": 1, // 目标类型 1.工作项目 2.个人成长 3.突发情况
      //     "status": 1, // 状态 0.待开始 1.未完成 2.进行中 3.已完成
      //     "from": "<开始时间，精确到分，字符串 比如 15:12>",
      //     "to": "<结束时间，精确到分 字符串>",
      //     "level": 1, // 优先级 1.高 2.中 3.低
      //     "content": "<目标内容>",
      //     // 实施行动
      //     "action_list": [
      //         {
      //              "id": 1,
      //              "content": "<行动内容>"
      //         }
      //     ]
      // }
      moment,
      visible: false,
      planList: [],
      Overview: {},
      value: [],
      dataDetail: {
        summary: '',
      },
      lastPlanList: [],
      week_plan_list: [],
      showSaveBtn: false,
      token: getToken(),
      pageInfo: {
        isEditModel: true,
        activeIndex: 0,
        lastActiveIndex: 0,
        dialogVisible: false, // 同步昨日计划
        align_week_dialog: false,
        isCheckAll: false,
        is_load_last: false,
        can_submit: false,
        useCache: false,
        is_public: false,
        align_check: null,
        align_check_item: {},
        open_select_align_index: 0,
        localSaveTime: '',
        summary_is_save: false,
        summary_word_count: 0,
      },

      parentOffsetTop: 0,
      emptyTimeText: '',
      loading: false,
      loading2: false,
      align_loading: false,
      saveInterval: null,
      stopInterval: false,
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
      commentOpt: {
        showSelect: false,
        zanLoading: false,
      },
    }
  },
  computed: {
    is_public() {
      return this.detail.status === 2
    },
  },
  watch: {
    async sDate() {
      this.pageInfo = {
        activeIndex: 0,
        lastActiveIndex: 0,
        dialogVisible: false,
        isCheckAll: false,
        is_load_last: false,
        align_check: null,
        localSaveTime: '',
      }
      this.commentOpt = {
        showSelect: false,
        zanLoading: false,
      }
      // 关闭导入弹窗
      const drawer = this.$refs.drawer
      if (drawer) drawer.closeWithInit()

      this.dataDetail.summary = ''
      this.emptyTime()

      const res2 = await api.tdlDayOverview({
        day: this.sDate,
      })
      if (res2 && res2.overview) {
        this.Overview = res2.overview
      } else {
        this.Overview = {
          delay_count: 0, // 未完成数量
          done_count: 0, // 已完成数量
          pending_count: 0, // 待开始数量
          has_summary: 0, // 是否有总结 0否1是
          process_count: 0,
          summary_status: 1,
        }
      }

      const res = await api.tdlDayDetail({
        day: this.sDate,
      })

      if (res && res.detail && res.detail?.id) { // 如果有日计划
        if (res.detail?.status && res.detail?.status === 1) { // 待发布状态展示编辑
          this.pageInfo.isEditModel = true
          this.importCache()
        } else {
          this.pageInfo.isEditModel = false
          this.showSaveBtn = true
          await this.getPlanList()
        }
      } else {
        this.pageInfo.isEditModel = true
        this.showSaveBtn = false

        this.planList = []
        this.dataDetail = {
          status: 3,
          summary: '',
        }
        const cache = getLocalData(this.sDate, 'day')
        if (cache) {
          this.planList = cache
        }
        const summaryCache = getLocalSummary(this.sDate, 'day')
        if (summaryCache && this.pageInfo.isEditModel) {
          this.dataDetail.summary = summaryCache
        }
      }
    },
    'dataDetail.summary': {
      handler(val) {
        this.$nextTick(() => {
          if (this.pageInfo.isEditModel) {
            setLocalSummary(this.sDate, 'day', val)
          }
        })
      },
    },

    'pageInfo.dialogVisible': {
      handler(val) {
        const html = document.documentElement
        const body = document.body

        if (val) {
          html.style.overflow = 'hidden'
          body.style.overflow = 'hidden'
          this.$nextTick(() => {
            listenerElHeightById('syncDialog', 400)
            emitParentCanScroll(2)
          })
        } else {
          html.style.overflow = ''
          body.style.overflow = ''
          this.$nextTick(() => {
            emitParentCanScroll(1)
          })
        }
      },
    },
    // 'pageInfo.align_week_dialog': {
    //   handler(val) {
    //     const html = document.documentElement
    //     const body = document.body

    //     if (val) {
    //       this.$refs.content.style.paddingBottom = '500px'
    //       html.style.overflow = 'hidden'
    //       body.style.overflow = 'hidden'
    //       this.$nextTick(() => {
    //         listenerElHeightById('syncDialog', 400)
    //         emitParentCanScroll(2)
    //       })
    //     } else {
    //       this.$refs.content.style.paddingBottom = '0'

    //       html.style.overflow = ''
    //       body.style.overflow = ''
    //       this.$nextTick(() => {
    //         emitParentCanScroll(1)
    //       })
    //     }
    //   },
    // },
  },
  async created() {
    this.emptyTime()
  },
  async mounted() {
    // 监听父页面的消息
    // window.addEventListener('message', (event) => {
    // this.parentOffsetTop = event.data.scrollTop
    // })

    this.startIntervalUpdate()
    const res = await api.tdlDayDetail({
      day: this.sDate,
    })

    await this.getPlanList()
    if (res?.detail && res.detail?.status && res.detail?.status !== 1) { // 预览页
      this.pageInfo.isEditModel = false
      this.showSaveBtn = true
    } else { // 编辑页
      this.pageInfo.isEditModel = true
      const cache = getLocalData(this.sDate, 'day')
      if (cache) {
        this.planList = cache
      }
      const summaryCache = getLocalSummary(this.sDate, 'day')
      if (summaryCache) {
        this.dataDetail.summary = summaryCache
      }
      // this.importCache()
    }
  },
  beforeUnmount() {
    this.pauseIntervalUpdate()
    this.stopInterval = false
  },
  methods: {
    goToWeek() {
      this.$emit('goToWeek', this.sDate)
      this.pageInfo.align_week_dialog = false
    },
    startIntervalUpdate() {
      if (!this.stopInterval) {
        if (this.setInterval) {
          clearInterval(this.setInterval)
        }
        this.saveInterval = setInterval(() => {
          if (this.pageInfo.isEditModel) {
            this.update()
          }
        }, 5000)
      }
    },
    pauseIntervalUpdate() {
      if (this.saveInterval) {
        clearInterval(this.saveInterval)
        this.saveInterval = null
        this.stopInterval = true
      }
    },

    async selectTime(val, item, index) {
      item.from = val[0]
      item.to = val[1]
    },
    changePublic() {
      if (this.dataDetail?.status && this.dataDetail?.status === 2) {
        this.dataDetail.status = 3
        this.$message.warning({
          message: '已关闭公开发布',
          // offset: this.parentOffsetTop,
        })
      } else {
        this.dataDetail.status = 2
        this.$message.warning({
          message: '已开启公开发布',
          // offset: this.parentOffsetTop,
        })
      }
    },
    async getOverview() {
      const res = await api.tdlDayOverview({
        day: this.sDate,
      })
      if (res && res.overview) {
        this.Overview = res.overview
      } else {
        this.Overview = {
          delay_count: 0, // 未完成数量
          done_count: 0, // 已完成数量
          pending_count: 0, // 待开始数量
          has_summary: 0, // 是否有总结 0否1是
          process_count: 0,
          summary_status: 1,
        }
      }
    },
    async getPlanList(lod = true) { //  同步detail 、 Overview 、planList数据
      if (lod) {
        this.loading = true
      }
      const res = await api.tdlDayDetail({
        day: this.sDate,
      })
      if (res && res.detail) {
        const res2 = await api.tdlDayOverview({
          day: this.sDate,
        })
        this.Overview = res2.overview
      } else {
        this.Overview = {
          delay_count: 0, // 未完成数量
          done_count: 0, // 已完成数量
          pending_count: 0, // 待开始数量
          has_summary: 0, // 是否有总结 0否1是
          process_count: 0,
          summary_status: 1,
        }
      }
      if (lod) {
        this.loading = false
      }

      if (res.detail && res.detail?.id) { // 获取评论
        setTimeout(() => {
          if (this.$refs.comment) {
            this.$refs.comment.changeCommentId(res.detail.id)
          }
        }, 100)
        this.dataDetail = res.detail
      }
      if (res.detail?.summary) {
        this.dataDetail.summary = res.detail.summary
      } else {
        this.dataDetail.summary = ''
      }
      if (res.detail?.target_list.length > 0) {
        this.planList = res.detail.target_list
      } else {
        this.planList = []
      }
    },
    async done(item) {
      if (item.status == 3) {
        item.status = 1
        const res = await api.tdlDayRecoverTarget({
          id: item.id,
        })
        if (res && res.result) {
          item.status = 1
        }
      } else {
        const res = await api.tdlDayFinishTarget({
          id: item.id,
        })
        if (res && res.result) {
          item.status = 3
        }
      }
      await this.getOverview()
    },
    async addPlan(type) {
      const html = document.documentElement

      this.pageInfo.isEditModel = true

      if (type === 'new') {
        // 同步本地数据
        this.importCache()
      }

      // 同步昨日数据 start
      // const is_last_data = await api.tdlLastDayTarget({
      //   day: this.sDate,
      // })

      // let is_setting_last_data = ''
      // if (this.token) {
      //   is_setting_last_data = localStorage.getItem(`tdlSync:${this.token}_${this.sDate}`)
      // }
      // if (!this.pageInfo.useCache && !this.dataDetail?.id && !is_setting_last_data && is_last_data && is_last_data?.targets?.length && !this.pageInfo.is_load_last) {
      //   this.pageInfo.is_load_last = true
      //   if (this.token) {
      //     localStorage.setItem(`tdlSync:${this.token}_${this.sDate}`, true)
      //   }
      //   return this.sync()
      // }
      // 同步昨日数据 end

      let from, to

      if (this.planList.length) {
        from = moment().add(1, 'hour').startOf('hour').format('HH:mm')
        to = moment().add(2, 'hour').startOf('hour').format('HH:mm')
        if (this.planList.length) {
          from = moment(this.planList[this.planList.length - 1].to, 'HH:mm').format('HH:mm')
          to = moment(this.planList[this.planList.length - 1].to, 'HH:mm').add(1, 'hour').format('HH:mm')
          if (moment(to, 'HH').hour() === 0) {
            from = '23:00'
            to = '23:59'
          }
        }
      } else {
        if (this.sDate === moment().format('YYYY-MM-DD')) { // 当天计划
          from = moment().add(1, 'hour').startOf('hour').format('HH:mm')
          to = moment(from, 'HH:mm').add(1, 'hour').startOf('hour').format('HH:mm')
          if (moment(to, 'HH').hour() === 0) {
            from = '23:00'
            to = '23:59'
          }
        } else {
          from = '08:00'
          to = '09:00'
        }

        if (moment(from, 'HH').hour() === 0) {
          from = '23:00'
          to = '23:59'
        }
      }

      this.planList.push({
        type: 1, // 目标类型 1.工作项目 2.个人成长 3.突发情况
        status: 0, // 状态 0.待开始 1.未完成 2.进行中 3.已完成
        from,
        to,
        level: 3, // 优先级 1.高 2.中 3.低
        content: '',
        // 实施行动
        action_list: [],
      })
      if (type !== 'new') {
        setTimeout(() => {
          let offsetHeight = html.scrollTop
          html.scrollTop = offsetHeight += 144
        }, 0)
      }
    },
    async closePlan(index) {
      if (this.planList.length === 1) {
        return this.$message.error({
          message: '至少保留一条工作计划',
        })
      }
      ElMessageBox.confirm(
        '确认是否删除',
        '提醒',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
          // customStyle: {
          //   'top': `${this.parentOffsetTop + 200}px`,
          //   'vertical-align': 'top',
          // },
        },
      )
        .then(() => {
          this.planList.splice(index, 1)
          this.update()
        })
        .catch(() => {

        })
    },
    async selectStartTime(item, index, type = 1) {
      this.$nextTick(() => {
        let gap = item?.time_gap
        if (!gap) {
          gap = 60
        }
        item.to = moment(item.from).add(gap, 'minutes')
        const time = moment(item.from, 'HH:mm')
        item.to = time.add(gap, 'minutes').format('HH:mm')
        if (moment(item.from, 'HH:mm').isAfter(moment(item.to, 'HH:mm'))) {
          item.to = '23:59'
        }
        if (type === 2) {
          this.update2(item)
        } else {
          this.update()
        }
      })
    },
    async selectEndTime(item, index, type = 1) {
      const time1 = moment(item.from, 'HH:mm')
      const time2 = moment(item.to, 'HH:mm')

      const differenceInMinutes = time2.diff(time1, 'minutes')
      if (differenceInMinutes > 0) {
        this.planList[index].time_gap = differenceInMinutes
      } else {
        this.planList[index].time_gap = 60
        item.to = item.from
        this.$message.error({
          message: '结束时间不能大于开始时间',
          // offset: this.parentOffsetTop,
        })
      }
      if (type === 2) {
        this.update2(item)
      } else {
        this.update()
      }
    },
    async update() {
      this.stopInterval = false
      let has_content = false
      this.planList.forEach((item) => {
        if (item.content) {
          has_content = true
        }
      })
      if (this.planList.length && !this.stopInterval && has_content) {
        setLocalData(this.sDate, 'day', this.planList)
        this.pageInfo.localSaveTime = moment().format('HH:mm')
      } else {
        removeLocalData(this.sDate, 'day')
      }
    },
    update2(item) { // 预览模式下接口不同
      setTimeout(async () => {
        await api.tdlLastDayModifyTarget({
          ...item,
        })
        setLocalData(this.sDate, 'day', this.planList)
        await this.getOverview()
      }, 500)
    },
    async addActive(item, index) {
      if (this.planList[index].action_list === null) {
        this.planList[index].action_list = []
      }
      this.planList[index].action_list.push({
        content: '',
      })
      this.update()
    },
    async closeActive(plan_i, active_i) {
      ElMessageBox.confirm(
        '确认是否删除',
        '提醒',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
          // customStyle: {
          //   'top': `${this.parentOffsetTop + 200}px`,
          //   'vertical-align': 'top',
          // },
        },
      )
        .then(() => {
          this.planList[plan_i].action_list.splice(active_i, 1)
          this.update()
        })
        .catch(() => {

        })
    },

    emptyTime() {
      const weekdays = ['一', '二', '三', '四', '五', '六', '日']
      this.emptyTimeText = `${moment(this.sDate).format('YYYY年MM月DD日')}(周${weekdays[moment(this.sDate).isoWeekday() - 1]})`
    },
    formateDate() {
      const weekdays = ['一', '二', '三', '四', '五', '六', '日']
      return `${moment(this.sDate).format('MM月DD日')} ` + `(周${weekdays[moment(this.sDate).isoWeekday() - 1]})`
    },
    formateTime(item) {
      return `${item.from} 至 ${item.to}`
    },
    formateType(item) {
      return this.options.opt1[item.type - 1].label
    },
    formateLevel(item) {
      return ['高', '中', '低']?.[item.level - 1] || '低'
    },
    formateLevelColor(level) {
      return ['#F54A46', '#FF8802', '#3170FF'][level - 1]
    },
    publish_content_blur() {
      this.$nextTick(() => {
        this.dataDetail.subject = this.dataDetail.subject.trim()
      })
    },
    async publish() { // 点击发布
      const res = await api.tdlDayUpdate({
        ...this.dataDetail,
        status: this.pageInfo.is_public ? 2 : 3,
        target_list: this.planList,
      })
      return res
    },
    againEdit() {
      this.pageInfo.isEditModel = true
      this.showSaveBtn = false
      this.pageInfo.is_public = this.dataDetail?.status === 2
      this.importCache()
    },
    importCache() { // 导入缓存方法
      const cache = getLocalData(this.sDate, 'day')

      if (cache && cache.length) {
        let planList_ = Object.assign([], this.planList)
        let cache_ = Object.assign([], cache)
        planList_ = planList_.map((v) => {
          let action_list = v.action_list
          action_list = action_list.map((v2) => {
            return v2.content
          })
          return {
            content: v.content,
            type: v.type,
            level: v.level,
            from: v.from,
            to: v.to,
            action_list,
          }
        })
        cache_ = cache_.map((v) => {
          let action_list = v.action_list
          action_list = action_list.map((v2) => {
            return v2.content
          })
          return {
            content: v.content,
            type: v.type,
            level: v.level,
            from: v.from,
            to: v.to,
            action_list,
          }
        })

        if (JSON.stringify(cache_) !== JSON.stringify(planList_)) {
          ElMessageBox.confirm(
            '有未发布的草稿，是否使用',
            '提醒',
            {
              confirmButtonText: '使用',
              cancelButtonText: '取消',
              type: 'info',
            // customStyle: {
            //   'top': `${this.parentOffsetTop + 200}px`,
            //   'vertical-align': 'top',
            // },
            },
          )
            .then(() => {
              this.planList = cache
              this.pageInfo.useCache = true
            })
            .catch(() => {
              removeLocalData(this.sDate, 'day')
            })
        }
      }

      const summaryCache = getLocalSummary(this.sDate, 'day')
      if (summaryCache && this.pageInfo.isEditModel) {
        this.dataDetail.summary = summaryCache
      }
    },
    async submit() {
      // 关闭导入弹窗
      const drawer = this.$refs.drawer
      if (drawer) drawer.closeWithInit()
      if (this.planList.length === 0) {
        this.$message.error({
          message: '请填写计划',
          // offset: this.parentOffsetTop,
        })
        return
      }
      this.checkForm()
      if (this.pageInfo.can_submit) {
        this.showSaveBtn = true
        this.pageInfo.isEditModel = false
        let res
        if (this.dataDetail?.id) { // 有发布数据的状态 走update
          res = await this.publish()
        } else { // 首次发布走新建接口
          res = await api.tdlDayNew({
            ...this.dataDetail,
            day: this.sDate,
            status: this.pageInfo.is_public ? 2 : 3,
            target_list: [...this.planList],
          })
        }
        if (res && res.result) {
          this.$message.success({
            message: '发布成功',
            // offset: this.parentOffsetTop,
          })
          // 新建完后删除缓存
          removeLocalData(this.sDate, 'day')
          removeLocalSummary(this.sDate, 'day')
          // 更新datadetail
          await this.getPlanList()
        }
      }
    },
    async submitCancel() {
      const cache = getLocalData(this.sDate, 'day')
      if (cache) {
        this.pauseIntervalUpdate()
      }
      if (this.dataDetail.id) {
        this.pageInfo.isEditModel = false
        this.getPlanList()
      } else {
        this.planList = []
      }
    },
    checkForm() {
      // 校验表单规则
      let isOk = true

      for (let i = 0; i < this.planList.length; i++) {
        const item = this.planList[i]
        if (!item?.content && !item?.content?.trim()) {
          isOk = false
          this.$message.error({
            message: `请填写工作计划${i + 1}内容`,
            // offset: this.parentOffsetTop,
          })
          break
        }
        for (let j = 0; j < item.action_list.length; j++) {
          const item_ = item.action_list[j]
          if (!item_?.content && !item_?.content?.trim()) {
            isOk = false
            this.$message.error({
              message: `请填写工作计划${i + 1}里实行行动${j + 1}内容`,
              // offset: this.parentOffsetTop,
            })
            break
          }
        }
      }

      if (this.pageInfo.is_public) {
        if (!this.dataDetail?.subject) {
          this.$message.error({
            message: `请填写公开发布主题`,
            // offset: this.parentOffsetTop,
          })
          isOk = false
        }
      }

      if (this.dataDetail.summary && this.dataDetail.summary.length > 1000) {
        this.$message.error('总结复盘的字数已超出了限制，请进行精简和优化')
        isOk = false
      }
      this.pageInfo.can_submit = isOk
    },
    async save(auto) {
      // if (!this.showSaveBtn) return
      if (this.dataDetail?.summary && this.dataDetail.id) {
        this.showSaveBtn = false
        this.loading = true

        const res = await api.tdlDaySummary({
          id: this.dataDetail.id,
          summary: this.dataDetail.summary,
        })
        this.loading = false
        this.pageInfo.summary_is_save = true
        if (res && res.result && !auto) {
          this.$message.success({
            message: '保存成功',
            // offset: this.parentOffsetTop,
          })
        }
      }
    },
    checkAll() {
      const now = !this.pageInfo.isCheckAll
      if (this.lastPlanList.length > 0) {
        for (let i = 0; i < this.lastPlanList.length; i++) {
          const item = this.lastPlanList[i]
          item.isCheck = now
        }
        this.pageInfo.isCheckAll = now
      }
    },
    async sync() {
      this.loading2 = true
      const res = await api.tdlLastDayTarget({
        day: this.sDate,
      })
      this.loading2 = false
      this.pageInfo.isCheckAll = false

      if (res && res.targets) {
        const list = []
        res.targets.forEach((v) => {
          if (v?.content) {
            list.push(v)
          }
        })
        this.lastPlanList = list

        if (list.length > 0) {
          setTimeout(() => {
            for (let i = 0; i < this.lastPlanList.length; i++) {
              const item = this.lastPlanList[i]
              item.isCheck = false
            }
            this.pageInfo.dialogVisible = true
          }, 300)
        }
      }
    },
    async syncSub() {
      if (this.lastPlanList.filter(item => item.isCheck).length === 0) return
      let flag = false

      this.lastPlanList.filter((item) => {
        if (item.isCheck) {
          flag = true
        }
      })
      if (flag) {
        const lastPlanList_ = Array.isArray(this.lastPlanList) ? this.lastPlanList : []

        const checkList = []

        lastPlanList_.forEach((item) => {
          if (item.isCheck) {
            delete item.id
            item.action_list = item.action_list.map((item_) => {
              delete item_.id
              return item_
            })
            checkList.push(item)
          }
        })

        this.planList = [...checkList]
        this.update()
      }
      this.closeSync()
    },
    closeSync() {
      this.pageInfo.dialogVisible = false
    },
    async closeSync2() { // 关闭按钮 变成新建
      this.pageInfo.dialogVisible = false
      this.pageInfo.isEditModel = true
      let from, to
      if (this.sDate === moment().format('YYYY-MM-DD')) { // 当天计划
        from = moment().add(1, 'hour').startOf('hour').format('HH:mm')
        to = moment(from, 'HH:mm').add(1, 'hour').startOf('hour').format('HH:mm')
      } else {
        from = '08:00'
        to = '09:00'
      }

      if (moment(from, 'HH').hour() === 0) {
        from = '23:00'
        to = '23:59'
      }
      this.planList.push({
        week_target_name: '',
        type: 1, // 目标类型 1.工作项目 2.个人成长 3.突发情况
        status: 0, // 状态 0.待开始 1.未完成 2.进行中 3.已完成
        from,
        to,
        level: 3, // 优先级 1.高 2.中 3.低
        content: '',
        // 实施行动
        action_list: [],
      })
    },
    async inputChangePlan(item, index) {
      this.planList[index].content = this.planList[index].content.trim()
      this.stopInterval = false
      this.update()
    },
    async inputChangeActive(index, active_index) {
      this.planList[index].action_list[active_index].content = this.planList[index].action_list[active_index].content.trim()
      this.update()
    },
    inputChange3() {
      this.save(true)
      setTimeout(() => {
        this.showSaveBtn = false
      }, 200)
      this.dataDetail.summary.trim()
    },
    // 对齐周目标
    async addWeekTarget(index, item) {
      this.pageInfo.align_week_dialog = true
      this.pageInfo.open_select_align_index = index
      this.pageInfo.align_check_item = item
      this.align_loading = true
      const start_day = moment(this.sDate).startOf('week').format('YYYY-MM-DD')
      const end_day = moment(this.sDate).startOf('week').add(6, 'days').format('YYYY-MM-DD')
      const res = await api.tdlLastWeekList({
        start_day,
        end_day,
      })
      if (res && res.targets) {
        this.week_plan_list = res.targets
      }
      if (!res?.targets) {
        this.week_plan_list = []
      }
      this.align_loading = false
    },
    async save_align() { // 保存周目标同步信息
      if (this.pageInfo.align_check === null) {
        return this.$message.error({
          message: '请选择周目标',
          // offset: this.parentOffsetTop,
        })
      }
      if (!this.pageInfo.isEditModel) {
        const week_item = this.week_plan_list[this.pageInfo.align_check]
        const item_ = Object.assign({}, this.pageInfo.align_check_item)
        item_.week_target_id = week_item.id
        item_.week_target_name = week_item.content
        this.planList[this.pageInfo.open_select_align_index].week_target_id = item_.week_target_id

        this.planList[this.pageInfo.open_select_align_index].week_target_name = item_.week_target_name
        this.update2(item_)
      } else {
        const item = this.week_plan_list[this.pageInfo.align_check]
        this.planList[this.pageInfo.open_select_align_index].week_target_id = item.id
        this.planList[this.pageInfo.open_select_align_index].week_target_name = item.content
        this.update()
      }
      this.pageInfo.align_week_dialog = false
    },
    async changePublicHandle(status) {
      const res = await api.tdlDayModifyStatus({
        id: this.dataDetail.id,
        status,
      })
      if (res && res.result) {
        this.dataDetail.status = status
        if (this.dataDetail?.status && this.dataDetail?.status === 3) {
          this.$message.warning({
            message: '已关闭公开发布',
            // offset: this.parentOffsetTop,
          })
        } else {
          this.$message.warning({
            message: '已开启公开发布',
            // offset: this.parentOffsetTop,
          })
        }
      }
    },
    async zan() {
      if (this.dataDetail.has_liked) {
        if (!this.commentOpt.zanLoading) {
          this.commentOpt.zanLoading = true
          const res = await api.tdlDayCancelLike({
            id: this.dataDetail.id,
          })
          if (res) {
            this.commentOpt.zanLoading = false
            await this.getPlanList()
          }
        }
      } else {
        if (!this.commentOpt.zanLoading) {
          this.commentOpt.zanLoading = true
          const res = await api.tdlDayLike({
            id: this.dataDetail.id,
          })
          if (res) {
            this.commentOpt.zanLoading = false
            await this.getPlanList()
          }
        }
      }
    },
    summaryHandleInputChange(value) {
      this.pageInfo.summary_word_count = value.length
    },
    importData() { // 点击导入目标
      const drawer = this.$refs.drawer
      if (drawer) drawer.open(this.sDate)
      if (!this.pageInfo.isEditModel) this.pageInfo.isEditModel = true
    },
    importHistory(data) { // 导入目标数据
      const summary = data.summary
      const list = data.list
      if (this.dataDetail.summary) {
        this.dataDetail.summary += summary
      } else {
        this.dataDetail.summary = summary
      }

      this.pageInfo.summary_word_count = this.dataDetail.summary.length
      if (!this.planList.length) {
        if (list.length) {
          this.planList.push(...list)
        } else {
          let from, to
          if (this.sDate === moment().format('YYYY-MM-DD')) { // 当天计划
            from = moment().add(1, 'hour').startOf('hour').format('HH:mm')
            to = moment(from, 'HH:mm').add(1, 'hour').startOf('hour').format('HH:mm')
          } else {
            from = '08:00'
            to = '09:00'
          }

          this.planList.push({
            type: 1, // 目标类型 1.工作项目 2.个人成长 3.突发情况
            status: 0, // 状态 0.待开始 1.未完成 2.进行中 3.已完成
            from,
            to,
            level: 3, // 优先级 1.高 2.中 3.低
            content: '',
            // 实施行动
            action_list: [],
          })
        }
      } else {
        this.planList.push(...list)
      }
    },
    deleteTdl() {
      ElMessageBox.confirm(
        `确认删除${this.sDate}当天的所有工作计划、总结和评论内容吗？`,
        '提醒',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(async () => {
          const res = await api.tdlDayDelete({
            id: this.dataDetail.id,
          })
          if (res && res.result) {
            this.$message({
              type: 'success',
              message: '删除成功',
            })
            this.pageInfo = {
              isEditModel: true,
              activeIndex: 0,
              lastActiveIndex: 0,
              dialogVisible: false, // 同步昨日计划
              align_week_dialog: false,
              isCheckAll: false,
              is_load_last: false,
              can_submit: false,
              useCache: false,
              is_public: false,
              align_check: null,
              align_check_item: {},
              open_select_align_index: 0,
              localSaveTime: '',
              summary_is_save: false,
              summary_word_count: 0,
            }
            this.planList = []
            this.dataDetail = {
              summary: '',
              status: 3,
            }
            this.removeLocalData(this.sDate, 'day')
            this.removeLocalSummary(this.sDate, 'day')
          }
        })
        .catch(() => {

        })
    },
  },

}
</script>

<style lang="scss" scoped>
@import url('../scss/tdlContentScoped.scss');
</style>

<style lang='scss'>
@import url('../scss/tdlContent.scss');
</style>
