<template>
  <div class="machine-box">
    <a-row>
      <a-col :span="6">
        <div class="machine-img">
          <img src="@/assets/img/printer/N1.png" alt />
        </div>
      </a-col>
      <a-col :span="18">
        <div class="machine">
          <div class="machine-name">{{ detail.machineName }}</div>
          <div class="machine-type">
            {{ detail.machineType }}
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="machine-state label-running">
      <a-tag :color="status.color" class="tag_radius">{{ status.text }}</a-tag>
    </div>
    <a-row class="progress">
      <!-- <a-progress :percent="detail.printProgress" class="progress-bar" :strokeColor="'#f8ac59'" :strokeWidth="20" /> -->
      <a-col :span="17"
        ><a-progress strokeLinecap="square" :strokeColor="status.color" :percent="detail.printProgress || 0"
      /></a-col>
      <a-col :span="2"></a-col>
      <a-col :span="5">
        <span>
          <a-icon type="clock-circle" class="m-r-10" />
          <span>{{ detail.leftTime | time }}</span>
        </span>
      </a-col>
    </a-row>
    <ellipsis :length="100" tooltip class="printer-name">
      {{ detail.fileName }}
    </ellipsis>
    <div class="operation clearfix">
      <a-button type="info" class="pause_btn" @click="handleRadioChange('stop')" :disabled="disabledBtn">
        <span class="square"></span
      ></a-button>
      <a-button type="info" @click="handleButton(1)" v-if="showPause" class="pause_btn " :disabled="disabledBtn">
        <a-icon type="caret-right" />
      </a-button>
      <a-button type="info" @click="handleButton(2)" v-else class="pause_btn " :disabled="disabledBtn">
        <a-icon type="pause" />
      </a-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { printerMachineSwitch } from '@/api/printer'
import Status from '../status.json'
const statusMap = {
  idle: {
    status: 'rgb(64, 130, 193)',
    text: '空闲'
  },
  busy: {
    status: '#926dde',
    text: '忙'
  },
  running: {
    status: 'rgb(237, 175, 103)',
    text: '打印中'
  },
  completed: {
    status: 'rgb(84, 176, 149)',
    text: '打印完成'
  },
  error: {
    status: 'rgb(221, 94, 88)',
    text: '错误'
  },
  paused: {
    status: 'rgb(221, 94, 88)',
    text: '暂停'
  },
  offline: {
    status: 'rgb(115, 115, 115)',
    text: '离线'
  },
  cutting: {
    status: 'rgb(221, 94, 88)',
    text: '断料'
  },
  downloading: {
    status: '#926dde',
    text: '下载文件中'
  },
  starving: {
    status: 'rgb(221, 94, 88)',
    text: '缺料'
  }
}

export default {
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      mdl: {},
      machine_id: this.$route.query.id,
      // 高级搜索 展开/关闭
      advanced: false,
      status: {},
      // 查询参数
      queryParam: {},
      form: this.$form.createForm(this),
      showPause: true,
      disabledBtn: false
    }
  },
  props: ['detail'],
  filters: {},
  created() {},
  mounted() {
    this.$on('init', val => {
      this.getInit(val)
    })
    ///此时通过$on进行监听中间桥接函数bridge对目的方法childAction进行触发
  },
  methods: {
    getInit(val) {
      Status.statusList.map(item => {
        if (item.name == val.machineState) {
          this.status = {
            color: item.status,
            text: item.text
          }
        }
      })
      if (val.machineState == 'busy' || val.machineState == 'downloading') {
        console.log(1)
        this.disabledBtn = true
      } else {
        console.log(2)
        this.disabledBtn = false
      }
    },
    handleRadioChange(value) {
      const params = {
        machine_id: this.machine_id,
        push_down: value
      }
      console.log(params)
      printerMachineSwitch(params).then(res => {
        if (res.state == 1) {
          this.$notification.success({ message: '打印机状态修改成功' })
        } else {
          this.$notification.error({ message: '打印机状态修改失败' })
        }
      })
    },
    handleButton(e) {
      console.log(1)
      if (e == 1) {
        // 点击播放
        this.showPause = false
        this.handleRadioChange('pause')
      } else {
        // 点击暂停
        this.showPause = true
        this.handleRadioChange('resume')
      }
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  }
}
</script>
<style lang="less">
.machine-box {
  padding: 20px;
  background: #17171f;
  margin-bottom: 24px;
  height: 300px;
  .machine-img {
    width: 100px;
    height: 100px;
    border: 1px solid #3b3b4d;
    border-radius: 50%;
    position: relative;
    img {
      max-width: 80px;
      max-height: 80px;
      margin: 0 auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .machine {
    padding-left: 30px;
    .machine-name {
      margin-bottom: 0px;
      margin-top: 20px;
      font-size: 25px;
    }
    .machine-type {
      font-size: 20px;
    }
  }
  .machine-state {
    padding: 0 20px;
    display: inline-block;
    border-radius: 20px;
    font-size: 16px;
    height: 22px;
    line-height: 22px;
    margin: 15px 0 5px 0;
  }
  .progress {
    padding-left: 0;
    display: flex;
    margin: 0;
    .ant-progress {
      margin-right: 10px;
      .ant-progress-bg {
        border-radius: 5px !important;
      }
    }
  }
  .operation {
    margin-top: 20px;
  }
}

.tag_radius {
  border-radius: 10px;
}

.pause_btn.ant-btn {
  padding: 0 10px;
  background: transparent;
  margin-left: 10px;
  float: right;
  height: 36px;
  width: 36px;
  font-size: 18px;
  .anticon {
    margin-left: -2px;
    // color: #2c2c38;
    color: #aeaeb0;
  }
  .square {
    display: inline-block;
    width: 14px;
    height: 14px;
    background-color: rgb(44, 44, 57);
  }
}
/deep/ .ant-btn-disabled,
.ant-btn.disabled,
.ant-btn[disabled],
.ant-btn-disabled:hover,
.ant-btn.disabled:hover,
.ant-btn[disabled]:hover,
.ant-btn-disabled:focus,
.ant-btn.disabled:focus,
.ant-btn[disabled]:focus,
.ant-btn-disabled:active,
.ant-btn.disabled:active,
.ant-btn[disabled]:active,
.ant-btn-disabled.active,
.ant-btn.disabled.active,
.ant-btn[disabled].active {
  background-color: transparent;
  color: rgb(234, 57, 60);
}
</style>
