<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="14" :xl="14" :sm="24" style="padding-right:0;">
            <span class="table-page-search-submitButtons">
              <a-upload
                name="file"
                :multiple="true"
                :showUploadList="false"
                :fileList="fileList"
                :beforeUpload="beforeUpload"
              >
                <a-button type="primary"> <a-icon type="plus" />上传 </a-button>
              </a-upload>
              <a-button style="margin-left: 8px;margin-top:9px" class="default_btn" @click="del()">删除</a-button>
            </span>
          </a-col>
          <a-col :md="6" :xl="5" :sm="24">
            <a-form-item>
              <a-input
                v-model="queryParam.word"
                placeholder="请输入文件名"
                :maxlength="50"
                @pressEnter="$refs.table.refresh()"
              />
            </a-form-item>
          </a-col>
          <a-col :md="4" :xl="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>
              <a-button style="margin-left: 15px" @click="reset()" class="default_btn">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="binId"
      :columns="columns"
      :data="loadData"
      :pagination="{ showTotal: total => `共 ${total} 条记录` }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>

      <span slot="titles" slot-scope="text"
        ><ellipsis :length="30" tooltip>{{ text }}</ellipsis></span
      >
      <span slot="fileSize" slot-scope="text">{{ text | FileSize }}</span>
      <span slot="created" slot-scope="text">{{ text | date }}</span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleDowload(record)">下载</a>
        </template>
      </span>
    </s-table>
    <!-- <create-form ref="createModal" @ok="handleOk" />
    <step-by-step-modal ref="modal" @ok="handleOk"/>-->
    <!-- <global-upload ref="globalUpload"></global-upload> -->
  </a-card>
</template>

<script>
import moment from 'moment'
import bus from './bus'
import axios from 'axios'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable, Ellipsis } from '@/components'
// import GlobalUpload from '@/components/GlobalUpload'
/* import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm' */
import { getSliceFileList, getSliceFileUpload, getSliceFileDelete } from '@/api/file'

export default {
  name: 'MyFile',
  components: {
    STable,
    Ellipsis
    /* CreateForm,
    StepByStepModal */
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      fileList: [],
      files: [],
      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'Bin文件名',
          dataIndex: 'title',
          scopedSlots: { customRender: 'titles' }
        },
        {
          title: '文件大小',
          dataIndex: 'fileSize',
          scopedSlots: { customRender: 'fileSize' }
        },
        {
          title: '上传时间',
          dataIndex: 'created',
          scopedSlots: { customRender: 'created' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getSliceFileList(Object.assign(parameter, this.queryParam)).then(res => {
          console.log(res)
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  created() {
    bus.$on('updateBinList', value => {
      this.$refs.table.loadData()
    })
  },
  methods: {
    // 下载
    handleDowload(record) {
      let url = process.env.VUE_APP_API_BASE_URL
      /* window.location = 'http://192.168.0.7:8100/slicing/download/?slicerNumber=6549233711563411456' */
      window.open(`${url}fileBin/download?binId=${record.binId}`)
    },
    // 上传文件
    beforeUpload(file) {
      let type = /\.[^\.]+$/.exec(file.name)[0]
      if (type == '.bin' || type == '.stl' || type == '.obj') {
        if (file.size > 0 && file.size <= 20971520) {
          this.fileList = [...this.fileList, file]
          this.files = []
          bus.$emit('uploadFile', { file: file, type: 2 })
        } else {
          this.$notification.error({
            message: '上传的文件不能小于0mb且不能大于20mb！'
          })
          return false
        }
      } else {
        this.$notification.error({
          message: `${file.name}格式有误,请重新选择`
        })
        return false
      }
      return false
    },
    // 删除
    del() {
      let that = this
      if (that.selectedRowKeys.length == '0') {
        // that.$message.info('请选择要删除的文件')
        this.$notification.warning({
          message: '请选择要删除的文件'
        })
      } else if (this.selectedRows.length > 10) {
        this.$notification.warning({ message: '最多可选择十个文件' })
      } else {
        that.$confirm({
          title: '警告',
          content: `确定删除吗？`,
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            let ids = that.selectedRowKeys.join(',')
            const params = {
              binIds: ids
            }
            console.log(params)
            getSliceFileDelete(params).then(res => {
              if (res.state == 1) {
                that.$notification.success({
                  message: '删除成功'
                })
                that.selectedRowKeys = []
                that.$refs.table.refresh()
              } else {
                that.selectedRowKeys = []
                that.$notification.error({
                  message: '删除失败'
                })
              }
            })
          },
          onCancel() {
            that.selectedRowKeys = []
            that.$notification.warning({
              message: '取消删除'
            })
          }
        })
      }
    },
    handleSub(record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    // 更多操作
    handleMenuClick(e) {},
    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 重置
    reset() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    }
  }
}
</script>
<style lang="less" scoped>
.table-page-search-wrapper .table-page-search-submitButtons {
  display: flex;
}
</style>
