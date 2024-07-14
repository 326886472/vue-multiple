<template>
  <div class="content">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px" style="text-align: left">
      <el-divider content-position="center">
        学员信息
      </el-divider>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" :disabled="editMode" size="small" clearable maxlength="11" show-word-limit style="margin-top: 4px;">
          <template #prepend>
            <el-select v-model="form.state_code" :disabled="editMode" size="small" filterable placeholder="请选择" style="width: 115px">
              <el-option-group
                v-for="(group, index) in state_code_list"
                :key="index"
                :label="group.label"
              >
                <el-option
                  v-for="(item, index) in group.options"
                  :key="index"
                  :label="`${item.code}`"
                  :value="item.code"
                >
                  <span>({{ item.code }})</span>
                  <span>{{ item.country_name_zh }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="学员姓名" prop="name" class="form-item">
        <el-input v-model="form.name" size="small" placeholder="请输入学员姓名" maxlength="10" show-word-limit clearable style="" />
      </el-form-item>

      <el-form-item label="职位" prop="position" class="form-item">
        <el-input v-model="form.position" size="small" placeholder="请输入" clearable style="" />
      </el-form-item>

      <el-form-item label="企业/团队负责人" prop="is_kp" class="form-item">
        <el-select v-model="form.is_kp" size="small" filterable clearable placeholder="请选择" style="">
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-alert title="选择【是】学员需完成企业调研问卷" type="warning" :closable="false" />
    </el-form>
    <el-form-item>
      <el-button size="small" type="primary" style="margin: 20px auto 0;background-color: #ff4f00;border:none;" @click="confirm">
        {{ editMode ? '保存' : '确定' }}
      </el-button>
    </el-form-item>
  </div>
</template>

<script>
import { ApiEnums, addStudent, getCountryCodeList, getNormalCountryCodeList } from '@/api/studentEntry'

/**
 * 添加从纷享销客的订单过来的学员
 */
const EmojiRanges = [
  '\uD83C[\uDF00-\uDFFF]',
  '\uD83D[\uDC00-\uDE4F]',
  '\uD83D[\uDE80-\uDEFF]',
]
export default {
  name: 'AddPlus',
  components: {
  },
  props: {
    deliveryId: {
      type: Number,
    },
    deliveryStatus: {
      type: Number,
    },
    rowData: {
      type: Object,
    },
  },
  data() {
    return {
      title: '添加学员',
      visible: false,
      state_code_list: [

      ],
      normalCode: ['86', '852', '853', '886'],
      goods_name: '',
      customer_name: '',
      chooseVisible: false,
      form: {
        id: null,
        fx_order_id: null,
        order_id: null,
        goods_id: null,
        name: '',
        state_code: '86',
        phone: '',
        position: '',
        id_number: '',
        is_confirm: 1,
        is_kp: '',
        status: '',
        class_id: '',
        group_id: '',
        remark: '',
        study_status: 1,
      },
      rules: {
        order_id: [
          {
            required: true,
            message: '请选择订单',
            trigger: 'blur',
          },
          {
            required: true,
            message: '请选择订单',
            trigger: 'change',
          },
        ],
        name: [
          { required: true, message: '请输入学员名称', trigger: 'blur' },
          { required: true, message: '请输入学员名称', trigger: 'change' },
          { validator: (rule, val, cb) => {
            val = val.replace(new RegExp(EmojiRanges.join('|'), 'g'), '')
            val = val.trim()
            if (val.includes('+') || val.includes('/') || val.includes('\\')) {
              return cb(new Error('名称中不可包含+/\\特殊字符'))
            }
            this.form.name = val
            return cb()
          }, trigger: 'change' },
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'change',
          },
          {
            validator: (rule, val, cb) => {
              val = val.trim()
              if (this.form.state_code === '86' && !this.$globalFunction.isMobile(val)) {
                return cb(new Error('请输入正确的手机号'))
              } else if (!/^\d{1,11}$/.test(val)) { // 国外手机号
                return cb(new Error('国外号码为1-11数字'))
              }
              return cb()
            },
          },
        ],
        position: [{ required: true, message: '请输入职位' }],
        is_confirm: [{ required: true, message: '请选择' }],
        is_kp: [{ required: true, message: '请选择' }],
        id_number: [{ required: true, message: '请输入' }],
        study_status: [{ required: true, message: '请选择' }],
      },
      classOptions: [],
      groupOptions: [],
      editMode: false,
      classInfo: {
        assist: '',
        learned_history: '',
        delivery: '',
      },
      companyInfo: {},
      loading: false,
      statusMap: {
        0: '未知',
        1: '正常',
        2: '延期',
      },
      class_id: '',
      type: '',
    }
  },
  computed: {

  },
  watch: {
    // 'form.class_id': function (val) {
    //   // this.GetGroupList(val)
    //   if (val && val !== this.class_id) {
    //     this.form.group_id = ''
    //   }
    // },
  },
  activated() {
    if (localStorage.getItem('delivery_type') === '1') {
      this.type = 1
      this.rules.id_number = [{ required: false, message: '请输入' }]
    } else {
      this.type = 2
      this.rules.id_number = [{ required: true, message: '请输入' }]
    }
  },
  beforeUpdate() {
  },
  methods: {
    async GetStateCodeList() {
      this.loading = true
      const res = await getNormalCountryCodeList()

      this.state_code_list.push({
        label: '常用区号',
        options: [...res.list],
      })
      const res1 = await getCountryCodeList()

      if (res1 && res1.list) {
        res1.list = res1.list.filter(v => !this.normalCode.includes(v.code))
        this.state_code_list.push({
          label: '区号',
          options: [...res1.list],
        })
      }
      this.loading = false
    },
    reset() {
      this.goods_name = ''
      this.customer_name = ''
      this.chooseVisible = false
      this.form = {
        id: null,
        fx_order_id: null,
        order_id: null,
        goods_id: null,
        name: '',
        state_code: '86',
        phone: '',
        position: '',
        id_number: '',
        is_confirm: 1,
        is_kp: '',
        remark: '',
        study_status: 1,
      }
      this.state_code_list = []
      this.$refs.form.resetFields()
    },
    beforeClose() {
      this.reset()
      this.visible = false
    },
    open(row) {
      this.visible = true
      this.GetStateCodeList()

      if (row?.id) {
        const { name, phone, state_code, position, is_kp } = row
        this.editMode = true
        this.form = {
          ...this.form,
          name,
          phone,
          state_code,
          position,
          is_kp,
        }
      }
      // if (row.id) {

      //   this.GetClassList()
      //   this.GetGroupList()
      //   this.GetStudentInfo(row.id)
      //   this.editMode = true
      //   this.form.id = row.id
      // } else {
      //   this.editMode = false
      // }
    },
    confirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return null
        }

        const param = { ...this.form }
        param.delivery_id = this.deliveryId

        const { name, phone, state_code, position, is_kp } = this.form
        let res
        if (this.editMode) { /* empty */ } else {
          res = await addStudent({
            delivery_id: this.deliveryId,
            name,
            phone,
            position,
            state_code,
            is_kp,
          })
        }

        if (res && res.result) {
          this.$message.success('操作成功')

          this.beforeClose()
          this.$emit('on-success')
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.choose_wrap >>> .el-drawer__body {
  overflow: auto;
}
.content {
  :deep(.el-select__suffix) {
    .el-input__icon {
      display: none
    }
  }
}
</style>
