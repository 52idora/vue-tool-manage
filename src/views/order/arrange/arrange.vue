<template>
<a-card :bordered="false" :body-style="{padding: '0'}">
  <div class="arrange">
    <div class="delive">
      <div class="delive-list">
        <div class="delive-list-item">
          <h3>生产清单</h3>
        </div>
        <div class="delive-list-item" v-for="(item,index) of deliverList" :key="item.inventoryId" @click="deliverChange(item)" :class="{'active':item.inventoryId == detailId}">
          <span>{{item.inventoryName}}</span>
          <span class="pull-right" v-if="deliverList.length > 1"><a-icon type="close"  @click.stop="deliveDelete(item,index)" /></span>
        </div>
      </div>
    </div>
    <div style="width:100%">
      <div style="padding: 0 20px;border-bottom: 1px solid rgba(0, 0, 0, 0.6);">
        <a-row :gutter="24" class="l-h-60">
          <a-col :span="4">清单编号：{{detail.inventoryNo}}</a-col>
          <a-col :span="4">清单名称：{{detail.inventoryName}}</a-col>
          <a-col :span="4">
            <span>需求数量：</span>
            <span>{{detail.inventoryNumber}}</span>
            <span v-if="detail.inventoryUnit == 1">套</span>
            <span v-if="detail.inventoryUnit == 2">个</span>
          </a-col>
          <a-col :span="4">
            <span>已排产：</span>
            <span>{{detail.scheduledNumber}}</span>
            <span v-if="detail.inventoryUnit == 1">套</span>
            <span v-if="detail.inventoryUnit == 2">个</span>
          </a-col>
          <a-col :span="4">剩余天数：{{detail.deliveryDays}}天</a-col>
          <a-col :span="4">
            <a-button type="primary" v-if="!isFloorEdit" @click="jobNew" :loading="arrLoading">生成任务</a-button>
            <a-button class="m-l-10" @click="toOrderDetail">返回</a-button>
          </a-col>
        </a-row>
      </div>
      <div class="file-list">
        <a-table
        rowKey="index"
        :columns="columns"
        :pagination="false"
        :dataSource="fileList">
          <span slot="fileSize" slot-scope="text">
            <template>
              <span>{{text | FileSize}}</span>
            </template>
          </span>
          <span slot="printTime" slot-scope="text">
            <template>
              <span>{{text | time}}</span>
            </template>
          </span>
          <span slot="action" slot-scope="text, record" v-if="isFloorEdit">
            <template>
              <a @click="floorFileAdd(record)">添加至托盘</a>
            </template>
          </span>
        </a-table>
      </div>
      <div class="floor">
        <div v-if="!isFloorEdit">
          <a-row :gutter="24" class="l-h-60">
            <a-col :span="20"><a-button @click="$refs.arrangeNew.floorNew()">增加托盘</a-button></a-col>
            <a-col :span="4"><a-button type="primary" @click="reckon">试算</a-button></a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="4" v-for="(item,i) of floorList" :key="item.id">
              <div class="floor-item">
                <div class="curser" @click="floorEdit(item,i)">
                  <div class="close"><span class="pull-right"><a-icon type="close" @click.stop="floorDelete(i)" /></span></div>
                  <div class="name"><h2>{{item.trayName}}</h2></div>
                  <div>
                    <span>托盘类型：</span>
                    <span v-if="item.trayType == 1">E2</span>
                    <span v-if="item.trayType == 2">600</span>
                  </div>
                  <div><span>单个托盘打印时间：</span></div>
                  <div><span>{{item.singlePrintTime | time}}</span></div>
                </div>
                <div><a-input-number :min="1" :max="999999" v-model="item.totalNumber" /></div>
              </div>
            </a-col>
            <a-col :span="24" v-if="floorList.length == 0"><div class="text-center m-t-40">暂无托盘</div></a-col>
          </a-row>
        </div>
        <arrange-edit ref="arrangeEdit" @floorEditFile="floorEditFile"/>
      </div>
    </div>
    <arrange-new ref="arrangeNew" @floorNew="getFloorNew" />
    <trial ref="trial" />
    <a-modal
    :title="null"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
    :visible="arrLoading"
    :width="600"
    :footer="null"
    >
      <a-card :bordered="false" :body-style="{padding: '20px 20px 20px'}">
        <div class="box">
            <div class="loader-15"></div>
        </div>
      <div class="text-center">托盘正在生成中，此过程时间较长，请耐心等待。。。</div>
      </a-card>
    </a-modal>
  </div>
</a-card>
</template>

<script>
import { STable } from '@/components'
import arrangeNew from './arrangeNew'
import trial from './trial'
import arrangeEdit from './arrangeEdit'
import { ordersInventoryFind,machineTraySave } from '@/api/manage'
let lodash = require('lodash')

const columns = [
  {
    title: '文件名',
    dataIndex: 'fileName',
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    scopedSlots: { customRender: 'fileSize' }
  },
  {
    title: '预计打印时间',
    dataIndex: 'printTime',
    scopedSlots: { customRender: 'printTime' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
];

export default {
  name: 'arrange',
  components: {
    STable,
    arrangeNew,
    trial,
    arrangeEdit
  },
  data() {
    return {
      //列表
      columns,
      //清单选中ID
      detailId:null,
      detail:{
        inventoryNo:null,
        inventoryName:null,
        inventoryNumber:null,
        inventoryUnit:null,
      },
      // 清单列表
      deliverList:[],
      // 清单文件列表
      fileList:[],
      //新建托盘
      floor:{
        trayType:1,
        trayName:null,
        totalNumber:1,
        singlePrintTime:null,
        trayFiles:[],
      },
      //托盘列表
      floorList:[],
      //编辑托盘
      isFloorEdit:false,
      arrLoading:false, //生成托盘loading
    }
  },
  created() {
    this.deliverList = this.count;
    if(this.deliverList.length == 0){
      this.$router.push({name: 'orderList'})
    }else{
      this.deliverChange(this.deliverList[0])
    }
  },
  computed:{
    count(){
      return this.$store.state.deliverList.list;
    }
  },
  methods: {
    //返回
    toOrderDetail(){
      this.$router.push({name: 'orderDetail',query:{id:this.detail.orderId}})
    },
    //清单选择
    deliverChange(item){
      this.detailId = item.inventoryId;
      ordersInventoryFind(Object.assign({inventoryId:this.detailId})).then(res => {
        if (res.state == 1) {
          this.detail = res.data;
          this.fileList = res.data.inventoryFiles;
        }else{
          this.$notification.error({message: '失败'});
        }
      })
    },
    //清单移除
    deliveDelete(item,index){
      this.deliverList.splice(index,1);
      if(item.inventoryId == this.detailId){
        if(this.deliverList[index]){
          this.deliverChange(this.deliverList[index])
        }else{
          this.deliverChange(this.deliverList[index-1])
        }
      }
    },
    //添加托盘
    getFloorNew(data){
      this.floorList.push(data);
    },
    //删除托盘
    floorDelete(i){
      this.floorList.splice(i,1);
    },
    //托盘编辑
    floorEdit(item,i){
      this.isFloorEdit = true;
      this.$refs.arrangeEdit.add(item,i);
    },
    //托盘添加文件
    floorFileAdd(data){
      this.$refs.arrangeEdit.fileAdd(data);
    },
    //托盘编辑保存
    floorEditFile(data){
      let index = data.index;
      if(this.floorList[index]){
        this.floorList[index].singlePrintTime = data.time;
        this.floorList[index].trayFiles = data.files;
      }
      this.isFloorEdit = false;
    },
    //托盘试算
    reckon(){
      if(this.floorList.length == 0){
        this.$notification.warning({message: '请先添加托盘'});
        return;
      }
      if(!this.floorList.every(item => item.trayFiles.length > 0)){
        this.$notification.warning({message: '存在没有文件的托盘'});
        return;
      }
      let inventoryIds = [];
      this.deliverList.forEach(element => {
        inventoryIds.push(element.inventoryId)
      });
      let param = {
        machineTrays:this.floorList,
        inventoryIds:inventoryIds
      }
      this.$refs.trial.add(param);
    },
    jobNew(){
      if(this.floorList.length == 0){
        this.$notification.warning({message: '请先添加托盘'});
        return;
      }
      if(!this.floorList.every(item => item.trayFiles.length > 0)){
        this.$notification.warning({message: '存在没有文件的托盘'});
        return;
      }
      if(this.arrLoading) return;
      this.arrLoading = true;
      let inventoryIds = [];
      this.deliverList.forEach(element => {
        inventoryIds.push(element.inventoryId)
      });
      let param = {
        machineTrays:this.floorList,
        inventoryIds:inventoryIds
      }
      machineTraySave(Object.assign(param)).then(res => {
        this.arrLoading = false;
        if (res.state == 1) {
          this.$notification.success({message: '成功'});
          this.$router.push({name: 'ganttChart'})
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
  .arrange{
    position: relative;
    padding-left: 170px;
    .l-h-60{
      line-height: 60px;
    }
    .delive{
      position: absolute;
      left: 0;
      width: 170px;
      height: 100%;
      border-right: 1px solid rgba(0, 0, 0, 0.6);
      padding-right: 20px;
    }
    .delive-list{
      height: 100%;
      overflow: auto;
      border: 1px solid rgba(0, 0, 0, 0.6);
      &-item{
        cursor:pointer;
        border-bottom: 1px solid rgba(0, 0, 0, 0.6);
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
    .file-list{
      max-height: 270px;
      overflow: auto;
      border-bottom: 1px solid rgba(0, 0, 0, 0.6);
    }
    .floor{
      min-height: 400px;
      padding: 0 20px;
      .floor-item{
        border: 1px solid #17171F;
        background: #2C2C3A;
        text-align: center;
        .close{
          padding-right: 10px;
          padding-top: 5px;
        }
        .name{
          margin: 30px 0 10px;
        }
        .curser{
          cursor: pointer;
          padding-bottom: 20px;
        }
        .ant-input-number{
          width: 100%;
        }
      }
    }
    
  }
  .box {
      display: inline-block;
      width: 100%;
      font-size: 30px;
      color: rgba(200, 200, 200, 0.5);
      padding: 1em;
      text-align: center;
      margin-bottom: .25em;
      vertical-align: top;
      -webkit-transition: .3s color, .3s border;
      transition: .3s color, .3s border;
      color: #FF1531;
    }
    .box [class*="loader-"] {
        font-size: 70px;
        line-height: 200px;
    }
    [class*="loader-"] {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: inherit;
        vertical-align: middle;
        pointer-events: none;
    }
    .loader-15 {
        background: currentcolor;
        position: relative;
        -webkit-animation: loader-15 1s ease-in-out infinite;
        animation: loader-15 1s ease-in-out infinite;
        -webkit-animation-delay: 0.4s;
        animation-delay: 0.4s;
        width: .25em;
        height: .5em;
    }
    .loader-15:after,
    .loader-15:before {
        content: '';
        position: absolute;
        width: inherit;
        height: inherit;
        background: inherit;
        -webkit-animation: inherit;
        animation: inherit;
    }
    .loader-15:before {
        right: .5em;
        -webkit-animation-delay: 0.2s;
        animation-delay: 0.2s;
    }
    .loader-15:after {
        left: .5em;
        -webkit-animation-delay: 0.6s;
        animation-delay: 0.6s;
    }
    @-webkit-keyframes loader-15 {
        0%, 100% {
            box-shadow: 0 0 0 currentcolor, 0 0 0 currentcolor;
        }
        50% {
            box-shadow: 0 -.25em 0 currentcolor, 0 .25em 0 currentcolor;
        }
    }
    @keyframes loader-15 {
        0%, 100% {
            box-shadow: 0 0 0 currentcolor, 0 0 0 currentcolor;
        }
        50% {
            box-shadow: 0 -.25em 0 currentcolor, 0 .25em 0 currentcolor;
        }
    }
</style>