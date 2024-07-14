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
    <i class="line" />
    <span>发现</span>
    <div class="sort" @click="pageInfo.show_type_select = !pageInfo.show_type_select">
      {{ sortList[pageInfo.sort].name }}
      <i />
      <div v-show="pageInfo.show_type_select" class="sort_list">
        <div v-for="(item, index) in sortList" :key="index" class="sort_list_item" :class="{ active: pageInfo.sort === index }" @click.stop="handelSort(index)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
  <div ref="container" v-loading="loading" class="container">
    <div
      v-if="list.length" ref="list"
      v-infinite-scroll="load"
      class="list"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="scrollDistance"
    >
      <card v-for="(item, index) in list" :key="index" :plan="item" />
      <!-- <div v-for="(item, index) in list" :key="index" class="item" :style="{ height: `${item.height}px`, gridRowEnd: `span ${item.height}` }">
        {{ index }}
      </div> -->
    </div>
    <div v-else class="list_empty">
      <div class="emptyLogo" />
      <div class="text">
        暂无内容
      </div>
    </div>
    <p v-if="loadMore" class="loadMore">
      加载中...
    </p>
    <p v-if="noMore" class="noMore">
      没有更多了
    </p>
    <div ref="toTop" class="toTop" @click="toTop">
      <img src="../img/fanghuidingbu@2x.png" alt="" @click="toTop">
    </div>
  </div>
</template>

<script>
import * as api from '@/api/tdl'

import Card from './Card.vue'

export default {
  name: 'Home',
  components: {
    Card,
  },
  data() {
    return {
      name: 'home',
      sortList: [
        {
          name: '默认排序',
          type: 'latest',
        },
        {
          name: '最热排序',
          type: 'hot',
        },
      ],
      list: [],
      loading: false,
      loadMore: false,
      noMore: false,
      disabled: false,
      total: 0,
      htmlHeight: 0,
      scrollDistance: 0,
      pageInfo: {
        sort: 0,
        page: 1,
        limit: 10,
      },
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // 监听父页面的消息
    // window.addEventListener('message', (event) => {
    //   const parentOffsetTop = event.data.scrollTop
    //   const html = document.documentElement

    //   if (parentOffsetTop) {
    //     html.scrollTop = parentOffsetTop
    //     clog(html, html.scrollTop, html.offsetHeight)
    //   }
    // })
    window.addEventListener('scroll', () => {
      const html = document.documentElement
      this.scrollDistance = html.scrollTop
      const toTop = this.$refs.toTop
      if (html.scrollTop > 800 && toTop) {
        this.$refs.toTop.style.display = 'flex'
      } else {
        this.$refs.toTop.style.display = 'none'
      }
    })
  },
  methods: {

    async handelSort(index) {
      const flag = this.pageInfo.sort !== index
      this.pageInfo.sort = index
      this.pageInfo.show_type_select = false
      if (flag) {
        this.loadMore = false
        this.noMore = false
        this.disabled = false
        this.total = 0
        this.pageInfo.page = 1
        await this.getList('tab')
      }
    },
    async getList(type = 'push') {
      this.loading = true
      const res = await api.tdlRecommend({
        ...this.pageInfo,
        sort_method: this.sortList[this.pageInfo.sort].type,
      })
      this.loading = false

      if (res && res.list) {
        this.total = res.total
        if (type === 'push') {
          this.list.push(...res.list)
          this.list.forEach((item) => {
            item.height = Math.floor(Math.random() * 600 + 100)
          })
        } else {
          this.list = []
          this.list = res.list
        }
      }
    },
    async load() {
      this.loadMore = true
      this.pageInfo.page += 1
      await this.getList()
      this.loadMore = false
      if (this.total === this.list.length) {
        this.noMore = true
        this.disabled = true
      }
    },
    toTop() {
      const html = document.documentElement
      const topInterval = setInterval(() => {
        if (html.scrollTop > 0) {
          html.scrollTop -= 50
        } else {
          clearInterval(topInterval)
        }
      }, 10)
    },
  },
}
</script>

<style lang="scss" scoped>
* {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-family: PingFangSC, PingFang SC;
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
        position: relative;

        .line {
            display: inline-block;
            width: 4px;
            height: 18px;
            background-image: url(../img/矩形备份.png);
            vertical-align: -1.5px;
            margin-left: 15px;
        }
        span {
            margin-left: 6px;
        }
        .sort {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          font-weight: 500;
          font-size: 12px;
          color: #333333;
          cursor: pointer;
          margin-right: 25px;
          i {
            margin-left: 4px;
            width: 10px;
            height: 6px;
            display: inline-block;
            background-image: url('../img/bottom2.png');
          }
          .sort_list {
            position: absolute;
            bottom: -47px;
            left: -10px;
            width: 80px;
            height: 57px;
            background: #FBFBFB;
            border-radius: 4px;
            border: 1px solid #E4E4E4;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999;
            .sort_list_item {
              width: 100%;
              height: 50%;
              line-height: 28px;
              text-align: center;
            }
            .sort_list_item.active {
              color: #FF4F00;
            }
          }
        }
    }
}

.container {
  width: 100%;
  background: #fff;
  padding: 12px 0 40px 0;
  position: relative;

  .list {
    width: 95%;
    display: grid;
    grid-template-columns: 33% 33% 33%;
    column-gap: 0.5%;
    @media screen and (min-width: 1788px) and (max-width: 2200px){
      grid-template-columns: 24% 24% 24% 24%;
      column-gap: 1%;
    }

     @media screen and (min-width: 2200px) {
      grid-template-columns: 19% 19% 19% 19% 19%;
      column-gap: 1%;
    }

    grid-auto-rows: minmax(1px, 1px);

    margin: 0 auto;
    .item {
      background: #FAFAFA;
      border-radius: 10px;
      margin-bottom: 12px;
      @include flex-row();
      flex-direction: column;
      width: 100%;
      padding: 11px;
      box-sizing: border-box;
    }

  }
  .list_empty {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 750px;
    .emptyLogo {
      width: 70px;
      height: 74px;
      background-image: url('../img/wuicon@2x.png');
      margin-top: 76px;
    }
    .text {
      margin-top: 23px;
      font-weight: 400;
      font-size: 16px;
      color: #999999;
      line-height: 22px;
    }
  }
  .add {
    position: fixed;
    right: 100px;
    top: 300px;
  }
  .noMore, .loadMore {
    text-align: center;
  }
}
.toTop {
  width: 48px;
  height: 48px;
  background: #FFFFFF;
  box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.08);
  border-radius: 50%;
  position: sticky;
  right: 7%;
  bottom: 34px;
  z-index: 999;
  float: right;
  transform: translateX(81px);
  cursor: pointer;
  @include flex-row();
  justify-content: center;
  display: none;
  img {
    width: 20px;
    height: 20px;
  }

}
</style>
