<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        @click="showVisible = true;parentDate = null"
        class="m-r-20"
      >新建班次</a-button>
      <a-button @click="delRank()">
        <span>删除</span>
      </a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      rowKey="fileId"
      v-model="current"
      :pageSizeOptions="size"
      @change="tablePage"
      showPagination="auto"
      :pagination="pagination"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <span slot="name" slot-scope="text">{{ text}}</span>
      <span slot="time" slot-scope="text">{{ text }}</span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="delRank(record)" v-if="record.name != '默认班次'">删除</a>
        </template>
      </span>
    </s-table>
    <!-- 新增班次 -->
    <addClass
      v-if="showVisible"
      :showVisible="showVisible"
      v-on:childByValue="childByValue"
      :parentDate="parentDate"
    ></addClass>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import addClass from './common/addClass'
import { defultBank, editBank, delBank, delBankList } from '@/api/printer'

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'rankManage',
  components: {
    STable,
    Ellipsis,
    addClass
    /* CreateForm,
    StepByStepModal */
  },
  data() {
    return {
      showVisible: false,
      mdl: {},
      // 高级搜索 展开/关闭
      size: 10,
      current: 1,
      parentDate: {},
      pagination: {
        current: 1,
        hideOnSinglePage: false,
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: total => `Total:${total}`
      },
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '班次名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '排班时间',
          dataIndex: 'time',
          scopedSlots: { customRender: 'time' }
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
        return defultBank(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.state == 1) {
            res.data.records.forEach(element => {
              element.time = element.startTime + ' ~ ' + element.endTime
            })
          }
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
    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    // 关闭模态框
    childByValue(childValue) {
      this.showVisible = childValue
      this.$refs.table.loadData()
    },
    handleEdit(record) {
      this.showVisible = true
      this.parentDate = record
      // let param = {
      //   shiftId: record.shiftId,
      //   name: record.name,
      //   startTime: record.startTime,
      //   endTime: record.endTime
      // }
      // this.$refs.modal.edit(record)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    confirm() {},
    // 删除班次
    delRank(item) {
      console.log(33)
      let that = this
      this.$confirm({
        title: '请确认删除此项班次或多项排班?',
        onOk() {
          let param = {}
          let shiftIds = []
          if (item) {
            shiftIds.push(item.shiftId)
            param.shiftIds = shiftIds
          } else {
            if (that.selectedRows.length == 0) {
              that.$notification.info({ message: '请选择您要删除的排班！' })
              return false
            }
            that.selectedRows.forEach(ele => {
              shiftIds.push(ele.shiftId)
            })
            param.shiftIds = shiftIds
          }
          console.log(param)
          delBankList(param).then(res => {
            if (res.state == 1) {
              that.$refs.table.loadData()
            }
          })
        },
        onCancel() {}
      })
    },
    tablePage() {}
  }
}
</script>
