<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-row :gutter="24">
        <a-col :span="20" style="padding-right:0;">
          <span class="table-page-search-submitButtons" v-if="!(orderDetail.state == 4 || orderDetail.state == 5)">
            <a-button type="primary" icon="plus" @click="inventoryNewModel(null,1)">新增</a-button>
            <a-button style="margin-left: 8px;" class="default_btn" @click="inventoryNewModel(null,2)">自定义生产</a-button>
            <a-button style="margin-left: 8px;" class="default_btn" @click="allArrange">排产</a-button>
            <a-button style="margin-left: 8px;" class="default_btn" @click="allDeliveNew">交付</a-button>
            <a-button style="margin-left: 8px;" class="default_btn" @click="allDelete">批量删除</a-button>
          </span>
        </a-col>
        <a-col :span="4">
          <span class="table-page-search-submitButtons">
            <router-link :to="{ name: 'deliverList',query:{id:this.orderId} }">
              <a-button class="pull-right m-b-20">查看交货单</a-button>
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
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      showPagination="auto"
    >
      <span slot="state" slot-scope="text">
        <span v-if="text == 1">转入生产</span>
        <span v-if="text == 2">生产中</span>
        <span v-if="text == 3">已交付</span>
      </span>
      <span slot="inventoryNumber" slot-scope="text,record">
        <span>{{text}}</span>
        <span v-if="record.inventoryUnit == 1">套</span>
        <span v-if="record.inventoryUnit == 2">个</span>
      </span>
      <span slot="scheduledNumber" slot-scope="text,record">
        <span>{{text}}</span>
        <span v-if="record.inventoryUnit == 1">套</span>
        <span v-if="record.inventoryUnit == 2">个</span>
      </span>
      <span slot="isCustom" slot-scope="text">
        <span v-if="text == true">自定义生产单</span>
        <span v-if="text == false">生产单</span>
      </span>

      <span slot="action" slot-scope="text, record" >
        <template>
          <a @click="inventoryNewModel(record,null,1)">详情</a>
          <a-divider type="vertical" v-if="record.state == 1" />
          <span  v-if="!(orderDetail.state == 4 || orderDetail.state == 5)">
          <a @click="inventoryNewModel(record,null,2)" v-if="record.state == 1">编辑</a>
          <a-divider type="vertical" v-if="record.state != 3 && record.inventoryNumber > record.scheduledNumber" />
          <a @click="toArrange(record)" v-if="record.state != 3 && record.inventoryNumber > record.scheduledNumber">排产</a>
          <a-divider type="vertical" v-if="record.state == 2" />
          <a @click="$refs.deliveNew.add(record,2,orderDetail)" v-if="record.state == 2">交付</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="你确定要删除这个清单吗？"
            @confirm="confirmDelete(record)"
            okText="确认"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </a-popconfirm>
          </span>
        </template>
      </span>
    </s-table>
  <inventory-new ref="inventoryNew"  @ok="handleOk()"/>
  <delive-new ref="deliveNew"  @ok="handleOk()"/>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { inventoryPage,inventoryDelete } from '@/api/manage'
import inventoryNew from './inventoryNew'
import deliveNew from './../deliver/deliveNew'
import Vue from 'vue'

const columns = [
  {
    title: '清单编号',
    dataIndex: 'inventoryNo',
    scopedSlots: { customRender: 'inventoryNo' }
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
    title: '已排产',
    dataIndex: 'scheduledNumber',
    scopedSlots: { customRender: 'scheduledNumber' }
  },
  {
    title: '规格',
    dataIndex: 'norms',
    scopedSlots: { customRender: 'norms' }
  },
  {
    title: '清单状态',
    dataIndex: 'state',
    // filters: [{ text: '最新', value: 1 }, { text: '生产中', value: 2 }, { text: '已交货', value: 3 }, { text: '已取消', value: 4 }, { text: '已关闭', value: 5 }],
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '清单类型',
    dataIndex: 'isCustom',
    scopedSlots: { customRender: 'isCustom' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
];
export default {
  components: {
    STable,
    Ellipsis,
    inventoryNew,
    deliveNew
  },
  data() {
    return {
      // 表头
      columns,
      orderId:null,
      orderDetail:{state:null},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if(!this.orderId) return null;
        return inventoryPage(Object.assign(parameter, {orderId:this.orderId})).then(res => {
          this.selectedRowKeys = [];
          this.selectedRows = [];
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
  },
  created() {
    
  },
  methods: {
    // search
    handleSearch(id=null,detail=null,isCustom=false) {
      if(id){this.orderId = id}
      if(detail){this.orderDetail = detail}
      this.$refs.table.loadData();
    },
    // 更多操作
    handleOk() {
      this.$emit('ok', null);
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 新建编辑
    inventoryNewModel(record = null,type=null,view=null){
      this.$refs.inventoryNew.add(this.orderDetail,record,type,view)
    },
    //删除
    confirmDelete(record = null){
      let param = {
        inventoryIds:[]
      }
      if(record){
        param.inventoryIds.push(record.inventoryId);
      }else{
        param.inventoryIds = this.selectedRowKeys;
      }
      inventoryDelete(Object.assign(param)).then(res => {
        if (res.state == 1) {
          this.handleOk();
          this.$notification.success({message: '成功'});
        }
      })
    },
    //批量删除
    allDelete(){
      if(this.selectedRowKeys.length == 0){
        this.$notification.info({message: '未选择任何清单！'})
      }else{
        this.$confirm({
          title: '你确定删除选中的清单吗？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk:() => {
            this.confirmDelete();
          }
        })
      }
    },
    //批量交付
    allDeliveNew(){
      if(this.selectedRowKeys.length == 0){
        this.$notification.info({message: '未选择任何清单！'})
      }else{
        //  v-if="record.inventoryNumber > record.scheduledNumber"
        //需求数量大于已排产数量且状态不能为已交付
        if(!this.selectedRows.every(item => item.state != 3)){
          let that = this;
          this.$confirm({
            title: '已交付完成的清单，不可再次交付,是否继续？',
            onOk:() => {
              let data = [];
              that.selectedRows.forEach((item,index) => {
                if(item.state != 3){
                  data.push(item)
                }
              });
              this.$refs.deliveNew.add(data,1,this.orderDetail)
            }
          });
        }else{
          this.$refs.deliveNew.add(this.selectedRows,1,this.orderDetail)
        }
      }
    },
    //批量排产
    allArrange(){
      if(this.selectedRowKeys.length == 0){
        this.$notification.info({message: '未选择任何清单！'})
      }else{
        //  v-if="record.inventoryNumber > record.scheduledNumber"
        //需求数量大于已排产数量且状态不能为已交付
        if(!this.selectedRows.every(item => item.inventoryNumber > item.scheduledNumber && item.state != 3)){
          let that = this;
          this.$confirm({
            title: '已排产完成的清单不可再次排产,是否继续？',
            onOk:() => {
              let data = [];
              that.selectedRows.forEach((item,index) => {
                if(item.inventoryNumber > item.scheduledNumber && item.state != 3){
                  data.push(item)
                }
              });
              that.$store.commit('SET_LIST',data);
              that.$router.push({name: 'arrange'})
            }
          });
        }else{
          this.$store.commit('SET_LIST',this.selectedRows);
          this.$router.push({name: 'arrange'})
        }
      }
    },
    //排产
    toArrange(data){
      let list = [];
      list.push(data);
      this.$store.commit('SET_LIST',list);
        this.$router.push({name: 'arrange'})
    }
  }
}
</script>
