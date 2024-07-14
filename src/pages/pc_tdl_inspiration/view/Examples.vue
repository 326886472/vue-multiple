<template>
  <div class="examples">
    <div class="btn_box">
      <div v-for="(item, index) in types" :key="index" class="btn_item" :class="{ active: type === index }" @click="type = index, desc = Examplesjson[index]">
        {{ item.name }}
      </div>
    </div>

    <div v-for="(item, index) in desc" :key="index" class="content">
      <div class="top">
        <div class="l">
          <div class="tag2">
            工作计划{{ index + 1 }}
          </div>
        </div>
        <div class="r">
          <h1 class="title">
            {{ item.content }}
          </h1>
          <p class="time">
            {{ item.time }}
          </p>
        </div>
      </div>
      <div v-for="(item2, index2) in item.actives" :key="index2" class="active">
        <div class="tag">
          实施行动{{ index2 + 1 }}
        </div>
        <p class="content">
          {{ item2.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Examplesjson from '../examples.json'

export default {
  data() {
    return {
      type: 0,
      types: [
        {
          type: 0,
          name: '销售岗',
          desc: '',
        },
        {
          type: 1,
          name: '市场岗',
          desc: '',
        },
        {
          type: 2,
          name: '人力岗',
          desc: '',
        },

      ],
      Examplesjson,
      desc: [],
    }
  },
  created() {
    this.desc = this.Examplesjson[0]
  },
}
</script>

<style lang="scss" scoped>
@mixin flex-row() {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
}

* {
  margin: 0;
  padding: 0;
}

.examples {
  padding: 14px 51px;
  background: #fff;
  .btn_box {
    @include flex-row();
    padding: 0 26px;
      .btn_item {
        width: 62px;
        height: 26px;
        background: #F9F9F9;
        border-radius: 13px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 26px;
        text-align: center;
        font-style: normal;
        margin-right: 12px;
        cursor: pointer;
      }
      .btn_item.active {
        background: #FF4F00;
        color: #fff;
      }
    }

    .content {
      width: 100%;
      background: #F9F9F9;
      border-radius: 10px;
      padding: 11px 26px;
      box-sizing: border-box;
      margin-top: 18px;
      .top {
        height: 57px;
        border-bottom: 1px dashed #E4E4E4;;
        @include flex-row();
        align-items: start;
        margin-bottom: 10px;
      }
      .tag, .tag2 {
        width: 91px;
        height: 24px;
        background: #FFF5F1;
        border-radius: 18px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #FF4F00;
        line-height: 24px;
        text-align: center;
        font-style: normal;
      }
      .tag2 {
        height: 35px;
        line-height: 35px;

      }

      .r {
        margin-left: 5px;
        @include flex-row();
        flex-direction: column;
        align-items: start;
        position: relative;

        h1 {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          font-size: 14px;
          color: #333333;
          line-height: 35px;
        }
        .time {
          position: absolute;
          font-weight: 400;
          font-size: 12px;
          color: #999999;
          line-height: 17px;
          left: 0;
          bottom: -13px;
        }
      }
      .active {
        // height: 53px;
        @include flex-row();
        margin-bottom: 9px;
      }
      .content {
        margin: 0;
        padding: 0;
        margin-left: 5px;
        font-weight: 400;
        font-size: 12px;
        color: #666666;
      }

    }

  }
</style>
