<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="24" :xl="24" :sm="24" style="padding-right:0;">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="search(-1)">我发起的</a-button>
              <a-button style="margin-left: 8px;" class="default_btn" @click="search(1)">审批通过</a-button>
              <a-button style="margin-left: 8px;" class="default_btn" @click="search(2)">被驳回的</a-button>
              <a-button style="margin-left: 8px;" class="default_btn" @click="reset()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="approvalId"
      :columns="columns"
      :data="loadData"
      :pagination="{ showTotal: total => `共 ${total} 条记录` }"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="titles" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="created" slot-scope="text">{{ text | date }}</span>
      <span slot="state" slot-scope="text">
        <!-- <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" /> -->
        <span>{{ text | statusFilter }}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$refs.approvalDetail.add(record.approvalId)">详情</a>
        </template>
      </span>
    </s-table>
    <approval-detail ref="approvalDetail" @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
/* import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm' */
import Gcode from './modules/Gcode'
import Stl from './modules/Stl'
import ApprovalDetail from './modules/ApprovalDetail'
import { getApprovalList, getApprovalDetail } from '@/api/file'
const statusMap = {
  '-1': {
    text: '我发起的'
  },
  0: {
    text: '未审批的'
  },
  1: {
    text: '审批通过的'
  },
  2: {
    status: 'success',
    text: '审批被驳回的'
  }
}
export default {
  name: 'ApprovalList',
  components: {
    STable,
    Ellipsis,
    ApprovalDetail
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
          title: '审批名称',
          dataIndex: 'title',
          scopedSlots: { customRender: 'titles' }
        },
        {
          title: '发起人',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '发起时间',
          dataIndex: 'created',
          scopedSlots: { customRender: 'created' }
        },
        {
          title: '文件个数（个）',
          dataIndex: 'num',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columnsCopy: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '审批名称',
          dataIndex: 'title'
        },
        {
          title: '发起人',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '发起时间',
          dataIndex: 'created',
          scopedSlots: { customRender: 'created' }
        },
        {
          title: '文件个数（个）',
          dataIndex: 'num',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
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
        return getApprovalList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      showName: true,
      selectedRowKeys: [],
      selectedRows: []
    }
  },

  created() {},
  methods: {
    // 状态查找
    search(state) {
      if (state == -1) {
        console.log('我发起的')
        let newColumn = []
        this.columns.map(item => {
          if (item.dataIndex == 'userName') {
            return
          } else {
            newColumn.push(item)
          }
        })
        this.columns = newColumn
      } else {
        this.columns = this.columnsCopy
      }
      this.queryParam.state = state
      this.$refs.table.refresh()
    },
    // 重置
    reset() {
      this.columns = this.columnsCopy
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleDowload(record) {
      console.log(record)
      this.$refs.modal.edit(record)
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
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    }
  }
}
</script>
