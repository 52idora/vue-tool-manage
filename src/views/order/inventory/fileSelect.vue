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
        <a-col :span="4"><h3>选择项目</h3></a-col>
        <a-col :span="8">
          <a-select v-model="projectId" placeholder="请选择项目" @change="projectIdChange" :style="{marginLeft:'10px',width:'100%'}">
            <a-select-option v-for="data of projectList" :key="data.id" :value="data.projectId">{{data.title}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <a-select v-model="dirId" placeholder="请选择文件夹" @change="dirIdChange" :style="{marginLeft:'10px',width:'100%'}">
            <a-select-option v-for="data of dirList" :key="data.id" :value="data.dirId">{{data.title}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <div class="file-list">
      <a-table
      :columns="columns"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio'}"
      rowKey="id"
      :pagination="false"
      :dataSource="fileList">
        <span slot="fileSize" slot-scope="text">{{text | FileSize}}</span>
        <span slot="printTime" slot-scope="text">{{text | time}}</span>
      </a-table>
      </div>
      <div class="text-center m-t-20">
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { 
  projectGetProjects,
  getProjectDirsList,
  getFileApprovalsList,
  } from '@/api/manage'
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
  }
];
export default {
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      confirmLoading:false,
      title:"选择文件",
      form: this.$form.createForm(this),
      inventoryUnit:1,
      //列表
      columns,
      fileList : [],
      projectId:undefined,//项目ID
      projectList:[],//项目列表
      dirId:undefined,//文件夹
      dirList:[],
      selectedRowKeys:[],
      selectedRows: []
    }
  },
  created() {
  },

  methods: {
    add(projectList = null) {
      this.getProjectList();
      this.title = '选择文件';
      this.visible = true;
    },
    handleCancel(){
      this.visible = false;
    },
    handleSubmit () {
      if(this.selectedRows.length == 0){
        this.$notification.warning({message: '未选择任何文件'});
      }else{
        this.visible = false;
        this.$emit('fileOk', this.selectedRows);
      }
    },
    onSelectChange(selectedRowKeys,selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    //项目列表
    getProjectList(){
      let that = this;
      projectGetProjects(Object.assign({})).then(res => {
        if (res.state == 1) {
          that.projectList = res.data;
        }else{
          that.$notification.error({message: '项目列表获取失败'});
        }
      })
    },
    //项目选择获取文件夹列表
    projectIdChange(){
      let that = this;
      this.dirId = undefined;
      this.fileList = [];
      getProjectDirsList(Object.assign({projectId:this.projectId})).then(res => {
        if (res.state == 1) {
          that.dirList = res.data;
        }else{
          that.$notification.error({message: '文件夹列表获取失败'});
        }
      })
    },
    // 文件夹选择获取文件列表
    dirIdChange(){
      let that = this;
      getFileApprovalsList(Object.assign({projectId:this.projectId,dirId:this.dirId})).then(res => {
        if (res.state == 1) {
          that.fileList = res.data;
        }else{
          that.$notification.error({message: '文件列表获取失败'});
        }
      })
    },
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