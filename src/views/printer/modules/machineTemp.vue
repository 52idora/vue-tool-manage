<template>
  <div class="machine-temp">
    <!-- 是否接受开关 -->
    <div class="receive-job clearfix">
      <span class="pull-left">是否接受任务</span>
      <span class="pull-right">
        <a-switch defaultChecked @change="switchChange" />
      </span>
    </div>
    <div class="temp-box">
      <!-- 温度设置 -->
      <div class="clearfix">
        <div class="pull-left">
          <h3 class="title">Temperature</h3>
        </div>
        <div class="pull-right">
          <a-icon type="setting" class="setting" @click="visible = true" />
        </div>
      </div>
      <a-row class="m-b-24">
        <a-col :span="8" class="text-center relative">
          <a-progress
            type="circle"
            :percent="(detail.nozzle_temp_1 / detail.nozzle_temp_1_goal) * 100"
            :strokeColor="'#FF1531'"
            :showInfo="false"
          />
          <div class="temp-value">
            <div class="current-temp">{{ detail.nozzle_temp_1 }}&#8451;</div>
            <div class="line"></div>
            <div class="current-setting">{{ detail.nozzle_temp_1_goal }}&#8451;</div>
          </div>
          <div>L-Nozzle</div>
        </a-col>
        <a-col :span="8" class="text-center relative" v-if="showR">
          <a-progress
            type="circle"
            :percent="(detail.nozzle_temp_2 / detail.nozzle_temp_2_goal) * 100"
            :strokeColor="'#FF1531'"
            :showInfo="false"
          />
          <div class="temp-value">
            <div class="current-temp">{{ detail.nozzle_temp_2 }}&#8451;</div>
            <div class="line"></div>
            <div class="current-setting">{{ detail.nozzle_temp_2_goal }}&#8451;</div>
          </div>
          <div>R-Nozzle</div>
        </a-col>
        <a-col :span="8" class="text-center relative">
          <a-progress
            type="circle"
            :percent="(detail.bed_temp / detail.bed_temp_goal) * 100"
            :strokeColor="'#FF1531'"
            :showInfo="false"
          />
          <div class="temp-value">
            <div class="current-temp">{{ detail.bed_temp }}&#8451;</div>
            <div class="line"></div>
            <div class="current-setting">{{ detail.bed_temp_goal }}&#8451;</div>
          </div>
          <div>HeatedBed</div>
        </a-col>
      </a-row>
      <!-- 材料设置 -->
      <h3 class="title">Filament</h3>
      <div class="filament m-b-24">
        <a-row>
          <a-col :span="12" class="p-0-5">
            <div class="filament-item">
              <div class="top clearfix">
                <span class="pull-left">L-Nozzle</span>
                <span class="pull-right">0.4mm</span>
              </div>
              <div class="name">
                <span>{{ filamentVolumeRS.l_filamentName || '--' }}</span>
              </div>
              <div class="progress">
                <a-progress :percent="filamentVolumeRS.l_progress" :showInfo="false" />
              </div>
            </div>
          </a-col>
          <a-col :span="12" class="p-0-5">
            <div class="filament-item last">
              <div class="top clearfix">
                <span class="pull-left">R-Nozzle</span>
                <span class="pull-right">0.4mm</span>
              </div>
              <div class="name">
                <span v-if="showR">{{ filamentVolumeRS.r_filamentName || '--' }}</span>
                <span v-else>--</span>
              </div>
              <div class="progress" v-if="showR">
                <a-progress :percent="filamentVolumeRS.r_progress" :showInfo="false" />
              </div>

              <div class="progress" v-else>
                <a-progress :percent="0" />
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <!-- 打印机信息 -->
      <h3 class="title">打印机信息</h3>
      <div class="machine-info">
        <div class="clearfix">
          <span class="pull-left">固件版本号：</span>
          <span class="pull-right">{{ detail.firmwareVersion }}</span>
        </div>
        <div class="clearfix m-b-24">
          <span class="pull-left">打印尺寸：</span>
          <span class="pull-right">
            <span class="m-r-10">
              <span>{{ detail.machineDimX }}</span>
              <span v-if="detail.machineDimX">mm</span>
              <span>x</span>
              <span>{{ detail.machineDimY }}</span>
              <span v-if="detail.machineDimY">mm</span>
              <span>x</span>
              <span>{{ detail.machineDimZ }}</span>
              <span v-if="detail.machineDimZ">mm</span>
            </span>
            <span>
              <a-icon type="edit" class="pointer" @click="showEdit = !showEdit" />
            </span>
          </span>
        </div>
      </div>
    </div>
    <!-- 温度设置模态框 -->
    <a-modal title="设置" v-model="visible" :footer="null">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-row>
            <a-col :md="24" :sm="24">
              <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="L-Nozzle Temp">
                <slider
                  :marks="nozzleMarks"
                  :max="310"
                  v-decorator="['nozzle_temp_1', { initialValue: Number(detail.nozzle_temp_1) }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="showR">
            <a-col :md="24" :sm="24">
              <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="R-Nozzle Temp">
                <slider
                  :marks="nozzleMarks"
                  :max="310"
                  v-decorator="['nozzle_temp_2', { initialValue: Number(detail.nozzle_temp_2) }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24" :sm="24">
              <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="HeatedBed">
                <slider
                  :marks="heatedMarks"
                  :max="110"
                  v-decorator="['bed_temp', { initialValue: Number(detail.bed_temp) }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24" :sm="24">
              <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="L-Flow Rate">
                <slider
                  :marks="flowMarks"
                  :max="100"
                  v-decorator="['flow_rate_1', { initialValue: Number(detail.flow_rate_1) }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="showR">
            <a-col :md="24" :sm="24">
              <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="R-Flow Rate">
                <slider
                  :marks="flowMarks"
                  :max="100"
                  v-decorator="['flow_rate_2', { initialValue: Number(detail.flow_rate_2) }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24" :sm="24">
              <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="Feed Rate">
                <slider
                  :marks="flowMarks"
                  :max="100"
                  v-decorator="['print_speed', { initialValue: Number(detail.print_speed) }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24" :sm="24">
              <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="Fan Speed">
                <slider
                  :marks="flowMarks"
                  :max="100"
                  v-decorator="['fan_speed', { initialValue: Number(detail.fan_speed) }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
      <div class="footer" style="text-align:center">
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </div>
    </a-modal>
    <!-- 打印机尺寸 -->
    <a-modal title="打印机尺寸编辑" v-model="showEdit" :footer="null" :width="530" @cancel="handleEditCancel">
      <div class="edit-box">
        <div>
          <span>长:</span>
          <span class="m-r-20 m-l-10">
            <a-input-number :min="1" :max="100000" v-model="detail.machineDimX" size="small" />
          </span>
          <span>宽:</span>
          <span class="m-r-20 m-l-10">
            <a-input-number :min="1" :max="100000" v-model="detail.machineDimY" size="small" />
          </span>
          <span>高:</span>
          <span class="m-r-20 m-l-10">
            <a-input-number :min="1" :max="100000" v-model="detail.machineDimZ" size="small" />
          </span>
          <a-button type="primary" @click="handleEdit()">提交</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { printerMachineSwitch, printerEdit, printerMachineSet } from '@/api/printer'
import { Slider } from 'ant-design-vue'

export default {
  components: {
    STable,
    Ellipsis,
    Slider
  },
  data() {
    return {
      showEdit: false, //是否编辑打印机尺寸,
      visible: false, //温度设置模态框,
      data: {},
      nozzleMarks: {
        0: '0°C',
        26: '26°C',
        310: {
          style: {
            color: '#fff'
          },
          label: <strong>310°C</strong>
        }
      },
      heatedMarks: {
        0: '0°C',
        26: '26°C',
        110: {
          style: {
            color: '#fff'
          },
          label: <strong>110°C</strong>
        }
      },
      flowMarks: {
        0: '0%',
        26: '26%',
        100: {
          style: {
            color: '#fff'
          },
          label: <strong>100%</strong>
        }
      },
      form: this.$form.createForm(this),
      filamentVolumeRS: {},
      confirmLoading: false,
      showR: true,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {}
    }
  },
  machineId: null,
  props: ['detail'],
  filters: {},
  created() {
    this.machineId = this.$route.query.id
  },
  mounted() {
    this.$on('init', (val, data) => {
      this.getInit(val, data)
    })
    ///此时通过$on进行监听中间桥接函数bridge对目的方法childAction进行触发
  },
  methods: {
    //打印机是否接受任务
    switchChange(e) {
      let receive = ''
      if (true) {
        receive = 1
      } else {
        receive = 0
      }
      const params = {
        machine_id: this.machineId,
        receive_job: receive
      }
      printerMachineSwitch(params).then(res => {
        console.log(res)
        if (res.state == 1) {
          this.$notification.success({ message: '打印机状态修改成功' })
        } else {
          this.$notification.error({ message: '打印机状态修改失败' })
        }
      })
    },
    // 数据初始化
    getInit(val, data) {
      if (val == 1) {
        // 右喷嘴无值
        this.showR = false
        if (data.filamentVolumeRS.length > 0) {
          let datas = data.filamentVolumeRS
          datas.map(item => {
            if (item.nozzle == 1) {
              ;(this.filamentVolumeRS.l_filamentName = datas.fileName),
                (this.filamentVolumeRS.l_progress = datas.restWeight / datas.totalWeight)
            }
          })
        }
      } else {
        this.showR = true
        if (data.filamentVolumeRS.length > 0) {
          let datas = data.filamentVolumeRS
          datas.map(item => {
            if (item.nozzle == 1) {
              this.filamentVolumeRS.l_filamentName = datas.fileName
              this.filamentVolumeRS.l_progress = (datas.restWeight / datas.totalWeight) * 100
            } else if (item.nozzle == 2) {
              this.filamentVolumeRS.r_filamentName = datas.fileName
              this.filamentVolumeRS.r_progress = (datas.restWeight / datas.totalWeight) * 100
            }
          })
        }
      }
      //   console.log(this.detail.filamentVolumeRS.length)
      //   nozzle_temp_2
    },
    //打印机温度设置
    settingChange() {
      console.log(44)
    },
    // 初始化打印机温度设置
    handleSubmit() {
      console.log(this.data)
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        console.log(values)
        if (!errors) {
          values.machine_id = this.machineId
          printerMachineSet(values).then(res => {
            console.log(res)
            if (res.state == 1) {
              this.$notification.success({
                message: '温度设置成功'
              })
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok')
            } else {
              this.$notification.error({
                message: '温度设置失败'
              })
              this.confirmLoading = false
            }
          })
        } else {
          this.confirmLoading = false
        }
      })
    },

    // 修改尺寸
    handleEdit() {
      console.log(1)
      const params = {
        machineId: this.machineId,
        machineDimX: this.detail.machineDimX,
        machineDimY: this.detail.machineDimY,
        machineDimZ: this.detail.machineDimZ
      }

      printerEdit(params).then(res => {
        if (res.state == 1) {
          this.$notification.success({ message: '尺寸修改成功' })
          this.showEdit = false
          this.$emit('ok')
        } else {
          this.$notification.error({ message: '尺寸修改失败' })
          this.showEdit = false
          this.$emit('ok')
        }
      })
    },
    //关闭修改尺寸模态框
    handleEditCancel() {
      this.detail = {}
      this.$emit('ok')
    }
  }
}
</script>
<style lang="less">
.machine-temp {
  .receive-job {
    padding: 20px;
    background: #17171f;
    margin-bottom: 24px;
  }
  .temp-box {
    background: #17171f;
    padding: 20px;
    .title {
      color: #3b3b4d;
      margin-bottom: 24px;
    }
    .setting {
      font-size: 25px;
      cursor: pointer;
    }
  }
  .relative {
    position: relative;
  }
  .temp-value {
    position: absolute;
    top: 41%;
    left: 50%;
    transform: translate(-50%, -50%);
    .line {
      width: 100px;
      height: 1px;
      background: #3b3b4d;
    }
  }
  .filament {
    .filament-item {
      border: 1px solid #3b3b4d;
      padding: 10px;
      margin-left: -5px;
      .top {
        font-weight: 600;
        font-size: 16px;
      }
      .color {
        width: 10px;
        height: 10px;
        display: inline-block;
        background: #3b3b4d;
        border-radius: 50%;
        margin-left: 10px;
      }
    }
    .filament-item.last {
      margin-left: 0;
      margin-right: -5px;
    }
  }
}
.setting-item {
  display: flex;
  .setting-value {
    flex: 1;
    margin-top: -10px;
    margin-bottom: 24px;
  }
  .setting-title {
    margin-right: 20px;
    width: 100px;
  }
}
.m-l-10 {
  margin-left: 10px;
}
/deep/ .ant-input-number,
.ant-input-number-handler-wrap {
  width: 60px;
}
/deep/ .ant-slider-mark-text-active,
/deep/ .ant-slider-mark-text {
  color: #3b3b4d;
  font-weight: 600;
}
</style>
