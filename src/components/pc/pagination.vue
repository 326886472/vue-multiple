<template>
  <div class="paging">
    <div class="paging-item-total">
      共 {{ pagination.total }} 条
    </div>
    <div class="pre" :class="{ disabled: !hasPrev }" @click="goToPrevPage">
      上一页
    </div>
    <div v-for="i in pages" :key="i" :class="pageClass(i)" @click="changePage(i)">
      {{ i }}
    </div>
    <div class="next" :class="{ disabled: !hasNext }" @click="goToNextPage">
      下一页
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pagination: {
      type: Object,
      default: () => ({
        page: 0,
        total: 0,
        limit: 10,
      }),
    },
  },
  data() {
    return {
      currentPage: this.pagination.page,
    }
  },
  computed: {
    pages() {
      return Math.ceil(this.pagination.total / this.pagination.limit)
    },
    hasPrev() {
      return this.currentPage > 1
    },
    hasNext() {
      return this.currentPage < this.pages
    },
  },
  methods: {
    pageClass(page) {
      return {
        paging_item_active: this.currentPage === page,
        paging_item: true,
      }
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.pages) {
        this.currentPage = newPage
        this.$emit('current-change', this.currentPage) // 发出事件通知父组件当前页已更改
      }
    },
    goToPrevPage() {
      if (this.hasPrev) {
        this.changePage(this.currentPage - 1)
      }
    },
    goToNextPage() {
      if (this.hasNext) {
        this.changePage(this.currentPage + 1)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.paging {
  display: flex;
  justify-content: center;
  align-self: center;
  margin: 0 auto;
  padding: 20px 0;
  background: #FFFFFF;
  flex-flow: wrap;
  row-gap: 5px;

  .paging-item-total {
    line-height: 29px;
  }

  .paging_item {
    text-decoration: none;
    color: #333333;
    padding: 5px 10px;
    border: 1px solid #cccccc;
    font-size: 12px;
    margin: 0 5px;
    cursor: pointer;
  }

  .paging_item_active {
    color: #F4572A;
    border-color: #F4572A;
  }

  .paging_item:hover {
    color: #F4572A;
    border-color: #F4572A;
  }

  .pre,
  .next::hover {
    color: #F4572A;
    border-color: #F4572A;
  }

  .pre,
  .next {
    text-decoration: none;
    color: #333333;
    padding: 5px 10px;
    border: 1px solid #cccccc;
    font-size: 12px;
    margin: 0 5px;
    cursor: pointer;

  }

  .disabled {
    color: #dcdfe6 !important;
    border-color: #dcdfe6 !important;
  }

  .disabled:hover {
    color: #dcdfe6;
    cursor: not-allowed;
    border-color: #dcdfe6;
  }
}
</style>
