<template>
<div>
  <a-card :bordered="false">
    <div class="arrange" v-if="edit">
      <div v-for="(item) of arrangeList" :key="item.id">
        <div  class="floor-item" v-if="item.surplusNumber != 0" @click="floorAdd(item)">
          <!-- <div class="close"><span class="pull-right"><a-icon type="close" @click.stop="floorDelete(i)" /></span></div> -->
          <div class="name"><h2>{{item.trayName}}</h2></div>
          <div>
            <span>托盘类型：</span>
            <span v-if="item.trayType == 1">E2</span>
            <span v-if="item.trayType == 2">600</span>
          </div>
          <div><span>单个托盘打印时间：</span></div>
          <div><span>{{item.singlePrintTime | time}}</span></div>
          <div class="num">{{item.surplusNumber}}/{{item.totalNumber}}</div>
        </div>
      </div>
      <div style="margin:0 auto" v-if="arrangeList.length == 0 || arrangeList.every(ele => ele.surplusNumber == 0)"><h2>暂无托盘</h2></div>
    </div>
    <div class="m-t-24 m-b-24">
      <router-link :to="{ name: 'ganttChart' }">
        <a-button class="m-l-8">甘特图</a-button>
      </router-link>
      <router-link :to="{ name: 'ganttList' }">
        <a-button class="m-l-8">列表</a-button>
      </router-link>
      <a-button class="m-l-8" @click="ganttEdit">
        <span v-if="!edit">编辑</span>
        <span v-if="edit">取消编辑</span>
      </a-button>
      <a-button class="m-l-8" @click="getChartList">刷新</a-button>
    </div>
    <v-gantt-chart 
    :startTime="startTime"
    :endTime="endTime"
    :cellHeight="40"
    :customGenerateBlocks="true"
    :datas="printerList">
      <template v-slot:block="{data,
                        getPositonOffset,
                        getWidthAbout2Times,
                        isInRenderingTimeRange,
                        startTimeOfRenderArea,
                        isAcrossRenderingTimeRange,
                        endTimeOfRenderArea}">
        <div
          v-for="item in data.machineQueues"
          :key="item.startTime"
          :style="{
            position:'absolute',
            left:getPositonOffset(item.startTime)+'px',
            width:getWidthAbout2Times(item.startTime,item.completeTime)+'px'
          }"
        >
        <a-tooltip>
          <template slot="title">
            <div>
              <div>托盘名称：{{item.trayName}}</div>
              <div>打印时长：{{item.singlePrintTime | time}}</div>
            </div>
          </template>
          <div 
          class="job-con"
          :class="{blue:item.state == 1,yellow:item.state == 2,green:item.state == 3}"
          v-if="isInRenderingTimeRange(item.startTime) || isAcrossRenderingTimeRange(item.startTime,item.completeTime) || isInRenderingTimeRange(item.completeTime)">
          <!-- {{item.trayName}} -->
          </div>
        </a-tooltip>
        </div>
        <div v-if="data.machineQueues.length == 0">暂无托盘</div>
      </template>
      <template v-slot:left="{data}">
        <!-- 你的行名组件 -->
        <div class="mac-item">
          <span class="mac-item-title">{{data.machineName}}</span>
          <a-dropdown v-if="edit">
            <a class="pull-right">更多<a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="queueEdir(data)">编辑</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="queueCopy(data)">应用于</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </template>
      <template v-slot:title>
        <!-- 你的表头组件 -->
        打印机任务图表
      </template>
    </v-gantt-chart>
    <div class="m-t-24 m-b-24 text-center" v-if="edit"><a-button type="primary" @click="ganttSubmit" :loading="submitLoading">保存</a-button></div>
    <a-modal
    :title="'添加队列'"
    :width="600"
    :visible="arrangeEdit"
    @cancel="arrangeEdit = false"
    :footer="null"
    >
    <a-card :bordered="false" :body-style="{padding: '20px 20px 20px'}">
        <a-row :gutter="24" class="l-h-60">
          <a-col :span="6">选择打印机：</a-col>
          <a-col :span="18">
            <a-select v-model="arrange.machineId" :style="{width:'100%'}" placeholder="请选择打印机">
              <a-select-option v-for="(data) of printerList" :key="data.machineId" :value="data.machineId">{{data.machineName}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6" v-if="arrType == 1">数量：</a-col>
          <a-col :span="18" v-if="arrType == 1">
            <a-input-number 
            :min="1" 
            :max="arrangeDetail.totalNumber"
            style="width:100%;"
            v-model="arrange.number" 
          />
          </a-col>
        </a-row>
        <div class="text-center m-t-20">
          <a-button type="primary" @click="queueAdd()">确定</a-button>
        </div>
      </a-card>
    </a-modal>
    <a-modal
    :title="'打印机队列'"
    :width="600"
    :visible="printerEdit"
    @cancel="printerEdit = false"
    :footer="null"
    >
    <a-card :bordered="false" :body-style="{padding: '20px 20px 20px'}">
        <a-row :gutter="24" class="l-h-60">
          <a-col :span="6">打印机名称：</a-col>
          <a-col :span="18"><span>{{printerDetail.machineName}}</span></a-col>
          <a-col :span="24">打印机队列：</a-col>
        </a-row>
        <div class="quequ-item queue-title">
          <span class="name">托盘名称</span>
          <span>预计打印时长</span>
          <span class="option">操作</span>
        </div>
        <div class="quequ-item text-center" v-if="printerDetail.machineQueues.length == 0">
          <span>暂无托盘</span>
        </div>
        <div>
          <draggable v-model="printerDetail.machineQueues" @update="datadragEnd" :options="{animation:500}">
            <transition-group>
              <div class="quequ-item" :class="{disnone:item.state !=1}" style="cursor: all-scroll;" v-for="(item,index) of printerDetail.machineQueues" :key="item.startTime">
                <span class="name">{{item.trayName}}</span>
                <span>{{item.singlePrintTime | time}}</span>
                <span class="option" @click="machiQueuesDelete(item,index)" v-if="item.state == 1"><a>删除</a></span>
              </div>
              </transition-group>
          </draggable>
        </div>
        
        <div class="text-center m-t-20">
          <a-button type="primary" @click="queueChange()">确定</a-button>
        </div>
      </a-card>
    </a-modal>
  </a-card>
</div>
</template>

<script>

import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { machineTrayList,machineQueuePage,getGanttCharts,machineGetMachines } from '@/api/manage'
import Vue from 'vue'
import vGanttChart from 'v-gantt-chart';
import draggable from 'vuedraggable'
Vue.use(vGanttChart);

export default {
  name: 'ganttChart',
  components: {
    STable,
    Ellipsis,
    draggable
  },
  data() {
    return {
      //托盘列表
      arrangeList:[],
      printerList:[],//gantt数据
      startTime: new Date("2020-01-01 00:00"),//时间轴开始时间
      endTime: new Date("2020-01-07 23:59"), //时间结束时间
      edit:false,
      arrangeEdit:false,
      arrange:{
        machineId:undefined,
        number:1,
      },
      arrType:1,
      arrangeDetail:{
        totalNumber:null,
        singlePrintTime:null,
        singlePrintTimeSecond:null
      },
      printerEdit:false,
      printerDetail:{
        machineName:null,
        machineQueues:[],
      },
      machineQueuesDelList:[],//伪删除队列
      queuesDelList:[],//实际删除队列
      submitLoading:false,//提交loading
    }
  },
  filters: {
  },
  created() {
    this.getChartList();
  },
  methods: {
    //甘特图列表
    getChartList(){
      getGanttCharts(Object.assign({})).then(res => {
        if (res.state == 1) {
          this.startTime = res.data.startTime;
          this.endTime = res.data.endTime;
          this.printerList = res.data.machines;
        }else{
          this.$notification.error({message: '失败'});
        }
      })
    },
    //托盘列表
    getTrayList(){
      machineTrayList(Object.assign({})).then(res => {
        if (res.state == 1) {
          this.arrangeList = res.data;
          this.edit = true;
        }else{
          this.$notification.error({message: '失败'});
        }
      })
    },
    //托盘添加至机器
    floorAdd(data){
      this.arrangeEdit = true;
      this.arrType = 1;
      this.arrangeDetail = data;
    },
    queueAdd(){
      if(this.arrType == 1){
        this.printerList.forEach(item => {
          if(item.machineId == this.arrange.machineId){
            for(let i = 0;i<this.arrange.number;i++){
              let data = JSON.parse(JSON.stringify(this.arrangeDetail))
              data.state = 1;//队列状态(0暂停,1等待,2打印中,3已完成)
              let time = null;
              if(item.machineQueues.length > 0){
                time = item.machineQueues[item.machineQueues.length-1].completeTime
              }
              data.startTime = this.getStartTime(time)
              data.completeTime = this.getCompleteTime(data)
              item.machineQueues.push(data);
              this.arrangeDetail.surplusNumber -=1;
            }
          }
        })
      }else{
        this.printerDetail.machineQueues.forEach(ele => {
          this.arrangeList.forEach(arr => {
            if(ele.trayId == arr.trayId && arr.surplusNumber > 0){
              this.printerList.forEach(item => {
                if(item.machineId == this.arrange.machineId){
                  let data = JSON.parse(JSON.stringify(arr))
                  data.state = 1;//队列状态(0暂停,1等待,2打印中,3已完成)
                  let time = null;
                  if(item.machineQueues.length > 0){
                    time = item.machineQueues[item.machineQueues.length-1].completeTime
                  }
                  data.startTime = this.getStartTime(time)
                  data.completeTime = this.getCompleteTime(data)
                  item.machineQueues.push(data);
                  arr.surplusNumber -=1;
                }
              })
            }
          })
          
        })
      }
      this.arrangeEdit = false;
    },
    //任务队列修改
    queueEdir(data,index){
      this.printerDetail = JSON.parse(JSON.stringify(data));
      this.machineQueuesDelList = [];
      this.printerEdit = true;
    },
    //应用于
    queueCopy(data){
      this.printerDetail = JSON.parse(JSON.stringify(data));
      this.arrType = 2;
      this.arrangeEdit = true;
    },
    //队列删除
    machiQueuesDelete(data,index){
      if(data.queueId){
        this.queuesDelList.push(data);
      }
      this.machineQueuesDelList.push(data);
      this.printerDetail.machineQueues.splice(index,1);

    },
    //队列改变
    queueChange(){
      this.machineQueuesDelList.forEach(item => {
        this.arrangeList.forEach(ele => {
          if(item.trayId == ele.trayId){
            ele.surplusNumber +=1;
          }
        })
        if(this.arrangeList.every(ele => ele.trayId != item.trayId)){
          this.arrangeList.push({
            trayId:item.trayId,
            totalNumber:item.totalNumber,
            surplusNumber:1,
            trayName:item.trayName,
            singlePrintTime:item.singlePrintTime,
            trayFileId:item.trayFileId,
            trayType:item.trayType
          })
        }
      })
      this.printerDetail.machineQueues.forEach((item,index) => {
        if(item.state == 1){
          if(index>0){
            item.startTime = this.getStartTime(this.printerDetail.machineQueues[index-1].completeTime)
          }else{
            item.startTime = this.getStartTime()
          }
          item.completeTime = this.getCompleteTime(item)
        }
      })
      this.printerList.forEach(item => {
        if(item.machineId == this.printerDetail.machineId){
          item.machineQueues = this.printerDetail.machineQueues;
        }
      })
      this.printerEdit = false;
    },
    //编辑模式
    ganttEdit(){
      if(this.edit){
        this.edit = false;
        this.getChartList();
      }else{
        this.getTrayList();
      }
    },
    //拖拽结束
    datadragEnd() {

    },
    //队列保存
    ganttSubmit(){
      if(this.submitLoading) return;
      this.submitLoading = true;
      let param = {
        delQueueIds:[],
        machineTrays:[],
        machines:[],
      }
      this.queuesDelList.forEach(item => {
        param.delQueueIds.push(item.queueId);
      })
      this.arrangeList.forEach(item => {
        param.machineTrays.push({trayId:item.trayId,totalNumber:item.totalNumber,surplusNumber:item.surplusNumber})
      })
      this.printerList.forEach(item => {
        let data = [];
        item.machineQueues.forEach(ele => {
          data.push({queueId:ele.queueId,machineId:item.machineId,trayId:ele.trayId,trayFileId:ele.trayFileId,state:ele.state})
        })
        param.machines.push({machineId:item.machineId,machineQueues:data})
      })
      machineGetMachines(Object.assign(param)).then(res => {
        this.submitLoading = false;
        if (res.state == 1) {
          this.edit = false;
          this.getChartList();
        }else{
          this.$notification.error({message: '失败'});
        }
      })
    },
    //开始时间计算
    getStartTime(time=null){
      let startTime;
      if(time == null){
        startTime = moment().valueOf();
      }else{
        let nowTime = moment().valueOf();
        let dataTime = moment(time).valueOf();
        if(dataTime < nowTime){
          startTime = nowTime;//预计开始时间
        }else{
          startTime = dataTime;//预计开始时间
        }
      }
      let startTime1 = moment(startTime).hours(9).minutes(0).milliseconds(0).valueOf();//预计开始时间的当天9点
      let startTime2 = moment(startTime).hours(19).minutes(0).milliseconds(0).valueOf();//预计开始时间的当天18点
      let startTime3 = moment(startTime).add(1,'d').hours(9).minutes(0).milliseconds(0).valueOf();//预计开始时间的明天9点
      if(startTime < startTime1){
        return moment(startTime1).format("YYYY-MM-DD HH:mm:ss")
      }else if(startTime < startTime2){
        return moment(startTime).format("YYYY-MM-DD HH:mm:ss")
      }else{
        return moment(startTime3).format("YYYY-MM-DD HH:mm:ss")
      }
    },
    //结束时间计算
    getCompleteTime(data){
      let time = data.singlePrintTime *1000;//文件打印时长
      if(!time){
        time = data.singlePrintTimeSecond *1000;
      }
      let start = moment(data.startTime).valueOf();//文件开始打印时间
      let completeTime = moment(start + time).valueOf();//预计结束时间
      return moment(completeTime).format("YYYY-MM-DD HH:mm:ss")
    }
  }
}
</script>
<style lang="less">
  .blue{
    background: rgb(64, 130, 193) !important;
  }
  .yellow{
    background: rgb(237, 175, 103) !important;
  }
  .green{
    background: rgb(84, 176, 149) !important;
  }
  .arrange{
    padding: 24px 0px;
    display: flex;
    overflow-y: hidden;
    overflow-x: auto;
    .floor-item{
      flex-shrink: 0;
      cursor: pointer;
      width: 200px;
      margin-right: 24px;
      display: inline-block;
      border: 1px solid #17171F;
      background: #2C2C3A;
      text-align: center;
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
      .num{
        margin: 10px 0px 24px;
      }
    }
  }
  .gantt-header,.gantt-chart,.gantt-leftbar-wrapper{
    background: #2C2C3A !important;
    outline: 1px solid #999 !important;
  }
  .gantt-leftbar,.gantt-header-title,.gantt-header-timeline,.gantt-chart{
    background: #2C2C3A !important;
    outline: 1px solid #999 !important;
  }
  .job-con{
    border-radius:30px;
    line-height: 25px;
    height: 25px;
    text-align: center;
    overflow: hidden;
    background: #999;
    margin-top: 8px;
  }
  .mac-item{
    line-height: 38px;
    padding: 0 20px;
    border-bottom: 2px solid #666;
    .mac-item-title{
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
      font-size: 16px;
    }
  }
  .quequ-item{
    line-height: 40px;
    background: rgba(0, 0, 0, 0.4);
    padding: 0 20px;
    border: 1px solid rgba(0,0,0,0.8);
    border-bottom: none;
    .name{
      width: 260px;
      display: inline-block;
      padding-right: 20px;
    }
    .option{
      float: right;
    }
  }
  .quequ-item:last-child{
    border-bottom: 1px solid rgba(0,0,0,0.8);
  }
  .quequ-item:hover{
    background: rgba(0, 0, 0, 0.6)
  }
  .disnone{
    display: none;
  }
  .queue-title{
    background: rgba(0, 0, 0, 0.6);
    font-weight: bold;
    color: #fff;
  }
</style>
