<template>
  <div class="guide">
    <h1>如何写出好的工作计划？</h1>
    <div class="box">
      <div class="item">
        <h2>1  具体清晰，要关联阶段目标</h2>
        <p>
          <i class="yes" />
          <span>
            完成产品原型设计，与团队讨论并确定产品方向
          </span>
        </p>
        <p>
          <i class="no" />
          <span>
            改进产品
          </span>
        </p>
      </div>

      <div class="item">
        <h2>2  设定优先级</h2>
        <p>
          <i class="yes" />
          <span>
            重要任务：优先处理紧急的客户反馈，随后跟进长期项目进展
          </span>
        </p>
        <p>
          <i class="no" />
          <span>
            尽快写完竞品分析报告
          </span>
        </p>
      </div>
    </div>

    <h1>如何写出好的实施行动？</h1>
    <div class="box">
      <div class="item">
        <h2>1 详细可执行，能支持计划完成</h2>
        <p>
          <i class="yes" />
          <span>
            查阅相关文档，整理出客户需求清单，并与团队成员逐一核对确认
          </span>
        </p>
        <p>
          <i class="no" />
          <span>
            看文档，跟同事对对需求
          </span>
        </p>
      </div>

      <div class="item">
        <h2>2 可衡量进展</h2>
        <p>
          <i class="yes" />
          <span>
            完成至少5个客户需求的整理，并得到至少3位团队成员的确认
          </span>
        </p>
        <p>
          <i class="no" />
          <span>
            整理一些客户需求，跟同事确认
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
    font-weight: 400;
    font-size: 18px;
    color: #333333;
    font-style: normal;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
p,h2,h1 {
    margin: 0;
}
.guide {
    background: #fff;
    padding-top: 31px;
    padding-left: 51px;
    padding-bottom: 128px;
    .box {
        width: 90%;
        background: #F9F9F9;
        border-radius: 10px;
        margin-bottom: 30px;
        padding: 11px 26px;

    }
    .item {
        margin-bottom: 20px;
        p {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .yes, .no {
            display: inline-block;
            width: 20px;
            height: 20px;
            background-image: url(../img/对@2x.png);
            margin-right: 6px;
        }
        .no {
            background-image: url(../img/错@2x.png);

        }
    }
    h1 {
        margin-left: 26px;
        margin-bottom: 9px;
    }
    h2 {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 6px;

    }
    span {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #666666;
    }

}
</style>
