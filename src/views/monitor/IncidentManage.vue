<template>
  <div class="incident-monitor">
    <div class="incident">
      <a-row :gutter="24">
        <a-col v-for="(item, index) in machines" :key="index" :span="currentColumn">
          <div class="incident-list">
                <div class="incident-state" v-if="item.eventType == 0" :class="{'incident-idel':item.eventState == 0,'incident-wait':item.eventState == 1,'incident-running':item.eventState == 2,'incident-complete':item.eventState == 3}">缺料预警</div>
                <div class="incident-state" v-if="item.eventType == 1" :class="{'incident-idel':item.eventState == 0,'incident-wait':item.eventState == 1,'incident-running':item.eventState == 2,'incident-complete':item.eventState == 3}">暂停</div>
                <div class="incident-state" v-if="item.eventType == 2" :class="{'incident-idel':item.eventState == 0,'incident-wait':item.eventState == 1,'incident-running':item.eventState == 2,'incident-complete':item.eventState == 3}">错误</div>
                <div class="incident-state" v-if="item.eventType == 3" :class="{'incident-idel':item.eventState == 0,'incident-wait':item.eventState == 1,'incident-running':item.eventState == 2,'incident-complete':item.eventState == 3}">打印完成</div>
                <div class="incident-auth">
                    <div class="m-b-10">
                        <span class="machine-name one-line">{{item.machineName}}</span>&nbsp;
                        <span v-if="item.eventTypeCode != 0  && item.eventTypeCode == 1">gcode</span>
                        <span v-if="item.eventTypeCode != 0  && item.eventTypeCode == 2">断料</span>
                        <span v-if="item.eventTypeCode != 0  && item.eventTypeCode == 3">M2000</span>
                        <span v-if="item.eventTypeCode != 0  && item.eventTypeCode == 4">Cloud</span>
                        <span v-if="item.eventTypeCode != 0  && item.eventTypeCode == 5">ideaMaker</span>
                    </div>
                    <div class="m-b-10 one-line">
                        处理人： <span>{{item.userName}}</span>
                    </div>
                    <div class="incident-result" v-if="item.eventState == 0" :class="'incident-idel-color'">委派</div>
                    <div class="incident-result" v-if="item.eventState == 1" :class="'incident-wait-color'">等待接受</div>
                    <div class="incident-result" v-if="item.eventState == 2" :class="'incident-running-color'">处理中</div>
                    <div class="incident-result" v-if="item.eventState == 3" :class="'incident-complete-color'">处理完成</div>

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

export default {
  name: 'incidentManage',
  components: {
    STable,
    Ellipsis,
  },
  data() {
    return {
      machines: [],
      currentColumn: 8, //打印机几列显示
      machines: []
    }
  },
  created() {
    this.incidentList();
  },
  methods: {
    incidentList() {
      this.$http.post('/machineEvents/getMachineEvents', { param: {} }).then(res => {
        if (res.state == 1) {
          this.machines = res.data;
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
<style lang="less">
.b-r-1 {
  border-right: 1px solid #000;
}
.incident-monitor {
  .incident {
    .incident-list {
      background: #17171F;
      text-align: center;
      margin-bottom: 24px;
      .incident-state{
          padding: 5px 0;
        font-size: 20px;
      }
      .incident-auth{
              padding: 20px;
        font-size: 24px;
      }
    }
  }
  .machine-name{
    height: 45px;
    display: block;
  }
}
</style>
