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
                <a-button type="primary" icon="plus">上传</a-button>
              </a-upload>
              <a-button style="margin-left: 8px;" class="default_btn" @click="handleBatchApproval()"
                >发起批量审批</a-button
              >

              <a-dropdown>
                <a-menu slot="overlay" @click="handleMenuClick">
                  <a-menu-item key="1">批量下载</a-menu-item>
                  <a-menu-item key="2">删除</a-menu-item>
                </a-menu>
                <a-button class="default_btn" style="margin-left: 8px">
                  更多操作
                  <a-icon type="down" />
                </a-button>
              </a-dropdown>
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
    <a-spin :spinning="spinning">
      <s-table
        ref="table"
        size="default"
        rowKey="fileId"
        :columns="columns"
        :data="loadData"
        :pagination="{ showTotal: total => `共 ${total} 条记录` }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="fileName" slot-scope="text">
          <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="fileSize" slot-scope="text">{{ text | FileSize }}</span>
        <span slot="created" slot-scope="text">{{ text | date }}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleDowload(record)">下载</a>
            <a-divider type="vertical" />
            <!-- <a @click="$refs.stl.add()">详情</a> -->
            <a @click="handleDetail(record)">详情</a>
            <a-divider type="vertical" />
            <a @click="handlePublic(record.fileId)">转入公海文件</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="del(record.fileId)" okText="是" cancelText="否">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>
    </a-spin>

    <gcode ref="gcode" @ok="handleOk" />
    <stl ref="stl" @ok="handleOk" />
    <batch-approval ref="batchApproval" @ok="handleOk" @cancle="handleCancle" />
    <batch-slicing ref="batchSlicing" @ok="handleOk" />
    <!-- <create-form ref="createModal" @ok="handleOk" />
    <step-by-step-modal ref="modal" @ok="handleOk"/>-->
  </a-card>
</template>

<script>
import moment from 'moment'
import bus from './bus'
import axios from 'axios'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable, Ellipsis } from '@/components'
/* import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm' */
import Gcode from './modules/Gcode'
import Stl from './modules/Stl'
import BatchApproval from './modules/BatchApproval'
import BatchSlicing from './modules/BatchSlicing'
import { getMyFileUpload, getMyFileList, getMyFileDelete, getMyFileDownload, getMyFileIntoPublic } from '@/api/file'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '文件名',
    dataIndex: 'fileName',
    scopedSlots: { customRender: 'fileName' }
  },
  {
    title: '文件格式',
    dataIndex: 'fileType',
    scopedSlots: { customRender: 'fileType' }
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
    width: '300px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'MyFile',
  components: {
    STable,
    Ellipsis,
    Gcode,
    Stl,
    BatchApproval,
    BatchSlicing
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
      spinning: false,
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getMyFileList(Object.assign(parameter, this.queryParam)).then(res => {
          this.selectedRowKeys = []
          this.selectedRows = []
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
    bus.$on('updateFileList', value => {
      this.$refs.table.loadData()
    })
  },
  methods: {
    // 重置
    reset() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    // 详情
    handleDetail(record) {
      if (record.fileType == '.gcode') {
        this.$refs.gcode.add(record.fileId)
      } else if (record.fileType == 'stl' || 'obj') {
        this.$refs.stl.add(record.fileId)
      }
    },
    // 下载
    handleDowload(record) {
      let url = process.env.VUE_APP_API_BASE_URL
      if (record) {
        window.open(`${url}filePrivate/download?fileIds=${record.fileId}`)
      } else {
        if (this.selectedRowKeys.length == '0') {
          this.$notification.warning({
            message: '请选择要下载的文件'
          })
        } else if (this.selectedRows.length > 10) {
          this.$notification.warning({ message: '最多可选择十个文件' })
        } else {
          let fileIds = this.selectedRowKeys.join('-')
          console.log(fileIds)
          window.open(`${url}filePrivate/download?fileIds=${fileIds}`)
          this.$nextTick(() => {
            this.selectedRowKeys = []
          })
        }
        console.log('多文件下载')
      }
    },
    // 上传文件之前beforeUpload
    beforeUpload(file) {
      let type = /\.[^\.]+$/.exec(file.name)[0]
      if (type == '.gcode' || type == '.stl' || type == '.obj') {
        if (file.size > 0 && file.size <= 20 * 1024 * 1024) {
          this.fileList = [...this.fileList, file]
          this.files = []
          bus.$emit('uploadFile', { file: file, type: 1 })
        } else {
          this.$notification.error({
            message: '上传的文件不能大于20MB！'
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

    // 转入公海文件
    handlePublic(id) {
      this.spinning = true
      getMyFileIntoPublic({ fileId: id }).then(res => {
        console.log(res)
        if (res.state == 1) {
          this.spinning = false
          this.$notification.success({
            message: '转入公海文件成功'
          })
        } else {
          this.spinning = false
          this.$notification.error({
            message: '转入公海文件失败'
          })
        }
      })
    },
    // 删除
    del(id, batch) {
      let that = this
      console.log(id)
      if (!batch) {
        const params = {
          fileIds: id
        }

        getMyFileDelete(params).then(res => {
          if (res.state == 1) {
            that.$notification.success({
              message: '删除成功'
            })
            that.$refs.table.refresh(true)
          } else {
            that.$notification.error({
              message: '删除失败'
            })
          }
        })
      } else {
        if (that.selectedRowKeys.length == '0') {
          // that.$message.info('请选择要删除的文件')
          that.$notification.warning({
            message: '请选择要删除的文件'
          })
        } else if (this.selectedRows.length > 10) {
          this.$notification.warning({ message: '最多可选择十个文件' })
        } else {
          that.$confirm({
            title: '你确定删除选中的文件吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
              let ids = that.selectedRowKeys.join(',')
              const params = {
                fileIds: ids
              }
              console.log(params)
              getMyFileDelete(params).then(res => {
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
      }
    },
    // 发起批量审批
    handleBatchApproval() {
      if (this.selectedRows.length == '0') {
        // that.$message.info('请选择要删除的文件')
        this.$notification.warning({
          message: '请选择要审批的文件'
        })
      } else if (this.selectedRows.length > 10) {
        this.$notification.warning({ message: '最多可选择十个文件' })
      } else {
        for (let i = 0; i < this.selectedRows.length; i++) {
          if (this.selectedRows[i].fileType != '.gcode') {
            this.$notification.warning({
              message: '请选择gcode文件'
            })
            this.selectedRows = []
            this.selectedRowKeys = []
            return
          } else {
          }
        }
        this.$nextTick(() => {
          this.$refs.batchApproval.add(this.selectedRows)
        })
        /* this.$refs.batchApproval.add(this.selectedRows) */
      }
      //   console.log(this.selectedRows)
    },
    // 更多操作(批量删除/批量下载)
    handleMenuClick(e) {
      if (e.key == 1) {
        console.log('批量下载')
        this.handleDowload()
      } else if (e.key == 2) {
        console.log('批量删除')
        this.del(this.selectedRows, 2)
      }
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    handleCancle() {
      this.selectedRows = []
      this.selectedRowKeys = []
      this.reset()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>
