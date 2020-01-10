<template>
  <div class="queue-box">
    <div class="current-box m-b-24">
      <div class="title-box clearfix">
        <div class="title pull-left">当前任务</div>
      </div>
      <div class="current-queue">
        <a-row>
          <a-col :span="10" class="p-r-20">
            <ellipsis :length="20" tooltip>
              <!-- <img src="http://192.168.0.7/upload/img//6611136933873586176.png" alt /> -->
              {{ detail.fileName }}
            </ellipsis>
          </a-col>

          <a-col :span="2" class="p-r-20">
            <div>
              {{ detail.printProgress }}
            </div>
          </a-col>

          <a-col :span="6" class="p-r-20">
            <div>
              {{ detail.leftTime | time }}
            </div>
          </a-col>
          <a-col :span="6" class="p-r-20">
            <div>L:{{ leftRest }} R:{{ rightRest }}</div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="list-box">
      <div class="title-box clearfix">
        <div class="title pull-left m-t-0">任务队列</div>
        <div class="pull-right">
          <a-icon type="reload" class="refresh" />
        </div>
      </div>
      <div>
        <draggable v-model="detail.machineQueues" @update="datadragEnd" :options="{ animation: 500 }">
          <transition-group>
            <div class="queue-list" v-for="(item, index) of detail.machineQueues" :key="item.trayId">
              <a-row>
                <a-col :span="6">
                  <div>{{ item.trayName }}</div>
                </a-col>
                <a-col :span="5">
                  <div class="auth">
                    <img src alt />
                    <span>{{ item.authName }}</span>
                  </div>
                </a-col>
                <a-col :span="5">
                  <div class="time">{{ item.singlePrintTime | time }}</div>
                </a-col>
              </a-row>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import draggable from 'vuedraggable'

export default {
  components: {
    STable,
    Ellipsis,
    draggable
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      quequList: [
        {
          img: 'http://192.168.0.7/upload/img//6611136933873586176.png',
          queueName: 'hellohheheh.gcode',
          authName: 'hebingbing',
          time: '2019-12-17 15:52'
        },
        {
          img: 'http://192.168.0.7/upload/img//6611136933873586176.png',
          queueName: 'hellohheheh.gcode',
          authName: 'hebingbing',
          time: '2019-12-17 15:52'
        }
      ],
      leftRest: '',
      rightRest: '',
      // 查询参数
      queryParam: {}
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
      console.log(val)
      if (val.filamentVolumeRS.length != 0) {
        val.filamentVolumeRS.map(item => {
          if (item.nozzle == 1) {
            if (item.restWeight) {
              this.leftRest = item.restWeight
            } else {
              this.leftRest = '--'
            }
          } else if (item.nozzle == 2) {
            if (item.restWeight) {
              this.rightRest = item.restWeight
            } else {
              this.rightRest = '--'
            }
          }
        })
      }
    },
    // 队列状态改变
    handleChange() {},
    // 拖拽结束
    datadragEnd() {}
  }
}
</script>
<style lang="less">
.m-t-0 {
  margin-top: 0;
}
.queue-box {
  background: #17171f;
  padding: 20px;
  .title-box {
    .title {
      margin-top: 5px;
    }
    .refresh {
      font-size: 18px;
    }
  }
  .current-queue {
    background: #17171f;
    border: 1px solid #3b3b4d;
    margin-top: 20px;
    padding: 20px;
    .queue-img {
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  .queue-list {
    line-height: 70px;
    border-bottom: 1px solid #3b3b4d;
    .queue-list-img {
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .queue-list-name {
      padding: 0 15px;
    }
  }
  .queue-list:hover {
    cursor: move;
  }
}
</style>
