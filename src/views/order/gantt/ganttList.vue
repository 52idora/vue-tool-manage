<template>
<div>
  <a-card :bordered="false">
    <div class="m-t-24 m-b-24">
      <router-link :to="{ name: 'ganttChart' }">
        <a-button class="m-l-8">甘特图</a-button>
      </router-link>
      <router-link :to="{ name: 'ganttList' }">
        <a-button class="m-l-8">列表</a-button>
      </router-link>
      <a-button class="m-l-8" @click="printerStop(null)">全部停止打印</a-button>
      <a-button class="m-l-8" @click="getMacList">刷新</a-button>
    </div>
    <a-table
    rowKey="machineId"
    :columns="printerColumns"
    :pagination="false"
    :dataSource="printerList">
      <span slot="trayCount" slot-scope="text,record">
        <template>
          <span>{{record.completedTrayCount}}</span>/
          <span>{{text}}</span>
        </template>
      </span>
      <span slot="expectCompletedTime" slot-scope="text">
        <template>
          <span>{{text | date("YYYY-MM-DD HH:mm:ss")}}</span>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="printerStop(record)">停止打印</a>
        </template>
      </span>
      <a-table
      rowKey="queueId"
      slot="expandedRowRender"
      slot-scope="record"
      :columns="columns"
      :pagination="false"
      :dataSource="record.machineQueues">
        <span slot="action" slot-scope="texts, records">
          <template>
            <!-- (0暂停,1等待,2打印中,3已完成) -->
            <a v-if="records.state == 0" @click="changeState(records,1)">继续</a>
            <a v-if="records.state == 1" @click="changeState(records,0)">挂起</a>
            <span v-if="records.state == 2">打印中</span>
            <span v-if="records.state == 3">已完成</span>
          </template>
        </span>
        <span slot="trayType" slot-scope="texts">
          <template>
            <span v-if="texts == 1">E2</span>
            <span v-if="texts == 2">600</span>
          </template>
        </span>
        <span slot="singlePrintTime" slot-scope="texts">
          <template>
            <span>{{texts | time}}</span>
          </template>
        </span>
      </a-table>
    </a-table>
  </a-card>
</div>
</template>

<script>
const columns = [
        {
          title: '托盘名称',
          dataIndex: 'trayName',
        },
        {
          title: '托盘类型',
          dataIndex: 'trayType',
          scopedSlots: { customRender: 'trayType' }
        },
        {
          title: '预计打印时间',
          dataIndex: 'singlePrintTime',
          scopedSlots: { customRender: 'singlePrintTime' }
        },
        {
          title: '托盘数量',
          dataIndex: 'totalNumber',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
const printerColumns = [
        {
          title: '机器名字',
          dataIndex: 'machineName',
        },
        {
          title: '机器编号',
          dataIndex: 'machineNum',
        },
        {
          title: '机器型号',
          dataIndex: 'machineType',
        },
        {
          title: '托盘数量',
          dataIndex: 'trayCount',
          scopedSlots: { customRender: 'trayCount' }
        },
        {
          title: '预计完成时间',
          dataIndex: 'expectCompletedTime',
          scopedSlots: { customRender: 'expectCompletedTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ];
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { machineMacList,machineQueuePage,machineQueueStopPrint,machineQueueChangeState } from '@/api/manage'

export default {
  name: 'ganttChart',
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      // 表头
      columns,
      printerColumns,
      //托盘列表
      printerList:[]
    }
  },
  filters: {
  },
  created() {
    this.getMacList();
  },
  methods: {
    //机器列表
    getMacList(){
      machineQueuePage(Object.assign({current:1,size:999999})).then(res => {
        if (res.state == 1) {
          this.printerList = res.data.records;
        }
      })
    },
    //停止打印
    printerStop(data = null){
      let param = {};
      if(data){
        param.stopType = 1
        param.machineId = data.machineId
      }else{
        param.stopType = 2
      }
      machineQueueStopPrint(Object.assign(param)).then(res => {
        if (res.state == 1) {
          this.getMacList();
          this.$notification.success({message: '成功'});
        }
      })
    },
    //暂停继续
    changeState(data,type){
      machineQueueChangeState(Object.assign({queueId:data.queueId,state:type})).then(res => {
        if (res.state == 1) {
          this.getMacList();
          this.$notification.success({message: '成功'});
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
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
        margin: 40px 0 20px;
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
</style>
