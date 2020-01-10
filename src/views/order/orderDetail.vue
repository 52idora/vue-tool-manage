<template>
  <a-card :body-style="{padding: '20px 20px'}" title="订单信息" :bordered="false">
    <span slot="extra">
      <router-link :to="{ name: 'orderList' }">
         <a-button>返回</a-button>
      </router-link>
      <a-button class="m-l-8" @click="orderChange(4)" v-if="!(detail.state == 4 || detail.state == 5)">取消订单</a-button>
      <a-button class="m-l-8" @click="orderChange(5)" v-if="!(detail.state == 4 || detail.state == 5)">关闭订单</a-button>
    </span>
    <a-form class="ant-advanced-search-form">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item
          label="订单号"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 18}}"
          :required="false">
          <span>{{detail.orderNo}}</span>
        </a-form-item>
        </a-col>
        <a-col :span="8">
         <a-form-item
          label="订单名称"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 18}}">
          <span>{{detail.orderName}}</span>
        </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
          label="需求数量"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 18}}">
          <span>{{detail.orderNumber}}</span>
          <span class="m-l-10">套</span>
        </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
          label="客户"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 18}}"
          :required="false"
          >
          <span>{{detail.client}}</span>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
          label="交付时间"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 18}}">
          <span>{{detail.deliveryTime | date("YYYY-MM-DD")}}</span>
        </a-form-item>
        </a-col>
        <a-col :span="8">
           <a-form-item
          label="剩余天数"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 18}}">
          <span v-if="!(detail.state == 4 || detail.state == 5)">{{detail.deliveryDays}}</span>
          <span v-if="!(detail.state == 4 || detail.state == 5)" class="m-l-10">天</span>
          <span v-if="detail.state == 4 || detail.state == 5">--</span>
        </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
          label="制单人"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 18}}"
          :required="false"
          >
          <span>{{detail.userName}}</span>
        </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
          label="订单状态"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 18}}">
          <span>
            <span v-if="detail.state == 1">最新</span>
            <span v-if="detail.state == 2">生产中</span>
            <span v-if="detail.state == 3">已交货</span>
            <span v-if="detail.state == 4">已取消</span>
            <span v-if="detail.state == 5">已关闭</span>
          </span>
        </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="超期天数"
            :labelCol="{lg: {span: 6}}"
            :wrapperCol="{lg: {span: 18}}">
            <span v-if="!(detail.state == 4 || detail.state == 5)">{{detail.extendedDays}}</span>
            <span v-if="!(detail.state == 4 || detail.state == 5)" class="m-l-10">天</span>
            <span v-if="detail.state == 4 || detail.state == 5">--</span>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="创建日期"
            :labelCol="{lg: {span: 2}}"
            :wrapperCol="{lg: {span: 22}}">
            <span>{{detail.createTime | date}}</span>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
          label="详细说明"
          :labelCol="{lg: {span: 2}}"
          :wrapperCol="{lg: {span: 22} }"
          :required="false"
          >
          <span>{{detail.description}}</span>
        </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
          label="备注"
          :labelCol="{lg: {span: 2}}"
          :wrapperCol="{lg: {span: 22}}">
          <span>{{detail.remark}}</span>
        </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <inventory-list ref="inventoryList" @ok="handleSearch()" />
  </a-card>
</template>

<script>
import inventoryList from './inventory/inventoryList'
import { ordersFind,ordersChangeState } from '@/api/manage'

export default {
  name: 'orderDetail',
  components: {
    inventoryList
  },
  data () {
    return {
      detail:{
        client: null,
        createTime: null,
        deliveryDays: null,
        deliveryTime: null,
        description: null,
        extendedDays: null,
        orderId: null,
        orderName: null,
        orderNo: null,
        orderNumber: null,
        remark: null,
        state: null,
        updateTime: null,
        userName: null,
      },
      orderId:null,
    }
  },
  created() {
    let orderId = this.$router.currentRoute.query.id;
    this.getOrderDetail(orderId);
  },
  methods: {
    handleSearch(){
      this.getOrderDetail(this.orderId)
    },
    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    getOrderDetail(id,isCustom=null){
      this.orderId = id;
      ordersFind(Object.assign({orderId:id})).then(res => {
        if (res.state == 1) {
          this.detail = res.data;
          this.$refs.inventoryList.handleSearch(this.orderId,this.detail);
        }else{
          this.$notification.error({message: '失败'});
        }
      })
    },
    orderChange(type){
      ordersChangeState(Object.assign({orderId:this.orderId,state:type})).then(res => {
        if (res.state == 1) {
          this.$router.push({name: 'orderList'})
        }else{
          if(type == 5){
            this.$notification.error({message: '存在未交付的清单'});
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .ant-advanced-search-form .ant-form-item{
    margin-bottom: 0px;
  }
  /deep/ .ant-card-head{
    border-color: rgba(0, 0, 0, 0.6);
  }
</style>
