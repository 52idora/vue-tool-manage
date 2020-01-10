<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    okText="保存"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-card :bordered="false" :body-style="{padding: '0px 20px'}">
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4"><h3>订单信息</h3></a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4">关联订单：</a-col>
        <a-col :span="8">{{detail.orderNo}}</a-col>
        <a-col :span="4">交付时间：</a-col>
        <a-col :span="8">{{detail.deliveryTime | date("YYYY-MM-DD")}}</a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4">客户：</a-col>
        <a-col :span="8">{{detail.client}}</a-col>
        <a-col :span="4">剩余日期：</a-col>
        <a-col :span="8">{{detail.deliveryDays}}天</a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4">超期天数：</a-col>
        <a-col :span="8">{{detail.extendedDays}}天</a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4"><h3>清单信息</h3></a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4">清单名称：</a-col>
        <a-col :span="8">
          <a-input v-if="view == 2" v-model="inventoryName" :maxLength="100" />
          <span v-if="view == 1">{{inventoryName}}</span>
        </a-col>
        <a-col :span="4">清单编号：</a-col>
        <a-col :span="8">
          <span>{{inventoryNo || '--'}}</span>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4">需求数量：</a-col>
        <a-col :span="8">
          <a-input-number
          v-if="view == 2" 
          :min="0" 
          :max="100"
          v-model="inventoryNumber"
          />
          <!-- <a-select :defaultValue="1" v-model="inventoryUnit" @change="inventoryUnitChange" :style="{marginLeft:'10px'}">
            <a-select-option :value="1">套</a-select-option>
            <a-select-option :value="2">个</a-select-option>
          </a-select> -->
          <span v-if="view == 1">{{inventoryNumber}}</span>
          <span v-if="inventoryUnit == 1" class="m-l-10">套</span>
          <span v-if="inventoryUnit == 2" class="m-l-10">个</span>
        </a-col>
        <a-col :span="4">规格：</a-col>
        <a-col :span="8">
          <a-input v-if="view == 2" v-model="norms" :maxLength="20" />
          <span v-if="view == 1">{{norms}}</span>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-45">
        <a-col :span="4"><h3>生产文件</h3></a-col>
        <a-col :span="20" v-if="inventoryUnit == 1">
          <a-row :gutter="24" class="l-h-45"  v-if="view == 2">
            <a-col :span="4"><span>关联配套</span></a-col>
            <a-col :span="6">
              <a-select v-model="projectId" placeholder="请选择项目" @change="projectIdChange" :style="{marginLeft:'10px',width:'100%'}">
                <a-select-option v-for="data of projectList" :key="data.id" :value="data.projectId">{{data.title}}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-select v-model="dirId" placeholder="请选择文件夹" @change="dirIdChange" :style="{marginLeft:'10px',width:'100%'}">
                <a-select-option v-for="data of dirList" :key="data.id" :value="data.dirId">{{data.title}}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-select v-model="setId" placeholder="请选择配套" @change="setIdChange" :style="{marginLeft:'10px',width:'100%'}">
                <a-select-option v-for="data of setList" :key="data.id" :value="data.setId">{{data.title}}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row :gutter="24" class="l-h-45"  v-if="view == 1">
            <a-col :span="4"><span>关联配套</span></a-col>
            <a-col :span="20"><span>{{productName}}</span></a-col>
          </a-row>
        </a-col>
        <a-col :span="20" v-if="inventoryUnit == 2 && view == 2"><a-button @click="$refs.fileSelect.add()">选择文件</a-button></a-col>
      </a-row>
      <div class="file-list">
      <a-table
      :columns="columns"
      rowKey="index"
      :pagination="false"
      :dataSource="fileList">
        <span slot="fileSize" slot-scope="text">{{text | FileSize}}</span>
        <span slot="printTime" slot-scope="text">{{text | time}}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="deleteInven(record)"  v-if="view == 2">删除</a>
          </template>
        </span>
      </a-table>
      </div>
      <div class="text-center m-t-20">
        <a-button type="primary" @click="handleSubmit" :loading="isSubmit"  v-if="view == 2">保存</a-button>
      </div>
      <file-select ref="fileSelect" @fileOk="fileSubmit" />
    </a-card>
  </a-modal>
</template>

<script>
import Vue from 'vue'
import { STable } from '@/components'
import fileSelect from './fileSelect'
import { 
  projectGetProjects,
  getProjectDirsList,
  projectDirSetList,
  projectFiletList,
  inventorySave,
  inventoryEdit,
  ordersInventoryFind
  } from '@/api/manage'
let lodash = require('lodash')
const columns1 = [
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
  }
];
const columns2 = [
  {
    title: '文件名',
    dataIndex: 'fileName',
  },
  {
    title: '项目',
    dataIndex: 'projectTitle',
  },
  {
    title: '文件夹',
    dataIndex: 'dirTitle',
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
  name: 'inventoryNew',
  components: {
    STable,
    fileSelect
  },
  data() {
    return {
      visible: false,
      confirmLoading:false,
      isSubmit : false,
      title:"新建订单",
      inventoryUnit:1,//是否配套
      //列表
      columns:columns1,
      fileList : [],
      inventoryId:null,
      projectId:undefined,//项目ID
      projectList:[],//项目列表
      dirId:undefined,//文件夹
      dirList:[],
      setId:undefined,//配套
      setList:[],
      detail:{
        orderId: null,
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
      inventoryNo:null,
      inventoryName:null,
      inventoryNumber:null,
      view:1,
      productName:"null",
      norms:null,
      isCustom:false,
    }
  },
  created() {
  },

  methods: {
    add(detail = null,record = null,type=null,view=null) {
      //type:1为套2为个且自定义 view:1详情2编辑
      this.detail = detail;
      this.getProjectList();
      if(record == null){
        this.view = 2
        this.title = '新建清单';
        this.inventoryNo = null;
        this.inventoryId = null;
        this.inventoryUnit = type;
        this.inventoryName = null;
        this.inventoryNumber = null;
        this.norms = null;
        this.projectId = undefined;
        this.dirId = undefined;
        this.dirList = [];
        this.setId = undefined;
        this.setList = [];
        this.visible = true;
        this.fileList = [];
        if(type == 2){
          this.isCustom = true;
        }else{
          this.isCustom = false;
        }
      } else {
        if(view == 1){
          this.view = 1
          this.title = '清单详情';
        }else{
          this.view = 2
          this.title = '修改清单';
        }
        this.inventoryNo = record.inventoryNo;
        this.inventoryId = record.inventoryId;
        this.inventoryName = record.inventoryName;
        this.inventoryNumber = record.inventoryNumber;
        this.inventoryUnit = record.inventoryUnit;
        this.norms = record.norms;
        this.isCustom = record.isCustom;
        if(this.inventoryUnit == 1){
          if(this.view == 1){
            this.getInventoryDetail();
          }else{
            this.projectId = record.projectId;
            this.dirId = record.dirId;
            this.setId = record.setId;
            this.projectIdChange(1);
            this.dirIdChange(1);
            this.setIdChange();
          }
          this.columns = columns1;
        }else{
          this.columns = columns2;
          this.getInventoryDetail();
        }
        this.visible = true;
      }
    },
    handleCancel(){
      this.visible = false;
    },
    handleOk(){
      this.visible = false;
    },
    //提交
    handleSubmit () {
      let that = this;
      if(!this.inventoryName){
        this.$notification.warning({message: '未输入清单名称'});
        return;
      }
      if(!this.inventoryNumber){
        this.$notification.warning({message: '未输入需求数量'});
        return;
      }
      if(!this.norms){
        this.$notification.warning({message: '未输入清单规格'});
        return;
      }
      if(this.fileList.length == 0){
        this.$notification.warning({message: '未选择任何文件'});
        return;
      }
      let param = {
        orderId:this.detail.orderId,
        inventoryName:this.inventoryName,
        inventoryNumber:this.inventoryNumber,
        inventoryUnit:this.inventoryUnit,
        norms:this.norms
      }
      if(this.inventoryUnit == 1){
        param.projectId = this.projectId;
        param.dirId = this.dirId;
        param.setId = this.setId;
        param.isCustom = false;
      }else{
        param.inventoryFile = {
          projectId:this.fileList[0].projectId,
          dirId:this.fileList[0].dirId,
          fileId:this.fileList[0].fileId
        }
        param.isCustom = true;
      }
      if(this.isSubmit) return;
      this.isSubmit = true;
      if(this.title == "新建清单"){
        inventorySave(Object.assign(param)).then(res => {
          if (res.state == 1) {
            this.$notification.success({message: '成功'});
            this.$emit('ok', null);
            this.visible = false;
          }else{
            that.$notification.error({message: '失败'});
          }
          this.isSubmit = false;
        })
      }else{
        inventoryEdit(Object.assign(param,{inventoryId:this.inventoryId})).then(res => {
          if (res.state == 1) {
            this.$notification.success({message: '成功'});
            this.$emit('ok', null);
            this.visible = false;
          }else{
            that.$notification.error({message: '失败'});
          }
          this.isSubmit = false;
        })
      }
    },
    deleteInven(record){
      this.fileList = [];
    },
    fileSubmit(data){
      this.fileList = data;
    },
    //是否配套选择
    inventoryUnitChange(){
      if(this.inventoryUnit == 1){
        this.columns = columns1;
        this.projectId=undefined;
        this.dirId=undefined;
        this.dirList=[];
        this.setId=undefined;
        this.setList=[];
        this.fileList = [];
      }else{
        this.columns = columns2;
        this.fileList = [];
      }
    },
    //项目列表
    getProjectList(){
      projectGetProjects(Object.assign({})).then(res => {
        if (res.state == 1) {
          this.projectList = res.data;
        }else{
          this.$notification.error({message: '项目列表获取失败'});
        }
      })
    },
    //项目选择获取文件夹列表
    projectIdChange(type = null){
      if(type != 1){
        this.dirId = undefined;
        this.setList = [];
        this.setId = undefined;
        this.fileList = [];
      }
      getProjectDirsList(Object.assign({projectId:this.projectId})).then(res => {
        if (res.state == 1) {
          this.dirList = res.data;
        }else{
          this.$notification.error({message: '文件夹列表获取失败'});
        }
      })
    },
    // 文件夹选择获取配套列表
    dirIdChange(type = null){
      if(type != 1){
        this.setId = undefined;
        this.fileList = [];
      }
      projectDirSetList(Object.assign({dirId:this.dirId})).then(res => {
        if (res.state == 1) {
          this.setList = res.data;
        }else{
          this.$notification.error({message: '配套列表获取失败'});
        }
      })
    },
    //配套选择获取配套文件列表
    setIdChange(){
      projectFiletList(Object.assign({setId:this.setId})).then(res => {
        if (res.state == 1) {
          this.fileList = res.data;
        }else{
          this.$notification.error({message: '配套文件列表获取失败'});
        }
      })
    },
    getInventoryDetail(){
      ordersInventoryFind(Object.assign({inventoryId:this.inventoryId})).then(res => {
        if (res.state == 1) {
          this.fileList = res.data.inventoryFiles;
          this.productName = res.data.projectTitle +'-'+ res.data.dirTitle +'-'+ res.data.setTitle
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