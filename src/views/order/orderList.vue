<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="14" :xl="14" :sm="24" style="padding-right:0;">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="plus" @click="$refs.orderNew.add()">新增</a-button>
              <a-button style="margin-left: 8px;" class="default_btn" @click="allDelete">批量删除</a-button>
            </span>
          </a-col>
          <a-col :md="6" :xl="5" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.keyword" :maxLength="100" @keyup.enter="handleSearch" placeholder="请输入订单号或订单名称" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :xl="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 15px" @click="resetSearchForm" class="default_btn">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="orderId"
      :columns="columns"
      :data="loadData"
      :pagination="{ showTotal: total => `共 ${total} 条记录` }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      showPagination="auto"
    >
      <span slot="state" slot-scope="text">
        <!-- <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" /> -->
        <span v-if="text == 1">最新</span>
        <span v-if="text == 2">生产中</span>
        <span v-if="text == 3">已交货</span>
        <span v-if="text == 4">已取消</span>
        <span v-if="text == 5">已关闭</span>
      </span>
      <span slot="deliveryTime" slot-scope="text">
        <span>{{text | date}}</span>
      </span>
      <span slot="deliveryDays" slot-scope="text,record">
        <span v-if="record.state != 4 && record.state != 5">{{text}} 天</span>
        <span v-if="record.state == 4 || record.state == 5">--</span>
      </span>
      <span slot="extendedDays" slot-scope="text,record">
        <span v-if="record.state != 4 && record.state != 5">{{text}} 天</span>
        <span v-if="record.state == 4 || record.state == 5">--</span>
      </span>
      <span slot="client" slot-scope="text">
        <span>{{text || '--'}}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <router-link :to="{ name: 'orderDetail',query:{id:record.orderId} }">
            <a>详情</a>
          </router-link>
          <a-divider type="vertical" v-if="record.state != 4 && record.state != 5"/>
          <a @click="handleEdit(record)" v-if="record.state != 4 && record.state != 5">编辑</a>
          <a-divider type="vertical" v-if="record.state == 5" />
          <a @click="reproduced(record,1)" v-if="record.state == 5">重新生产</a>
          <a-divider type="vertical" v-if="record.state == 4" />
          <a @click="orderChange(record,1)" v-if="record.state == 4">重新打开</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="你确定要删除这个订单吗？"
            @confirm="confirmDelete(record)"
            okText="确认"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
  <order-new ref="orderNew"  @ok="handleSearch"/>
  <a-modal
    title="重新选择交付时间"
    :width="600"
    :visible="visible"
    @cancel="visible = false"
    :footer="null"
  >
    <a-card :bordered="false">
      <a-row :gutter="48">
        <a-col :span="6"><span class="red">*</span><span>交付时间：</span></a-col>
        <a-col :span="18">
          <a-date-picker
          style="width: 100%"
          v-model="deliveryTime" 
          @change="deliveryTimeChange"
          />
          <span class="red" v-if="isDeliveryTime">请选择交付时间</span>
        </a-col>
      </a-row>
      <div class="text-center m-t-20"><a-button type="primary" @click="reproduced(null,2)">确定</a-button></div>
    </a-card>
  </a-modal>
  </a-card>
</template>

<script>

const columns = [
  {
    title: '订单号',
    scopedSlots: { customRender: 'orderNo' },
    dataIndex: 'orderNo'
  },
  {
    title: '订单名称',
    dataIndex: 'orderName'
  },
  {
    title: '需求数量',
    dataIndex: 'orderNumber',
    scopedSlots: { customRender: 'orderNumber' }
  },
  {
    title: '剩余天数',
    dataIndex: 'deliveryDays',
    scopedSlots: { customRender: 'deliveryDays' }
  },
  {
    title: '超期天数',
    dataIndex: 'extendedDays',
    scopedSlots: { customRender: 'extendedDays' }
  },
  {
    title: '订单状态',
    dataIndex: 'state',
    filters: [{ text: '最新', value: '1' }, { text: '生产中', value: '2' }, { text: '已交货', value: '3' }, { text: '已取消', value: '4' }, { text: '已关闭', value: '5' }],
    scopedSlots: { customRender: 'state' },
  },
  {
    title: '客户',
    dataIndex: 'client',
    scopedSlots: { customRender: 'client' }
  },
  {
    title: '交付时间',
    dataIndex: 'deliveryTime',
    scopedSlots: { customRender: 'deliveryTime' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
];

import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { ordersPage,ordersDelete,ordersReproduced,ordersChangeState } from '@/api/manage'
import orderNew from './orderNew'

export default {
  name: 'orderList',
  components: {
    STable,
    Ellipsis,
    orderNew
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let param = {
          current:parameter.current,
          size:parameter.size,
        }
        if(parameter.state){
          param.states = parameter.state;
        }
        return ordersPage(Object.assign(param, this.queryParam)).then(res => {
          this.selectedRowKeys = [];
          this.selectedRows = [];
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      record:null,
      visible:false,
      deliveryTime:null,
      isDeliveryTime:false,
    }
  },
  filters: {
    
  },
  created() {
    
  },
  methods: {
    handleOk() {
      this.$refs.table.refresh()
    },
    // 编辑
    handleEdit(record) {
      this.$refs.orderNew.add(record)
    },
    // search
    handleSearch(e) {
      this.$refs.table.loadData()
    },
    resetSearchForm() {
      this.queryParam = {}
      this.$refs.table.loadData()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    //重新打开
    orderChange(data){
      ordersChangeState(Object.assign({orderId:data.orderId,state:6})).then(res => {
        if (res.state == 1) {
          this.$refs.table.loadData()
          this.$notification.success({message: '成功'});
        }
      })
    },
    //重新生产
    reproduced(data=null,type=null){
      if(type == 2){
        this.deliveryTimeChange();
        if(this.isDeliveryTime) return;
        ordersReproduced(Object.assign({orderId:this.record.orderId,deliveryTime:this.deliveryTime})).then(res => {
          this.visible = false;
          if (res.state == 1) {
            this.$refs.table.loadData();
            this.$notification.success({message: '成功'});
          }else{
            this.$notification.error({message: '失败'});
          }
        })
      }else{
        this.record = data;
        this.isDeliveryTime = false;
        this.visible = true;
      }
    },
    //删除
    confirmDelete(record = null){
      let param = {
        orderIds:[]
      }
      if(record){
        param.orderIds.push(record.orderId);
      }else{
        param.orderIds = this.selectedRowKeys;
      }
      ordersDelete(Object.assign(param)).then(res => {
        if (res.state == 1) {
          this.$refs.table.refresh()
          this.$notification.success({message: '成功'});
        }
      })
    },
    //批量删除
    allDelete(){
      if(this.selectedRowKeys.length == 0){
        this.$notification.info({message: '未选择任何订单！'})
      }else{
        this.$confirm({
          title: '你确定删除选中的订单吗？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk:() => {
            this.confirmDelete();
          }
        })
      }
    },
    deliveryTimeChange(){
      if(this.deliveryTime){
        this.isDeliveryTime = false;
      }else{
        this.isDeliveryTime = true;
      }
    }
  }
}
</script>
