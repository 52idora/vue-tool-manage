<template>
<a-card :bordered="false" :body-style="{padding: '0'}">
  <a-modal
  :title="'托盘信息'"
  :width="600"
  :visible="visible"
  @cancel="handleCancel"
  :footer="null"
  >
  <a-card :bordered="false" :body-style="{padding: '20px 20px 20px'}">
      <a-row :gutter="24" class="l-h-60">
        <a-col :span="6">托盘名称：</a-col>
        <a-col :span="18">
          <a-input v-model="floor.trayName" @change="nameChange" :maxLength="100"/>
          <span v-if="isName" class="red">请输入托盘名称</span>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="l-h-60">
        <a-col :span="6">托盘类型：</a-col>
        <a-col :span="18">
          <a-radio-group v-model="floor.trayType">
            <a-radio :value="1">E2：330*240*240</a-radio>
            <a-radio :value="2">600：650*650*150</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <div class="text-center m-t-20">
        <a-button type="primary" @click="floorAdd()">保存</a-button>
      </div>
    </a-card>
  </a-modal>
</a-card>
</template>

<script>
import { STable } from '@/components'
let lodash = require('lodash')
export default {
  components: {
    STable
  },
  data() {
    return {
      //新建托盘
      visible:false,
      floor:{
        trayType:1,
        trayName:null,
        totalNumber:1,
        singlePrintTime:null,
        trayFiles:[],
      },
      isName:false
    }
  },
  created() {
  },

  methods: {
    //添加托盘弹框
    handleCancel(){
      this.visible = false;
    },
    //增加托盘
    floorNew(){
      this.floor = {
        trayType:1,
        trayName:null,
        totalNumber:1,
        singlePrintTime:null,
        trayFiles:[],
      }
      this.visible = true;
      this.isName = false;
    },
    floorAdd(){
      if(this.floor.trayName){
        this.$emit('floorNew',this.floor)
        this.visible = false;
      }else{
        this.isName = true;
      }
    },
    nameChange(){
      if(this.floor.trayName == null){
        this.isName = true;
      }else{
        this.isName = false;
      }
    }
  },
  // 过滤器
  filters: {
  }
}
</script>
<style lang="less" scoped>
  .l-h-60{
    line-height: 60px;
  }
</style>