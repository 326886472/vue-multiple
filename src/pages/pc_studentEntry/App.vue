<template>
  <div class="studentEntryList">
    <div class="content">
      <div class="title">
        <img src="./img/竖杠.png" alt="">
        <h2>训练营列表</h2>
      </div>
      <el-table v-loading="loading" class="table" :data="list">
        <el-table-column align="center" label="状态">
          <template #default="scope">
            {{ statusMap[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="标题" />
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button
              type="primary" size="mini"
              style="background-color: #ff4f00;border:none;"
              @click="toEntryDetail(scope.row)"
            >
              录入学员
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <el-pagination
        style="margin-top:100px" :current-page="pagination.page" :page-sizes="pagination.sizes"
        :page-size="pagination.limit" layout="prev, pager, next" :total="pagination.total" background
        @size-change="paginationSizeChange" @current-change="paginationCurrentChange"
      /> -->
      <pagination :pagination="pagination" @current-change="paginationCurrentChange" />
    </div>

    <!-- 详情 -->
    <el-drawer v-model="drawer" :title="detail.title" :show-close="false" size="80%">
      <student-entry-list ref="studentEntryList" :detail-id="detail.id" />
    </el-drawer>
  </div>
</template>

<script>
import { deliveryList } from '@/api/studentEntry'
import Pagination from '@/components/pc/pagination.vue'
import StudentEntryList from './view/studentEntryDetail.vue'

export default {
  components: {
    StudentEntryList,
    Pagination,
  },
  data() {
    return {
      list: [],
      drawer: false,
      detail: {
        id: '',
        title: '',
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
      statusOptions: [
        { label: '-', value: 0 },
        { label: '开营中', value: 1 },
        { label: '未开营', value: 2 },
        { label: '已结营', value: 3 },
      ],
      loading: false,
      dialogVisible: false,
      companyStudent: {
        customer_id: '',
        sub_order_id: '',
        delivery_id: '',
        name: '',
        phone: '',
        position: '',
        order_sn: '',
        valid: false,
        state_code: '86',
      },
    }
  },
  computed: {
    statusMap() {
      const obj = {}
      this.statusOptions.forEach((item) => {
        obj[item.value] = item.label
      })
      return obj
    },

  },
  created() {
    this.getListData()
  },
  methods: {
    resetDialog() {
      this.companyStudent = {
        customer_id: '',
        sub_order_id: '',
        delivery_id: '',
        name: '',
        phone: '',
        position: '',
        state_code: '86',
      }
      this.sub_order_list = []
      this.available_num = 0
      this.$refs.companyStudent.resetFields()
    },
    async toEntryDetail(row) {
      this.detail = {
        id: row.id,
        title: row.title,
      }
      this.drawer = true
      this.$nextTick(() => {
        this.$refs.studentEntryList.open()
      })
    },

    paginationSizeChange(val) {
      this.pagination.limit = val
      this.getListData()
    },
    paginationCurrentChange(val) {
      this.pagination.page = val
      this.getListData()
    },
    async getListData() {
      this.loading = true
      const data = await deliveryList({ page: this.pagination.page, limit: this.pagination.limit })
      if (data) {
        this.pagination.total = data.total
        this.list = data.list
        this.loading = false
      } else {
        this.pagination.total = 0
        this.list = []
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.studentEntryList {

  .breadcrumb {
    background: rgb(246, 246, 246);

    .breadcrumbOrange {
      :deep {
          .el-breadcrumb__inner,
        .el-breadcrumb__separator {
          color: orange;
        }
        .el-breadcrumb__inner:hover {
            cursor: pointer;
          }
      }
    }
  }
    .title {
      height: 60px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ebebeb;
          margin: 0 20px;

       h2{
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          margin: 0 0 0 8px;
      }
      img{
          width: 4px;
          height: 18px;
}
    }
    .table {
    }

}
</style>
