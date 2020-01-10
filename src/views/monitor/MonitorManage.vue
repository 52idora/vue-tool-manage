<template>
  <div class="machine-monitor">
    <div class="top">
      <a-row>
        <a-col :span="12" class="b-r-1">
          <div class="m-b-10">日计划</div>
          <span>{{printerData.practiceTotal}}</span>&nbsp;/&nbsp;
          <span>{{printerData.planningTotal}}</span>&nbsp;盘
          <div class="m-t-10">
            <span>{{printerData.startTime}}</span>&nbsp;~&nbsp;
            <span>{{printerData.endTime}}</span>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="m-b-10">验收情况</div>
          <span>{{printerData.acceptanceTotal2}}</span>&nbsp;/&nbsp;
          <span>{{printerData.acceptanceTotal}}</span>&nbsp;套
          <div class="m-t-10">
            <span>{{printerData.startTime}}</span>&nbsp;~&nbsp;
            <span>{{printerData.endTime}}</span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="machine">
      <a-row :gutter="24">
        <a-col v-for="(item, index) in printerData.machines" :key="index" :span="currentColumn">
          <div class="machine-list" :class="item.machineState">
            <div class="m-b-10 machine-num">
              <span>机器编号:</span>
              <span class="flex">{{item.machineNum}}</span>
            </div>
            <div class="m-b-10 machine-type">
              <span>机器型号:</span>
              <span class="flex">{{item.machineType}}</span>
            </div>
            <div class="m-b-10 machine-num">
              <span>机器状态:</span>
              <span class="flex">{{item.machineState}}</span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'monitorManage',
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      printerData: {},
      machines: [],
      currentColumn: 8 //打印机几列显示
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  created() {
    this.printerList()
  },
  methods: {
    printerList() {
      this.$http.post('/machine/machineBoard', { param: {} }).then(res => {
        if (res.state == 1) {
          this.printerData = res.data;
          console.log(res)
          this.machines = this.printerData.machines;
          if (this.machines.length > 16) {
            this.currentColumn = 4
          } else if (this.machines.length > 64) {
            this.currentColumn = 6
          } else {
            this.currentColumn = 8
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.b-r-1 {
  border-right: 1px solid #000;
}
.machine-monitor {
  .top {
    background: #17171f;
    text-align: center;
    padding: 20px;
    box-shadow: 0px 1px 5px 0px rgba(38, 38, 38, 0.1);
    margin-bottom: 24px;
  }
  .machine {
    .machine-list {
      text-align: center;
      padding: 20px;
      margin-bottom: 24px;
    }
    .machine-num {
      font-size: 24px;
      display: flex;
    }
    .machine-type {
      font-size: 20px;
      display: flex;
    }
  }
  .flex {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
