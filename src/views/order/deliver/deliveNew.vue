<template>
  <a-modal
    :title="'清单交付'"
    :width="800"
    :visible="visible"
    okText="保存"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-card :bordered="false" :body-style="{padding: '20px 20px'}">
      <a-row :gutter="24" class="l-h-45 deliver">
        <a-col :span="6">
          <div class="delive">
            <div class="delive-list">
              <div class="delive-list-item" v-for="(item,index) of deliverList" :key="item.inventoryId" @click="deliverChange(item)" :class="{'active':item.inventoryId == detailId}">
                <span>{{item.inventoryName}}</span>
                <span class="pull-right" v-if="deliverList.length > 1"><a-icon type="close"  @click.stop="deliveDelete(item,index)" /></span>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="18">
          <a-row :gutter="24" class="l-h-45">
            <a-col :span="5">清单编号：</a-col>
            <a-col :span="7">{{detail.inventoryNo}}</a-col>
            <a-col :span="5">清单名称：</a-col>
            <a-col :span="7">{{detail.inventoryName}}</a-col>
          </a-row>
          <a-row :gutter="24" class="l-h-45">
            <a-col :span="5">需求数量：</a-col>
            <a-col :span="7">
              <span>{{detail.inventoryNumber}}</span>
              <span v-if="detail.inventoryUnit == 1">套</span>
              <span v-if="detail.inventoryUnit == 2">个</span>
            </a-col>
            <a-col :span="5">规格：</a-col>
            <a-col :span="7">{{detail.norms}}</a-col>
          </a-row>
          <a-row :gutter="24" class="l-h-45">
            <a-col :span="5">关联订单：</a-col>
            <a-col :span="7">{{orderDetail.orderNo}}</a-col>
          </a-row>
          <a-row :gutter="24" class="l-h-45">
            <a-col :span="7">请输入交货数量：</a-col>
            <a-col :span="17">
              <a-input-number
              v-model="deliveryNumber"
              @change="deliveryChange" 
              :min="1" 
              :max="99999999"/>
              <span class="m-l-10" v-if="detail.inventoryUnit == 1">套</span>
              <span class="m-l-10" v-if="detail.inventoryUnit == 2">个</span>
            </a-col>
          </a-row>
          <a-row :gutter="24" class="l-h-45">
            <a-col :span="7">请输入物流运单号：</a-col>
            <a-col :span="17"><a-input v-model="deliveryNo" @change="deliveryChange" /></a-col>
          </a-row>
        </a-col>
      </a-row>
      <div class="text-center m-t-20">
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { deliveryAdd } from '@/api/manage'
let lodash = require('lodash')
export default {
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      confirmLoading:false,
      title:"新建订单",
      deliverList:[],
      detail:{
        inventoryId:null,
        inventoryNo:null,
        inventoryName:null,
        inventoryNumber:null,
        norms:null,
        inventoryUnit:null,
      },
      orderDetail:{orderNo:null},
      detailId : null,
      deliveryNumber:1,
      deliveryNo:null
    }
  },
  created() {
  },

  methods: {
    add(data = null,type = null,orderDetail=null) {
      this.deliverList = [];
      if(type == 1){
        data.forEach(element => {
          element.deliveryNumber = 1;
          element.deliveryNo = null;
          this.deliverList.push(element)
        });
      } else {
        data.deliveryNumber = 1;
        data.deliveryNo = null;
        this.deliverList.push(data);
      }
      this.orderDetail = orderDetail;
      this.deliverChange(this.deliverList[0])
      this.visible = true;
    },
    handleCancel(){
      this.visible = false;
    },
    handleOk(){
      this.visible = false;
    },
    deleteInven(record){

    },
    //提交
    handleSubmit () {
      if(!this.deliverList.every(item => item.deliveryNumber != null)){
        this.$notification.warning({message: '存在未输入交货数量的清单!'});
        return;
      }
      if(!this.deliverList.every(item => item.deliveryNo != null)){
        this.$notification.warning({message: '存在未输入运单号的清单!'});
        return;
      }
      let param = {
        deliveries:[]
      }
      this.deliverList.forEach((item) => {
        let data = {
          inventoryId:item.inventoryId,
          deliveryNumber:item.deliveryNumber,
          deliveryNo:item.deliveryNo,
        }
        param.deliveries.push(data);
      })
      deliveryAdd(Object.assign(param)).then(res => {
        if (res.state == 1) {
          this.$notification.success({message: '成功'});
          this.$emit('ok', null);
          this.visible = false;
        }else{
          this.$notification.error({message: '失败'});
        }
      })
    },
    //清单选择变化
    deliverChange(item){
      this.detailId = item.inventoryId;
      this.detail = item;
      this.deliveryNo = item.deliveryNo;
      this.deliveryNumber = item.deliveryNumber;
    },
    //交货信息变化
    deliveryChange(){
      this.deliverList.forEach((item) => {
        if(item.inventoryId == this.detailId){
          item.deliveryNo = this.deliveryNo;
          item.deliveryNumber = this.deliveryNumber;
        }
      })
    },
    deliveDelete(item,index){
      this.deliverList.splice(index,1);
      if(item.inventoryId == this.detailId){
        if(this.deliverList[index]){
          this.deliverChange(this.deliverList[index])
        }else{
          this.deliverChange(this.deliverList[index-1])
        }
      }
    }
  },
  // 过滤器
  filters: {
  }
}
</script>
<style lang="less" scoped>
.deliver{
  .l-h-45{
    line-height: 45px;
  }
  .delive{
    height: 300px;
    padding-right: 20px;
    border-right: 1px solid rgba(0, 0, 0, 0.6);
  }
  .delive-list{
    height: 300px;
    overflow: auto;
    border: 1px solid rgba(0, 0, 0, 0.8);
    &-item{
      cursor:pointer;
      border-bottom: 1px solid rgba(0, 0, 0, 0.8);
      line-height: 40px;
      padding:0px 10px !important;
    }
    &-item:hover{
      background: rgba(0, 0, 0, 0.2);
    }
    .active{
      // background: rgba(0, 0, 0, 0.4);
      background: #FF1531;
    }
  }
}
  
</style>