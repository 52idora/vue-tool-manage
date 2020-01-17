<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :xl="9" :sm="24" style="padding-right:0;">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="plus" @click="$refs.thingNew.add()">物品录入</a-button>
            </span>
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
      rowKey="id"
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
          <a @click="$refs.thingNew.add(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="你确定要删除这个物品吗？"
            @confirm="confirmDelete(record)"
            okText="确认"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <thing-new ref="thingNew" @ok="handleSearch" />
  </a-card>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { thingPage,thingDel} from '@/api/thing'
  import thingNew from "./thingNew";

  const columns = [
    {
      title: '物品名称',
      dataIndex: 'thing_name',
      scopedSlots: { customRender: 'thingName' }
    },
    {
      title: '物品总数',
      dataIndex: 'total_num',
      // sorter: true,
      scopedSlots: { customRender: 'totalNum' }
    },
    {
      title: '物品剩余',
      dataIndex: 'rest_num',
      // sorter: true,
      scopedSlots: { customRender: 'restNum' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]

  export default {
    name: 'departList',
    components: {
      thingNew,
      STable,
      Ellipsis
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
        form: this.$form.createForm(this, {keyword: null }),
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          parameter.keyword = this.queryParam.keyword
          return thingPage(parameter).then(res => {
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
      confirmDelete(record) {
        thingDel({'thingId':record.id}).then(res => {
          if (res.state == 1) {
            this.$refs.table.refresh()
            this.$notification.success({ message: '成功' })
          }
        })
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
