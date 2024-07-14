<template>
  <div id="comment" v-loading="loading">
    <slot name="header" />
    <div id="1" class="commentHeader">
      <h1>
        <img src="./comment/img/竖杠.png" alt="">
        评论 <span v-if="list.total !== 0">{{ list.total }}</span>
      </h1>
      <p class="commentActiveBtn">
        <a :class="sortStatus === 0 ? 'commentActive' : ''" href="javascript:;" @click="defaultComment()">默认</a>
        <a :class="sortStatus === 1 ? 'commentActive' : ''" href="javascript:;" @click="latestComment()">最新</a>
      </p>
    </div>
    <div class="comment">
      <div class="commentInput">
        <div class="tacitlyApproveImg">
          <img src="./comment/img/默认头像%20@2x.png" alt="">
        </div>
        <div class="inputContent">
          <div id="sampleExpression_" class="sampleExpression">
            <span v-for="(item, index) in emojiListTest" :key="index" class="sampleExpressionSpan" @click.stop="sampleChooseClickSole(item.emoji)">
              {{ item.emoji }}
            </span>
          </div>
          <div id="sampleSan_jiao_" class="san_jiao" />
          <el-input
            id="revertSmilingInput"
            v-model="textarea"
            type="textarea"
            autosize
            placeholder="留下你精彩评论…"
          />
          <img src="./comment/img/smilingFace.png" alt="" class="sampleSan_icon" @click="sampleSmilingSole()">
        </div>
        <div class="inputBtn" @click="addComment()">
          <button type="button">
            发布
          </button>
        </div>
      </div>
      <div v-if="list?.list?.length === 0" class="noComments">
        <img src="./comment/img/noComment.png" alt="">
        暂无评论哦～
      </div>
      <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-distance="scrollDistance">
        <div v-for="(item, index) in list.list" :key="index" class="commentContent">
          <div class="commentContentHead">
            <div>
              <p>
                <img v-if="item.from_user_avatar" :src="item.from_user_avatar" alt="">
                <img v-else src="./comment/img/默认头像%20@2x.png" alt="">
              </p>
              <h1>
                {{ item.from_user_name }}
                <img v-if="item.is_top" src="./comment/img/精icon@2x.png" alt="">
              </h1>
            </div>
            <!-- <img src="./comment/img/消息更多icon@2x.png" alt="" @click="reportComment(item.id)"> -->
            <div :id="`report_${item.id}`" style="display: none" class="report">
              <div>
                <p>更多</p>
                <img src="./comment/img/关闭icon@2x.png" alt="" @click="closeReportComment(item.id)">
              </div>
              <div class="reportBtn" @click="toReportComments(item.id)">
                <img src="./comment/img/举报icon@2x.png" alt="">
                举报评论
              </div>
              <p class="sanJiao" />
            </div>
          </div>
          <div :id="`textContent_${item.id}`" :class="item.content.trim()?.length >= 140 ? 'contentText commentContentHide' : 'contentText' ">
            {{ item.content }}
          </div>
          <div v-if="item.content.trim()?.length >= 140" :id="`commSpread_${item.id}`" class="spread">
            <div @click="openComment(item.id)">
              展开
              <img src="./comment/img/展开icon@2x.png" alt="">
            </div>
          </div>
          <div class="commentBtn">
            <div class="left">
              {{ showTime(item.create_time) }}
            </div>
            <div class="right">
              <div v-if="item.is_owner === true" @click="deleteComment(item.id, index)">
                删除
              </div>
              <span v-if="item.is_owner === true">|</span>
              <div @click="discuss(item.id, item.from_user_name, index)">
                <img src="./comment/img/消息评论icon@2x.png" alt="">
                <p v-if="item.chain_count !== 0">
                  {{ item.chain_count }}
                </p>
              </div>
              <span>|</span>
              <div>
                <img :id="`yesGive_${item.id}`" :style="item.is_liked === false ? 'display: block' : 'display: none'" src="./comment/img/image.png" alt="" @click="yesGiveLike(item)">
                <img :id="`noGive_${item.id}`" :style="item.is_liked === true ? 'display: block' : 'display: none'" src="./comment/img/点赞2icon@2x.png" alt="" @click="noGiveLike(item)">
                <p>
                  <test v-if="item.likes !== 0">
                    {{ item.likes }}
                  </test>
                </p>
              </div>
            </div>
          </div>
          <div v-if="item.chain_list?.length !== 0" class="childComments">
            <div v-for="(items, indexs) in item.chain_list" :key="indexs">
              <div :id="`comment_${item.id}`">
                <div class="childCommentsCont">
                  <div class="commentsContTitle">
                    <span style="color: #D0936F">{{ items.from_user_name }}</span>
                    <span style="color: #999999;">回复</span>
                    <span style="color: #D0936F">{{ items.to_user_name }}：</span>
                    {{ items.content }}
                  </div>
                  <div class="commentsContBtn">
                    <p>{{ showTime(items.create_time) }}</p>
                    <div>
                      <p v-if="items.is_owner === true" @click="deleteComment(items.id, index)">
                        删除
                      </p>
                      <p style="margin: 0 30px" @click="replyComments(item.id, items.id, items.from_user_name)">
                        回复
                      </p>
                    </div>
                    <div :id="`report_${items.id}`" style="display: none" class="report">
                      <div>
                        <p>更多</p>
                        <img src="./comment/img/关闭icon@2x.png" alt="" @click="closeReportComment(items.id)">
                      </div>
                      <div class="reportBtn" @click="toReportComments(items.id)">
                        <img src="./comment/img/举报icon@2x.png" alt="">
                        举报评论
                      </div>
                      <p class="sanJiao" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.chain_count > 3" :id="`div-all-comments_${item.id}`" class="allComments">
              <p style="cursor: pointer" @click="GetAllSubComment(item)">
                查看全部评论
                <img src="./comment/img/allComments.png" alt="">
              </p>
            </div>
          </div>
          <div :id="`addComment_${item.id}`" style="display: none" class="addComment">
            <div class="addCommentInput">
              <div :id="`sampleExpression_${item.id}`" class="sampleExpression">
                <span v-for="(iteme, index) in emojiListTestSon" :key="index" class="sampleExpressionSpan" @click.stop="sampleChooseClick(iteme.emoji, item.id)">
                  {{ iteme.emoji }}
                </span>
              </div>
              <div :id="`sampleSan_jiao_${item.id}`" class="san_jiao" />
              <input :id="`revertSmilingInput_${item.id}`" class="revertSmilingInput_grey" type="text" placeholder="回复  用户昵称：">
              <img src="./comment/img/smilingFace.png" class="sampleSan_icon" alt="" @click="sampleSmiling(item.id)">
            </div>
            <div class="addCommentBtn">
              <button class="deleteBrn" @click="$(`#addComment_${item.id}`).hide(), $(`#revertSmilingInput_${item.id}`).val('')">
                取消
              </button>
              <button class="replyBtn" @click="addDiscuss(item.id, index)">
                回复
              </button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="loadMore" class="loadMore">
        加载中...
      </p>
      <!-- <p v-if="noMore" class="noMore">
        没有更多了
      </p> -->
      <!-- <div class="orderListPaging">
        <el-pagination
          background
          :hide-on-single-page="true"
          :current-page="ListParam.page"
          prev-text="上一页"
          next-text="下一页"
          layout="prev, pager, next"
          :total="list.total"
          @size-change="PayListsHandleSizeChange"
          @current-change="PayListsHandleCurrentChange"
        />
      </div> -->
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'

export default {
  props: {
    id: {
      type: Number,
      default: 0,
      required: true,
    },
    commentListApi: {
      type: Function,
      required: true,
    },
    commentAddApi: {
      type: Function,
      required: true,
    },
    commentDelApi: {
      type: Function,
      required: true,
    },
    commentLikeApi: {
      type: Function,
      required: true,
    },
    commentLikeCancelApi: {
      type: Function,
      required: true,
    },

  },
  data() {
    return {
      message: 'Vue模块',
      loading: false,
      list: [],
      module: '',
      moduleId: '',
      textarea: '',
      index: '',
      sortStatus: 0,
      controlSmilingTestSole: true,
      controlSmilingTest: true,
      loadingSon: false,
      textContentStatus: true,
      emojiListTest: [],
      emojiListTestSon: [],
      pid: null,
      disabled: false,
      loadMore: false,
      noMore: false,
      scrollDistance: 0,
      ListParam: {
        module: '',
        tdl_id: -1,
        top_id: 0,
        limit: 10,
        page: 1,
        sort: '',
        total: 0,
      },
      $,
      parentOffsetTop: 0,
    }
  },
  computed: {

  },
  created() {
    this.ListParam.tdl_id = this.id
    this.ListParam.page = 1

    // this.commentList()

    // this.$listener.$on(EventEnums.Comment, (param) => {
    //   this.ListParam.module = param.module
    //   this.ListParam.module_id = param.moduleId
    //   this.module = param.module
    //   this.moduleId = param.moduleId
    //   this.commentList()
    // })
  },
  async mounted() {
    if (!window.RongEmoji) {
      // 使用fetch加载CDN资源
      const response = await fetch('https://cdn.ronghub.com/RongEmoji-2.2.9.min.js')
      if (response.ok) {
        const script = document.createElement('script')
        script.textContent = await response.text()
        document.head.appendChild(script)
      } else {
        console.error(`Failed to fetch RongEmoji: ${response.statusText}`)
      }
    }

    // 监听父页面的消息
    window.addEventListener('message', (event) => {
      this.parentOffsetTop = event.data.scrollTop
    })
    // 监听点击事件
    document.addEventListener('click', (event) => {
      if (!['sampleExpression', 'sampleSan_icon'].includes(event.target.className)) {
        this.sampleNoSmilingSoleByClass()
      }
    })

    window.addEventListener('scroll', () => {
      const html = document.documentElement
      this.scrollDistance = html.scrollTop
    })
  },
  updated() {

  },
  methods: {
    async load() {
      this.loadMore = true
      this.ListParam.page += 1
      if (this.ListParam.tdl_id === 0) return

      await this.commentList('push')
      this.loadMore = false
      if (this.list.total === this.list?.list?.length) {
        this.noMore = true
        this.disabled = true
        setTimeout(() => {
          this.noMore = false
        }, 2000)
      }
    },
    showTime(atTimestamp) {
      const now = moment()
      const timeDiff = Math.abs(now.diff(new Date(atTimestamp * 1000), 'seconds'))

      if (timeDiff < 60) {
        return '刚刚'
      }

      if (timeDiff < 3600) {
        return `${Math.floor(timeDiff / 60)}分钟前`
      }

      const atTime = moment.unix(atTimestamp)

      if (now.format('YYYY-MM-DD') === atTime.format('YYYY-MM-DD')) {
        return `${Math.floor(timeDiff / 3600)}小时前`
      }

      if (now.year() === atTime.year()) {
        return atTime.format('MM/DD')
      }

      return atTime.format('YYYY/MM/DD')
    },
    async changeCommentId(id) {
      this.ListParam.tdl_id = id
      this.ListParam.page = 1
      this.textarea = ''
      await this.commentList()
    },
    async commentList(type) {
      const res = await this.commentListApi(this.ListParam)

      if (res) {
        if (type === 'push') {
          this.list?.list?.push(...res?.list)
        } else {
          this.list = res
        }
      }

      if (this.list.total === this.list?.list?.length) {
        this.loadMore = false
        this.noMore = true
        this.disabled = true
        setTimeout(() => {
          this.noMore = false
        }, 2000)
      }
    },
    // 表情
    sampleSmilingSole() {
      if (this.controlSmilingTestSole) {
        this.sampleYesSmilingSole()
      } else {
        this.sampleNoSmilingSole()
      }
    },
    sampleYesSmilingSole() {
      this.controlSmilingTestSole = false
      $('#sampleExpression_').show()
      $('#sampleSan_jiao_').show()
      const configs = {
        size: 28, // 大小, 默认 24, 建议15 - 55
        url: '//f2e.cn.ronghub.com/sdk/emoji-48.png', // 所有 emoji 的背景图片
        lang: 'zh', // 选择的语言, 默认 zh
      }
      RongIMLib.RongIMEmoji.init(configs)
      this.emojiListTest = RongIMLib.RongIMEmoji.list
    },
    sampleNoSmilingSole() {
      this.controlSmilingTestSole = true
      $('#sampleExpression_').hide()
      $('#sampleSan_jiao_').hide()
    },
    sampleNoSmilingSoleByClass() {
      this.controlSmilingTestSole = true
      this.controlSmilingTest = true

      $('.sampleExpression').hide()
      $('.san_jiao').hide()
    },
    sampleChooseClickSole(content) {
      this.textarea = this.textarea + content
    },
    // 子评论表情
    sampleSmiling(id) {
      if (this.controlSmilingTest) {
        this.sampleYesSmiling(id)
      } else {
        this.sampleNoSmiling(id)
      }
    },
    sampleYesSmiling(id) {
      this.controlSmilingTest = false
      $(`#sampleExpression_${id}`).show()
      $(`#sampleSan_jiao_${id}`).show()
      const configs = {
        size: 28, // 大小, 默认 24, 建议15 - 55
        url: '//f2e.cn.ronghub.com/sdk/emoji-48.png', // 所有 emoji 的背景图片
        lang: 'zh', // 选择的语言, 默认 zh
      }
      RongIMLib.RongIMEmoji.init(configs)
      this.emojiListTestSon = RongIMLib.RongIMEmoji.list
    },
    sampleNoSmiling(id) {
      this.controlSmilingTest = true
      $(`#sampleExpression_${id}`).hide()
      $(`#sampleSan_jiao_${id}`).hide()
    },
    sampleChooseClick(content, id) {
      if (id) {
        const text = $(`#revertSmilingInput_${id}`).val()
        $(`#revertSmilingInput_${id}`).val(text + content)
      } else {
        const text = $('#revertSmilingInput_').val()
        $('#revertSmilingInput_').val(text + content)
      }
    },
    // 添加评论
    addComment() {
      if (this.textarea === '') {
        return this.$message({
          message: '评论不能为空',
          type: 'warning',
          // offset: this.parentOffsetTop,
        })
      }
      if (this.textarea?.length < 10) {
        return this.$message({
          message: '评论最少10个字哦~',
          type: 'warning',
          // offset: this.parentOffsetTop,
        })
      }
      this.commentsList(this.textarea)
    },
    discuss(id, name, index) {
      this.pid = id
      this.index = index
      $(`#addComment_${id}`).show()
      $(`#revertSmilingInput_${id}`).attr('placeholder', `回复  ${name}`)
      $(`#revertSmilingInput_${id}`).focus()
    },
    async commentsList(content) {
      const res = await this.commentAddApi({
        tdl_id: this.ListParam.tdl_id,
        content,
        pid: this.pid,
      })

      if (res) {
        if (this.pid === null) {
          res.comment.content = content
          res.comment.chain_list = []
          res.comment.is_liked = false
          res.comment.is_owner = true
          res.comment.show_create_time = '刚刚'
          this.list.list.unshift(res.comment)
          this.textarea = ''
          this.list.total += 1
        } else {
          res.comment.content = content
          res.comment.chain_list = null
          res.comment.is_liked = false
          res.comment.is_owner = true
          res.comment.show_create_time = '刚刚'
          this.list.list[this.index].chain_list.unshift(res.comment)
          this.list.list[this.index].chain_count += 1
          this.index = ''
          this.pid = null
        }
      }
    },
    // 删除评论
    deleteComment(id, index) {
      this.$confirm('确定要删除评论信息吗？', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '再想想',
        type: 'warning',
        // customStyle: {
        //   'top': `${this.parentOffsetTop + 200}px`,
        //   'vertical-align': 'top',
        // },
        showClose: false,
      }).then(async () => {
        const res = await this.commentDelApi({ id })

        if (res.result) {
          this.list.list.splice(index, 1)
          this.$message({
            message: '删除成功',
            type: 'success',
            // offset: this.parentOffsetTop,

          })
          this.commentList()
        }
      }).catch(() => {

      })
    },
    // 点赞
    async yesGiveLike(item) {
      const res = await this.commentLikeApi({
        tdl_id: this.ListParam.tdl_id,
        comment_id: item.id,
      })
      if (res.count) {
        item.likes = res.count
        item.is_liked = true
      }
    },
    // 取消点赞
    async noGiveLike(item) {
      const res = await this.commentLikeCancelApi({
        tdl_id: this.ListParam.tdl_id,
        comment_id: item.id,
      })
      if (res) {
        if (res.count === '0') {
          item.likes = 0
          item.is_liked = false
          return
        }
        item.likes = res.count
        item.is_liked = false
      }
    },
    addDiscuss(id, index) {
      const commentContent = $(`#revertSmilingInput_${id}`).val()
      if (commentContent === '') {
        return this.$message.warning({
          message: '评论不能为空',
          // offset: this.parentOffsetTop,
        })
      }
      if (commentContent?.length < 10) {
        return this.$message.warning({
          message: '评论最少10个字哦~',
          // offset: this.parentOffsetTop,
        })
      }
      this.index = index
      this.commentsList(commentContent)
      $(`#addComment_${id}`).hide()
      $(`#revertSmilingInput_${id}`).val('')
    },
    // 回复子评论
    replyComments(id, p_id, name) {
      this.pid = p_id
      $(`#addComment_${id}`).show()
      $(`#revertSmilingInput_${id}`).attr('placeholder', `回复  ${name}`)
      $(`#revertSmilingInput_${id}`).focus()
    },
    // 举报评论
    async reportComment(id) {
      $(`#report_${id}`).show()
    },
    async toReportComments(id) {
      const res = await Vue.prototype.$networkHandler.sendRequest('CommentAudit', {
        module,
        comment_id: id,
      })
      if (res) {
        this.$message.success({
          message: '举报成功',
          // offset: this.parentOffsetTop,
        })
        $(`#report_${id}`).hide()
      }
    },
    // 关闭举报评论
    async closeReportComment(id) {
      $(`#report_${id}`).hide()
    },
    // 分页
    PayListsHandleSizeChange(val) {
      this.ListParam.limit = val
      this.commentList()
    },
    PayListsHandleCurrentChange(val) {
      this.ListParam.page = val
      this.commentList()
    },
    // 查看全部评论
    async GetAllSubComment(item) {
      if (this.loadingSon === true) {
        return
      }
      this.loadingSon = true
      const res = await Vue.prototype.$networkHandler.sendRequest('CommentList', {
        module,
        module_id: moduleId,
        top_id: item.id,
        limit: 0,
        page: 0,
        sort: this.ListParam.sort,
      })
      if (res && res.list) {
        item.chain_list = res.list
        item.chain_count = res.total
        $(`#div-all-comments_${item.id}`).hide()
      }
      this.loadingSon = false
    },
    GetHtmlByList(list) {
      let html = ''
      for (const item of list) {
        html += this.GetHtmlByItem(item)
      }
      return html
    },
    GetHtmlByItem(item) {
      return `
                <div class="childCommentsCont">
                   <div class="commentsContTitle">
                        <span style="color: #D0936F">${item.from_user_name}</span>
                        <span style="color: #999999;">回复</span>
                        <span style="color: #D0936F">${item.to_user_name}：</span>
                        ${item.content}
                   </div>
                   <div class="commentsContBtn">
                       <p>${item.show_create_time}</p>
                       <div>
                            ${item.is_owner ? `<p onclick="deleteComment(${item.id})">删除</p>` : ''}
                            <p onclick="replyComments(${item.top_id},${item.id},'${item.from_user_name}')" style="margin: 0 30px">回复</p>
                            <img onclick="reportComment(${item.id})" src="./comment/img/消息更多icon@2x.png" alt="">
                       </div>
                       <div style="display: none" id="report_${item.id}" class="report">
                            <div>
                               <p>更多</p>
                               <img onclick="closeReportComment(${item.id})" src="./comment/img/关闭icon@2x.png" alt="">
                            </div>
                            <div onclick="toReportComments(${item.id})" class="reportBtn">
                                 <img src="./comment/img/举报icon@2x.png" alt="">
                                 举报评论
                            </div>
                            <p class="sanJiao"></p>
                       </div>
                   </div>
                </div>
        `
    },
    // 默认
    defaultComment() {
      this.ListParam.page = 1
      this.ListParam.sort = 'default'
      this.disabled = false
      this.commentList()
      this.sortStatus = 0
    },
    // 最新
    latestComment() {
      this.ListParam.sort = 'latest'
      this.ListParam.page = 1
      this.disabled = false
      this.commentList()
      this.sortStatus = 1
    },
    // 展开
    openComment(id) {
      $(`#textContent_${id}`).removeClass('commentContentHide')
      $(`#commSpread_${id}`).hide()
    },
  },
}
</script>

<style scoped lang='scss'>
@import url('./comment/css/comment.css');
</style>

<style>
.el-textarea__inner {
    width: 100%;
    border: unset !important;
    resize: none !important;
    caret-color: #ff4f00 !important;
}
#revertSmilingInput:focus {
    box-shadow: 0 0 0 1px #ff4f00 inset !important;

}
.el-textarea {
    position: relative;
    display: inline-block;
    width: 100%;
    vertical-align: bottom;
    font-size: 14px;
    resize: none !important;
}
.el-message-box__status.el-icon-warning{
    color: #ff4f00;
}
.el-message-box{
    width: 400px;
    min-height: 185px;
    background: #FFFFFF;
    border: unset;
    padding: 30px;
}
.el-message-box__header,
.el-message-box__content,
.el-message-box__btns{
    padding: 0;
}
.el-message-box__headerbtn{
    top: 0;
}
.el-message-box__content{
    margin-top: 14px;
}
.el-message-box__btns{
    margin-top: 37px;
}
.el-message-box__btns button:nth-child(1){
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #D8D8D8;
    color: #333333;
}
.el-message-box__btns button:nth-child(2){
    color: #FFF;
    background-color: #FF4F00;
    border-color: #FF4F00;
}
.el-pagination button{
    padding: 0 14px !important;
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li{
    border: 1px solid #CCCCCC;
    background-color:transparent;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
}
.el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: transparent;
    color: #FF4F00;
    border-color: #FF4F00;
    font-size: 14px;
    font-weight: 400;
}
/*分页*/
/* .orderListPaging{
    width: 100%;
    padding: 30px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.el-pagination button{
    padding: 0 14px !important;
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li{
    border: 1px solid #CCCCCC !important;
    background-color:transparent !important;
    font-size: 14px !important;
    font-family: PingFangSC-Regular, PingFang SC !important;
    font-weight: 400 !important;
}
.el-pagination.is-background .el-pager li:hover{
    color: #FF4F00 !important;
}

.el-pagination.is-background .btn-next:hover,
.el-pagination.is-background .btn-prev:hover {
    color: unset !important;

}

.el-pagination.is-background .btn-next.is-active, .el-pagination.is-background .btn-prev.is-active, .el-pagination.is-background .el-pager li.is-active{
    background-color: transparent !important;
    color: #FF4F00 !important;
    border-color: #FF4F00 !important;
    font-size: 14px;
    font-weight: 400;
} */
</style>
