<template>
  <a-modal
    :title="'清单信息'"
    :width="800"
    :visible="visible"
    okText="保存"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-card :bordered="false" :body-style="{padding: '0px 20px 20px'}">
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4">清单编号：</a-col>
        <a-col :span="8">{{detail.inventoryNo}}</a-col>
        <a-col :span="4">清单名称：</a-col>
        <a-col :span="8">{{detail.inventoryName}}</a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4">需求数量：</a-col>
        <a-col :span="8">
          <span>{{detail.inventoryNumber}}</span>
          <span v-if="detail.inventoryUnit == 1">套</span>
          <span v-if="detail.inventoryUnit == 2">个</span>
        </a-col>
        <a-col :span="4">规格：</a-col>
        <a-col :span="8">{{detail.norms}}</a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4">关联订单：</a-col>
        <a-col :span="8">{{detail.orderNo}}</a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4"><h3>交货历史</h3></a-col>
      </a-row>
      <div class="file-list">
      <a-table
      :columns="columns"
      :pagination="false"
      :dataSource="fileList">
        <span slot="deliveryNo" slot-scope="text">
          <span>{{text}}</span>
          <!-- <a>{{text}}</a> -->
        </span>
        <span slot="createTime" slot-scope="text">
          <span>{{text |date}}</span>
        </span>
      </a-table>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { STable } from '@/components'

const columns = [
  {
    title: '数量',
    dataIndex: 'deliveryNumber',
  },
  {
    title: '运单号',
    dataIndex: 'deliveryNo',
    scopedSlots: { customRender: 'deliveryNo' }
  },
  {
    title: '交付日期',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' }
  }
]

let lodash = require('lodash')
import { deliveryHistory } from '@/api/manage'
export default {
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      //列表
      columns,
      detail:{
        inventoryId:null,
        inventoryNo:null,
        inventoryName:null,
        inventoryNumber:null,
        norms:null,
        inventoryUnit:null,
        orderNo:null
      },
      fileList : []
    }
  },
  created() {
  },

  methods: {
    add(detail = null) {
      this.detail = detail;
      this.getHistory(this.detail.inventoryId);
      this.visible = true;
    },
    handleCancel(){
      this.visible = false;
    },
    handleOk(){
      this.visible = false;
    },
    getHistory(id){
      deliveryHistory(Object.assign({inventoryId:id})).then(res => {
        if (res.state == 1) {
          this.fileList = res.data;
        }else{
          this.$notification.error({message: '失败'});
        }
      })
    }
  },
  // 过滤器
  filters: {
  }
}
</script>
<style lang="less" scoped>
  .l-h-45{
    line-height: 45px;
  }
  .file-list{
    max-height: 320px;
    overflow: auto;
  }
</style>