<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="14" :xl="14" :sm="24" style="padding-right:0;">
            <span class="table-page-search-submitButtons">
              <a-button class="default_btn" @click="handleDowload()">下载</a-button>
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
      rowKey="fileId"
      :columns="columns"
      :data="loadData"
      :pagination="{ showTotal: total => `共 ${total} 条记录` }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="fileName" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }} </ellipsis></span
      >
      <span slot="fileSize" slot-scope="text">{{ text | FileSize }}</span>
      <span slot="created" slot-scope="text">{{ text | date }}</span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleDowload(record)">下载</a>
          <!-- <a @click="$refs.publicStl.add()">下载</a> -->

          <a-divider type="vertical" />
          <a @click="handleDetail(record)">详情</a>
        </template>
      </span>
    </s-table>
    <public-gcode ref="publicGcode" @ok="handleOk" />
    <public-stl ref="publicStl" @ok="handleOk" />
    <!-- <create-form ref="createModal" @ok="handleOk" />
    <step-by-step-modal ref="modal" @ok="handleOk"/>-->
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import PublicGcode from './modules/PublicGcode'
import PublicStl from './modules/PublicStl'
/* import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm' */
import { getFilePublicList, getFilePublicDownload } from '@/api/file'

export default {
  name: 'MyFile',
  components: {
    STable,
    Ellipsis,
    PublicGcode,
    PublicStl
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
      // 表头
      columns: [
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
          title: '上传人',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' }
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
        return getFilePublicList(Object.assign(parameter, this.queryParam)).then(res => {
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
  created() {},
  methods: {
    handleDowload(record) {
      let url = process.env.VUE_APP_API_BASE_URL
      if (record) {
        console.log('单文件下载')
        window.open(`${url}filePublic/download?fileIds=${record.fileId}`)
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
          window.open(`${url}filePublic/download?fileIds=${fileIds}`)
          this.$nextTick(() => {
            this.selectedRowKeys = []
          })
        }
        console.log('多文件下载')
      }
    },
    handleDetail(record) {
      if (record.fileType == '.gcode') {
        console.log('gcode')
        this.$refs.publicGcode.add(record.fileId)
      } else if (record.fileType == 'stl' || 'obj') {
        console.log('stl/obj')
        this.$refs.publicStl.add(record.fileId)
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
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    // 重置
    reset() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    }
  }
}
</script>
