<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper m-b-24">
      <a-row :gutter="24">
        <a-col :span="24">
          <span class="table-page-search-submitButtons">
            <router-link :to="{ name: 'orderDetail',query:{id:this.orderId} }">
              <a-button class="pull-right">返回</a-button>
            </router-link>
          </span>
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="inventoryId"
      :columns="columns"
      :data="loadData"
      :pagination="{ showTotal: total => `共 ${total} 条记录` }"
      showPagination="auto"
    >
      <span slot="inventoryNumber" slot-scope="text,record">
        <span>{{text}}</span>
        <span v-if="record.inventoryUnit == 1">套</span>
        <span v-if="record.inventoryUnit == 2">个</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="getHistoryList(record)">查看交付历史</a>
        </template>
      </span>
    </s-table>
  <deliver-history ref="deliverHistory" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { inventoryPage } from '@/api/manage'
import deliverHistory from './deliverHistory'

const columns = [
  {
    title: '清单编号',
    scopedSlots: { customRender: 'inventoryNo' },
    dataIndex: 'inventoryNo'
  },
  {
    title: '清单名称',
    dataIndex: 'inventoryName'
  },
  {
    title: '需求数量',
    dataIndex: 'inventoryNumber',
    scopedSlots: { customRender: 'inventoryNumber' }
  },
  {
    title: '规格',
    dataIndex: 'norms',
    scopedSlots: { customRender: 'norms' }
  },
  {
    title: '关联订单',
    dataIndex: 'orderNo',
    scopedSlots: { customRender: 'orderNo' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'deliverList',
  components: {
    STable,
    Ellipsis,
    deliverHistory
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      orderId:null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if(!this.orderId) return null;
        return inventoryPage(Object.assign(parameter, {orderId:this.orderId,isDelivered:true})).then(res => {
          return res
        })
      }
    }
  },
  filters: {
  },
  created() {
    this.orderId = this.$router.currentRoute.query.id;
  },
  methods: {
    getHistoryList(record){
      this.$refs.deliverHistory.add(record)
    }
  }
}
</script>
