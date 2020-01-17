<template>
  <div class="machine-monitor">
    <div class="top">
      <a-row>
        <a-col :span="12" class="b-r-1">
          <div class="m-b-10">物品总数</div>
          <span>{{stastics.thing_count}}</span>&nbsp;件
          <div class="m-t-10">

          </div>
        </a-col>
        <a-col :span="12">
          <div class="m-b-10">会员总数</div>
          <span>{{stastics.user_count}}</span>&nbsp;人
          <div class="m-t-10">

          </div>
        </a-col>
      </a-row>
    </div>
    <div class="machine">
      <a-row :gutter="24">
        <!--<a-col v-for="(item, index) in printerData.machines" :key="index" :span="currentColumn">
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
        </a-col>-->
      </a-row>
    </div>
  </div>
</template>

<script>
import { stastic } from '@/api/thing'

export default {
  name: 'monitorManage',
  components: {
  },
  data() {
    return {
      stastics:{'thing_count':0 ,'user_count':0}
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
    this.getStastic()
  },
  methods: {
    getStastic() {
      stastic().then((res)=>{
        if(res.state == 1){
          this.stastics = res.data
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
