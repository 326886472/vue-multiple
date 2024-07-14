<template>
  <div class="content">
    <el-dialog v-model="visible1" center :close-on-click-modal="false" :show-close="closable" :close-on-press-escape="false" :title="actionMap[action]" width="600px" :before-close="beforeClose" z-index="2010">
      <div v-loading="loading" element-loading-text="正在处理数据中，请稍后">
        <div v-if="action === 'pending'" class="waiting">
          <el-upload
            :drag="fileList.length === 0"
            :action="api"
            :accept="acceptType"
            :file-list="fileList"
            :on-change="handleChange"
            :auto-upload="false"
            :show-file-list="true"
            :multiple="false"
            :limit="1"
            :on-remove="handleRemove"
          >
            <div v-if="fileList.length === 0">
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip">
                只能上传 xlsx 文件
              </div>
            </div>
          </el-upload>

          <div v-if="fileList.length === 0" slot="tip" class="el-upload__tip">
            没有导入模版？
            <el-link :download="templateFileName" :href="templateFileUrl" type="primary" target="_blank" style="vertical-align: baseline;font-size: 12px;">
              点此下载
            </el-link>
          </div>
        </div>

        <div v-if="action === 'uploading' || action === 'uploaded'" class="process_list">
          <div v-for="(item, index) in taskList" :key="index" class="upload_item">
            <span class="name">{{ item.name }}</span>
            <el-tag v-if="item.status === 'pending'" type="info" style="margin-left: 10px" size="mini">
              等待中
            </el-tag>
            <el-tag v-if="item.status === 'uploading'" type="primary" style="margin-left: 10px" size="mini">
              <i
                class="el-icon-loading"
              />上传中
            </el-tag>
            <el-tag v-if="item.status === 'done'" type="success" style="margin-left: 10px" size="mini">
              上传完毕
            </el-tag>
            <el-tag v-if="item.status === 'error'" type="danger" style="margin-left: 10px" size="mini">
              上传失败
            </el-tag>
            <el-progress :percentage="item.percentage" />
            <span class="percent-info">({{ item.point }}/{{ item.size }})</span>
          </div>
        </div>

        <div v-if="action === 'importing'" class="process_list">
          <div v-if="importResult.total === 0">
            <i class="el-icon-loading" /> 计算中，请稍后...
          </div>
          <el-progress :percentage="importResult.percentage || 0" />
          <span class="percent-info">{{ importResult.process_count }}/{{ importResult.total }}</span>
        </div>

        <div v-if="action === 'imported'">
          <el-card shadow="hover">
            <div class="import_result">
              <span>导入总数:({{ importResult.total || 0 }})</span>
            </div>
            <div class="import_result">
              <span>成功数量:({{ importResult.success || 0 }})</span>
            </div>
            <div class="import_result">
              <span>失败数量: ({{ importResult.failed || 0 }})</span>
              <el-link v-if="importResult.failed" type="danger" @click="showFailed">
                查看原因
              </el-link>
            </div>
            <div class="import_result">
              <span>跳过数量: ({{ importResult.jump || 0 }})</span>
              <el-link v-if="importResult.jump" type="warning" @click="showJump">
                查看原因
              </el-link>
            </div>
          </el-card>
        </div>

        <div slot="footer" style="text-align: center">
          <el-button v-if="action === 'pending' && fileList.length" size="small" type="primary" @click="submitUpload">
            上传文件
          </el-button>
          <el-button v-if="action === 'uploaded'" size="small" type="primary" @click="doImport">
            开始导入
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="subVisible"
      z-index="2011"
      :title="subTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      width="60%"
    >
      <el-table border :data="subData" height="500">
        <el-table-column v-for="(item, index) in cols" :key="index" align="center" :label="item.label">
          <template #default="scope">
            {{ scope.row.data[index] || '' }}
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="small" style="margin-top: 20px;" @click="exportData">
        导出
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { importStudent } from '@/api/studentEntry'
import { getToken } from '@/utils/auth'

export default {
  name: 'ImportData',
  props: {
    templateFileUrl: {
      type: String,
    },
    templateFileName: {
      type: String,
      default() {
        return 'template.xlsx'
      },
    },
    api: {
      type: String,
    },
    param: {
      type: Object,
      default() {
        return {}
      },
    },
    cols: { // 导入结果列
      type: Array,
      default() {
        return [
          { label: '手机号' },
          { label: '姓名' },

        ]
      },
    },
  },
  data() {
    return {
      loading: false,
      closable: true,
      acceptType: '.xlsx',
      visible1: false,
      action: 'pending', // pending uploading uploaded importing imported
      actionMap: {
        pending: '待上传',
        uploading: '上传中',
        uploaded: '上传完毕，待导入',
        importing: '导入中',
        imported: '导入完毕',
      },
      fileList: [],
      taskList: [],
      sharedSize: 200 * 1024,
      importResult: {
        percentage: 0,
        process_count: 0,
        total: 0,
      },
      sseClient: null,
      jumpItems: [],
      failedItems: [],
      subTitle: '',
      subData: [],
      subVisible: false,
    }
  },
  watch: {
    visible(val) {
      if (val === false) {
        this.$emit('reload')
      }
    },
  },
  methods: {
    exportData() { // 导出表格
      // 设置表头
      const headers = this.cols.map(v => v.label)
      // 将表头与数据一同转化为AOA（Array of Arrays）格式
      const data = Array.from([headers].concat((this.subData).map(v => [...Array.from(v.data)])))
      const aoaData = data
      // 创建工作表并设置表头样式
      const ws = XLSX.utils.aoa_to_sheet(aoaData, { header: headers })
      // 创建工作簿并添加工作表
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, this.subTitle)
      // 导出为Excel文件
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      FileSaver.saveAs(blob, 'exported_data.xlsx')
    },
    open() {
      this.visible1 = true
    },
    beforeClose() {
      this.action = 'pending'
      this.fileList = []
      this.closable = true
      this.visible1 = false
      this.taskList = []
      this.jumpItems = []
      this.failedItems = []
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    submitUpload() {
      this.closable = false

      this.taskList = []
      this.fileList.forEach((v) => {
        this.taskList.push({
          fid: this.$globalFunction.genFileIdentifyName(v.raw),
          status: 'pending',
          percent: 0,
          name: v.name,
          size: v.size,
          point: 0,
        })
      })
      this.action = 'uploading'

      this.doImport()
    },

    importFailed() {
      this.action = 'pending'
      this.visible1 = false
      this.fileList = []
      this.taskList = []
      this.closable = true
      this.loading = false
    },
    async doImport() {
      this.loading = true
      this.closable = false

      const task = this.fileList[0] // todo 由于目前只支持一个文件导入，所以先写死

      const token = getToken()
      const formDate = new FormData()
      formDate.append('file', task.raw)
      formDate.append('token', token)
      try {
        const reqUrl = await importStudent(this.api, formDate, { timeout: 0 })

        if (reqUrl) {
          const msg = reqUrl

          // 跳过条数
          if (msg?.jump_list.length) {
            msg.jump_list.map((val) => {
              this.jumpItems.push({ data: val })
              return val
            })
          }
          // 失败
          if (msg?.fail_list.length) {
            msg.fail_list.map((val) => {
              this.failedItems.push({ data: val })
              return val
            })
          }

          // 导入完毕
          this.loading = false
          this.closable = true
          this.action = 'imported'
          this.importResult.jump = msg?.jump_list.length
          this.importResult.failed = msg?.fail_list.length
          this.importResult.success = msg?.success_total
          this.$emit('reload')
        } else {
          this.$message.error(`导入失败:${reqUrl.message}`)
          this.importFailed()
        }
      } catch (e) {
        this.$message.error(`导入失败，请检查文件格式及表头格式`)
        this.importFailed()
      }
    },
    showFailed() {
      if (this.failedItems.length === 0) {
        return null
      }
      this.subTitle = '失败数据'
      this.subData = this.failedItems
      this.subVisible = true
    },
    showJump() {
      if (this.jumpItems.length === 0) {
        return null
      }
      this.subTitle = '跳过数据'
      this.subData = this.jumpItems
      this.subVisible = true
    },
  },
}
</script>

  <style scoped>
  .content {
    text-align: center;
    padding: 10px;
  }

  .upload_item {
    margin-top: 10px;
    padding-bottom: 5px;
  }

  .upload_item:not(:last-child) {
    border-bottom: 1px solid #EBEEF5;
  }

  .name {
    font-size: 16px;
    color: #303133;
  }

  .percent-info {
    font-size: 14px;
    color: #909399;
  }
  .process_list {
    border: 1px solid #EBEEF5;
    max-height: 600px;
    padding: 10px;
    border-radius: 5px;
    overflow-y: scroll;
  }
  .waiting {
    width: 100%;
    height: 260px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>
