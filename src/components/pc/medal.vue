<template>
  <div class="medalBox">
    <div class="medalList">
      <img v-for="(item, index) in medalList" :key="index" :src="item.thumb_url" alt="" class="medalImg" @click.stop="showDialog(item)">
    </div>
  </div>
  <el-dialog
    id="medalDialog"
    v-model="dialogVisible"
    width="588"
    :before-close="handleClose"
    class="medal-dialog"
  >
    <template #header>
      <div class="title">
        {{ detail.name }}
      </div>
    </template>
    <div class="visibleContent">
      <img :src="detail?.image_url" alt="" class="img">
      <div class="floor">
        <i class="left" />
        <div class="text">
          {{ detail?.slogan }}
        </div>
        <i class="right" />
      </div>
      <div v-show="detail?.is_self" class="time">
        {{ formateTime(detail) }}
      </div>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import * as api from '@/api/tdl'

export default {
  name: 'Medal',
  props: {
    medalList: {
      type: Array,
      default: () => [],
    },
    uid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogVisible: false,
      detail: {},
      moment,
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        const html = document.documentElement
        const body = document.body

        if (val) {
          html.style.overflow = 'hidden'
          body.style.overflow = 'hidden'
          this.$nextTick(() => {
            listenerElHeightById('medalDialog')
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
  },
  created() {

  },
  mounted() {
  },
  methods: {
    async showDialog(item) {
      const res = await api.medalDetail({
        id: item.id,
        assoc_user_id: this.uid,
      })
      if (res && res.detail) {
        this.dialogVisible = true

        this.detail = res.detail
      } else {
        this.detail = {}
      }
    },
    formateTime(item) {
      return `${moment(item.award_time * 1000).format('YYYY/MM/DD')} 获得`
    },
  },
}
</script>

<style lang="scss" scoped>
.medalBox {
    .medalList {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 3px;
        margin-left:3px;
        max-width: 250px;
        overflow: hidden;
        .medalImg {
            width: 81px;
            height: 18px;
            cursor: pointer;
        }
    }
}

.medal-dialog {
    background: rgba(28,28,28,0.85);
    border-radius: 6px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    .title {
        padding: 0;
        text-align: center;
        font-size: 18px;
        color: #FFFFFF;
    }

}
.visibleContent {
    @include flex-row();
    flex-direction: column;
    .img {
        margin-top: 36px;
    }
    .floor {
        @include flex-row();
        justify-content: space-between;
        margin: 0 auto;
        margin-top: 16px;
        .left, .right {
            display: inline-block;
            width: 20px;
            height: 42px;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-image: url('@/assets/img/麦穗右备份 3@2x.png');
        }
        .left {
            background-image: url('@/assets/img/麦穗左备份 2@2x.png');
        }
        .text {
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 14px;
            color: #FFD19B;
            line-height: 20px;
            text-align: center;
            font-style: normal;
        }

    }
    .time {
        margin: 6px auto 15px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #ccc;
        line-height: 20px;
        text-align: center;
        font-style: normal;
    }
}
</style>

<style>
.el-dialog__header {
    padding: 0 !important;
}

.medal-dialog {
    background: rgba(28,28,28,0.85) !important;
    border-radius: 6px !important;
    font-family: PingFangSC, PingFang SC !important;
    font-weight: 600 !important;
}
</style>
