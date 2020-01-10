<template>
  <a-modal
    :title="'清单信息'"
    :width="900"
    :visible="visible"
    okText="保存"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-card :bordered="false" :body-style="{padding: '0px 20px 20px'}">
      <a-form>
        <a-row :gutter="48">
          <a-col :md="12" :sm="12">
            <a-form-item label="ID号" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <span>{{filament.storeId}}</span>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="12">
            <a-form-item
              label="入库时间"
              :labelCol="{span:6}"
              :wrapperCol="{span:14}"
            >{{filament.createTime |date}}</a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="12" :sm="12">
            <a-form-item label="入库卷数" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <span>{{filament.totalNumber}}</span>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="12">
            <a-form-item label="颜色" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <span>{{filament.filamentColor}}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="12" :sm="12">
            <a-form-item label="入库人" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <span>{{filament.userName}}</span>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="12">
            <a-form-item label="重量" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <span>{{filament.restWeight}}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="file-list">
        <a-table :columns="columns" :pagination="false" :dataSource="fileList" rowKey="volumeId">
          <span slot="serial" slot-scope="text, record,index">
            <template>
              <span>{{index+1}}</span>
            </template>
          </span>
          <span slot="restWeight" slot-scope="text, record">
            <template>
              <a-input-number
                :min="0"
                :max="999999"
                v-model="record.restWeight"
                @blur="blur(record.volumeId)"
                @change="change"
              />
            </template>
          </span>
          <span slot="volumeState" slot-scope="text,record">
            <template>
              <span v-if="text == 1">闲置</span>
              <span v-if="text == 2">领取</span>
            </template>
          </span>
          <span slot="createTime" slot-scope="text,record">{{text|date}}</span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a-popconfirm
                title="你确定要删除这个料卷吗？"
                @confirm="deleteInven(record.volumeId)"
                okText="确认"
                cancelText="取消"
              >
                <a href="#">删除</a>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定打印？"
                @confirm="confirmPrint(record)"
                okText="确认"
                cancelText="取消"
              >
                <a href="#">打印标签</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { filamentVolumePage, filamentVolumeDelete, filamentVolumeEdit, filamentVolumePrint } from '@/api/manage'
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
      form: this.$form.createForm(this),

      //列表
      columns: [
        {
          title: '编码',
          dataIndex: 'serial',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '剩余重量(g)',
          dataIndex: 'restWeight',
          scopedSlots: { customRender: 'restWeight' }
        },
        {
          title: '状态',
          dataIndex: 'volumeState',
          scopedSlots: { customRender: 'volumeState' }
        },
        {
          title: '机器编号',
          dataIndex: 'volumeNo',
          scopedSlots: { customRender: 'volumeNo' }
        },
        {
          title: '机器类型',
          dataIndex: 'machineType',
          scopedSlots: { customRender: 'machineType' }
        },
        {
          title: '领用人',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '领用时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      fileList: [
        {
          serial: '12465',
          weight: 100,
          status: '领用',
          printerNo: 'AR-0001',
          printerType: 'E2',
          user: 'Ewing',
          date: '2019-12-17'
        }
      ],
      selectedRowKeys: [],
      restWeight: '',
      filament: {
        filamentId: 2,
        created: '1'
      }
    }
  },
  created() {},

  methods: {
    add(record) {
      this.visible = true
      console.log(record)
      this.filament = record
      this.getDetail(record.storeId)
    },
    getDetail(id) {
      filamentVolumePage({ storeId: id }).then(res => {
        console.log(res)
        this.fileList = res.data
      })
    },
    blur(id) {
      const params = {
        restWeight: this.restWeight,
        volumeId: id
      }
      filamentVolumeEdit(params).then(res => {
        console.log(res)
        if (res.state == 1) {
          this.$notification.success({
            message: '编辑成功'
          })
        } else {
          this.$notification.error({
            message: '编辑失败'
          })
        }
      })
    },
    change(value) {
      this.restWeight = value
    },
    deleteInven(id) {
      console.log(id)
      // filamentVolumeDelete
      filamentVolumeDelete({ volumeId: id }).then(res => {
        if (res.state == 1) {
          this.$notification.success({
            message: '删除成功'
          })
          this.getDetail()
        } else {
          this.$notification.error({
            message: '删除失败'
          })
        }
      })
    },
    confirmPrint(record) {
      console.log(record.volumeNo)
      filamentVolumePrint({ volumeNo: record.volumeNo }).then(res => {
        if (res.state == 1) {
          if (res.data.code == 0) {
            this.$notification.success({ message: '打印正常' })
          } else {
            this.$notification.error({
              message: res.data.msg
            })
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.visible = false
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    }
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
.ant-form /deep/ .ant-form-item-label {
  text-align: left;
}
</style>