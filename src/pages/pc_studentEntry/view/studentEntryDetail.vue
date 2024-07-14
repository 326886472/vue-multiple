<!-- eslint-disable vue/no-use-computed-property-like-method -->
<!--
 * @Author: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @Date: 2024-03-14 15:55:39
 * @LastEditors: zqy@cyjiaomu.com zqy@cyjiaomu.com
 * @LastEditTime: 2024-04-15 11:24:25
 * @FilePath: /mobile-server/src/pages/studentEntry/router/studentEntryDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="escList" class="detail">
    <!-- 功能 -->
    <el-form :model="searchModel" inline style="text-align: left;" class="mini_margin">
      <el-form-item label="学员姓名">
        <el-input v-model="searchModel.name" placeholder="学员姓名" size="small" clearable @change="searchNameChange" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchModel.mobile" placeholder="联系方式" size="small" clearable @change="searchMobileChange" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn" size="mini" @click="getList">
          搜索
        </el-button>
        <el-button size="mini" @click="reset">
          重置
        </el-button>
        <el-button type="primary" class="btn" size="mini" @click="openAddVisible">
          新增
        </el-button>
        <el-button type="primary" class="btn" size="mini" @click="importStudent">
          导入
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="学员姓名" />
      <el-table-column prop="phone" label="手机号" width="180" />
      <el-table-column prop="position" label="职位" />
      <el-table-column label="企业/团队负责人">
        <template #default="scope">
          {{ getIsChargeText(scope.row.is_kp) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-popconfirm
            width="220" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
            icon-color="#626AEF" :title="deleteTitle(scope.row)" @confirm="deleteStudent(scope.row)"
          >
            <template #reference>
              <el-button type="primary" size="mini" class="btn">
                删除
              </el-button>
            </template>
          </el-popconfirm>
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

    <!-- 新增/编辑 -->
    <el-dialog
      v-model="addVisible" :title="title" :before-close="beforeClose" :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <add-student ref="addStudentRef" :row-data="selectData" :delivery-id="detailId" @on-success="closeAddVisible" />
    </el-dialog>

    <!-- 导入 -->
    <import-data
      ref="import" :template-file-url="template_url" :api="import_api" :param="param" :cols="cols"
      @reload="GetDiscountUserList"
    />
  </div>
</template>

<script>
import { removeStudent, studentList } from '@/api/studentEntry.js'
import ImportData from './ImportData.vue'
import AddStudent from './addStudent.vue'

export default {
  components: {
    AddStudent,
    ImportData,
  },
  props: ['detailId'],
  data() {
    return {
      searchModel: {
        name: '',
        mobile: '',
      },
      template_url: `./discount_user.xlsx`,
      import_api: `/v9/student/import?delivery_id=${this.detailId}`,
      param: {},
      cols: [
        { label: '姓名' },
        { label: '区号' },
        { label: '手机号' },
        { label: '职务' },
        { label: '企业/团队负责人' },
        { label: '原因' },
      ],
      pagination: {
        page: 1,
        pages: 0,
        limit: 10,
        sizes: [10, 20, 50, 100],
        total: 0,
      },
      tableData: [
        // {
        //   name: 'Tom',
        //   mobile: '1888888888',
        //   position: '老板',
        //   isCharge: true,
        //   id: 1,
        // },
      ],
      selectData: {},
      loading: false,
      addVisible: false,
    }
  },

  computed: {

  },
  created() {
    this.getList()
  },

  methods: {
    open() {
      this.getList()

      // 获取需要监听高度的元素
      const element = document.getElementById('escList')

      if (element === null) {
        console.error('指定ID的元素未找到')
      } else {
        // 创建Resize Observer实例
        const observer = new ResizeObserver((entries) => {
          for (const entry of entries) {
            // 当元素高度发生变化时，执行回调函数
            const { height } = entry.contentRect
            if (height > 0) {
              // 获取父窗口
              window.parent.postMessage({ height: height + 100 }, '*')
              console.log('元素高度发生变化：', height)
            }
          }
        })
        observer.observe(element)
      }
    },
    deleteTitle(row) {
      return `确定要删除学员${row.name}?`
    },
    async deleteStudent(row) { // 删除学员
      const param = { id: row.id }
      const res = await removeStudent(param)
      if (res && res.result) {
        this.$message.success('操作成功')
        await this.getList()
      }
    },
    closeAddVisible() {
      this.addVisible = false
      this.getList()
    },
    importStudent() { // 导入
      this.import_api = `/v9/student/import?delivery_id=${this.detailId}`
      this.$nextTick(() => {
        this.$refs.import.open()
      })
    },
    openAddVisible(row) {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.addStudentRef.open(row)
      })
    },
    async GetDiscountUserList() {
      this.getList()
    },
    reset() {
      this.searchModel = {
        name: '',
        mobile: '',
      }
    },
    editStudent(row) {
      this.selectData = row
    },
    resetList() {

    },
    async getList() {
      this.loading = true

      const res = await studentList({
        delivery_id: this.detailId,
        name: this.searchModel.name,
        phone: this.searchModel.mobile,
        page: this.pagination.page,
        limit: this.pagination.limit,
      })

      const { list, total } = res

      if (res) {
        this.tableData = list
        this.pagination.total = total
      } else {
        this.tableData = []
        this.pagination.total = 0
      }

      this.loading = false
    },
    searchNameChange(val) {
      this.searchModel.name = val
    },
    searchMobileChange(val) {
      this.searchModel.mobile = val
    },
    doSearch() {
      console.log(this.searchModel)
    },
    paginationSizeChange(val) {
      this.pagination.limit = val
      this.getList()
    },
    paginationCurrentChange(val) {
      this.pagination.page = val
      this.getList()
    },
    getIsChargeText(isCharge) {
      return isCharge ? '是' : '否'
    },
  },

}
</script>

<style lang="scss" scoped>
.detail {
  .btn {
    background-color: #ff4f00;
    border: none;
    color: #fff;
  }

}
</style>

<style>
.el-popconfirm .el-button--primary {
  /* 修改按钮样式 */
  background-color: #ff4f00;
  border: none;
  color: #fff;
}
</style>
