<template>
  <a-modal :width="900" :visible="visible" okText="保存" @cancel="handleCancel" :footer="null">
    <a-card :bordered="false" :body-style="{padding: '0px 20px 20px'}">
      <a-form :form="form">
        <a-row :gutter="48">
          <a-col :md="12" :sm="12">
            <a-form-item label="ID号" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <span>{{data.filamentId}}</span>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="12">
            <a-form-item label="入库人" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <span>{{data.nickName}}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="12" :sm="12">
            <a-form-item label="入库时间" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <span>{{data.createTime |date}}</span>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="重量" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <span v-decorator="['filamentWeight']">{{data.filamentWeight}}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="12" :sm="12">
            <a-form-item label="入库卷数" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <a-input-number
                v-decorator="['totalNumber', { rules: [{ required: true,}],initialValue:1 }]"
                :min="0"
                :max="999999"
                @change="totalNumberChange"
              />
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="12">
            <a-form-item label="颜色" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <a-input
                v-decorator="['filamentColor', { rules: [{ required: true, whitespace: true, message: '颜色不能为空！' }] }]"
                placeholder="请输入颜色"
                :maxlength="30"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="file-list">
        <a-table :columns="columns" :pagination="false" :dataSource="coilList" rowKey="index">
          <span slot="serial" slot-scope="text, record,index">
            <template>
              <span>{{index+1}}</span>
            </template>
          </span>
          <span slot="weight" slot-scope="text, record">
            <template>
              <a-input-number :min="0" :max="999999" v-model="record.weight" />
            </template>
          </span>
        </a-table>
      </div>
      <div class="text-center m-t-20">
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { filamentDetail, filamentStoreSave } from '@/api/manage'
import { STable } from '@/components'
let lodash = require('lodash')
export default {
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      title: '入库信息',
      totalNumber: 0,
      data: {},
      form: this.$form.createForm(this),

      //列表
      columns: [
        {
          title: '序号',
          dataIndex: 'serial',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '剩余重量(g)',
          dataIndex: 'weight',
          scopedSlots: { customRender: 'weight' }
        }
      ],
      coilList: [{ weight: 1000 }],
      selectedRowKeys: []
    }
  },
  created() {
    this.getInit()
  },

  methods: {
    totalNumberChange(value) {
      this.totalNumber = value
      this.coilList = []
      for (let i = 0; i < this.totalNumber; i++) {
        this.coilList.push({ weight: 1000 })
      }
    },
    add(record = null) {
      this.visible = true
    },
    // 初始化数据
    getInit() {
      filamentDetail({ filamentId: this.$route.query.id }).then(res => {
        console.log(res, 1)
        this.data = res.data
      })
    },
    // 入库卷数变化
    handleChange(value) {
      this.coilList = []
      let num = value
      for (let i = 0; i < num.length; i++) {
        this.coilList.push({ weight: 1000 })
      }
    },
    handleCancel() {
      this.visible = false
      this.form.resetFields()
    },
    handleOk() {
      this.visible = false
    },
    handleSubmit(e) {
      e.preventDefault()
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          values.filamentWeight = that.data.filamentWeight
          values.filamentId = that.data.filamentId
          //   values.volumeWeights = that.coilList
          let volumeWeights = []
          for (let i = 0; i < that.coilList.length; i++) {
            console.log(that.coilList[i].weight)
            volumeWeights.push(that.coilList[i].weight)
          }
          values.volumeWeights = volumeWeights
          console.log(values)
          filamentStoreSave(values).then(res => {
            if (res.state == 1) {
              that.$notification.success({ message: '入库成功' })
              that.$emit('ok')
              that.$emit('hide')
              that.visible = false
              that.form.resetFields()
            } else {
              that.$notification.error({ message: '入库失败' })
            }
          })
        }
      })
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    deleteInven(record) {}
  },
  // 过滤器
  filters: {}
}
</script>
<style lang="less" scoped>
.l-h-45 {
  line-height: 45px;
}
.file-list {
  margin-top: 20px;
  max-height: 320px;
  overflow: auto;
}
/deep/ .ant-form-item-label {
  text-align: left;
}
.ant-modal-body {
  padding-top: 50px;
}
</style>