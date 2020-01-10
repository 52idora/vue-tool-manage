<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :xl="9" :sm="24" style="padding-right:0;">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="plus" @click="$refs.filamentNew.add()">新建</a-button>
              <a-button style="margin-left: 8px;" class="default_btn" @click="allDelete">批量删除</a-button>
            </span>
          </a-col>
          <a-col :md="6" :xl="5" :sm="24">
            <a-form-item>
              <a-select
                v-model="queryParam.filamentType"
                :style="{marginLeft:'10px'}"
                placeholder="请选择查询条件"
              >
                <a-select-option :value="'filamentName'">物料名称</a-select-option>
                <a-select-option :value="'filamentBrand'">品牌</a-select-option>
                <a-select-option :value="'filamentTextures'">耗材种类</a-select-option>
                <a-select-option :value="'filamentNumber'">材料总数</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="5" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.keyword" placeholder="请输入查询内容" :maxlength="50" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :xl="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 15px" @click="resetSearchForm()" class="default_btn">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="filamentId"
      :columns="columns"
      :data="loadData"
      :pagination="{ showTotal: total => `共 ${total} 条记录` }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      showPagination="auto"
    >
      <span slot="status" slot-scope="text">
        <!-- <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" /> -->
        <span>{{text}}</span>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <router-link :to="{ name: 'filamentDetail',query:{id:record.filamentId} }">
            <a>详情</a>
          </router-link>

          <a-divider type="vertical" />
          <a-popconfirm
            title="你确定要删除这个材料吗？"
            @confirm="confirmDelete(record)"
            okText="确认"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <filament-new ref="filamentNew" @ok="handleSearch" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getFilamentList, filamentDelete } from '@/api/manage'
import filamentNew from './filamentNew'

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
const columns = [
  {
    title: '物料名称',
    dataIndex: 'filamentName',
    scopedSlots: { customRender: 'filamentName' }
  },
  {
    title: '品牌',
    dataIndex: 'filamentBrand'
  },
  {
    title: '耗材种类',
    dataIndex: 'filamentTextures',
    scopedSlots: { customRender: 'filamentTextures' }
  },
  {
    title: '料卷总数（卷）',
    dataIndex: 'filamentNumber',
    scopedSlots: { customRender: 'filamentNumber' }
  },
  {
    title: '剩余重量',
    dataIndex: 'restWeight',
    // sorter: true,
    scopedSlots: { customRender: 'restWeight' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'filamentList',
  components: {
    STable,
    Ellipsis,
    filamentNew
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      columns,
      selectedRowKeys: [],
      selectedRows: [],
      form: this.$form.createForm(this, { filamentType: 'filamentName', keyword: null }),
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let queryParam = { orderType: 1 }
        queryParam[this.queryParam.filamentType] = this.queryParam.keyword
        return getFilamentList(Object.assign(parameter, queryParam)).then(res => {
          this.selectedRowKeys = []
          this.selectedRows = []
          return res
        })
      }
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
    //删除
    confirmDelete(record = null) {
      let param = {}
      if (record) {
        param.filamentId = record.filamentId
      } else {
        let list = []
        this.selectedRows.forEach(item => {
          list.push(item.filamentId)
        })
        param.filamentIds = list
      }
      filamentDelete(Object.assign(param)).then(res => {
        if (res.state == 1) {
          this.$refs.table.refresh()
          this.$notification.success({ message: '成功' })
        }
      })
    },
    //批量删除
    allDelete() {
      if (this.selectedRows.length == 0) {
        // this.$notification.info({message: '未选择任何材料！'})
        this.$notification.info({ message: '未选择任何材料！' })
      } else {
        this.$confirm({
          title: '你确定删除选中的材料吗？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.confirmDelete()
          }
        })
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = {}
      this.$refs.table.loadData()
    },
    // search
    handleSearch(e) {
      this.$refs.table.loadData()
    }
  }
}
</script>
