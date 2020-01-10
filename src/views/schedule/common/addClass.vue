<template>
  <a-modal v-model="showVisible" :footer="null" :width="600" :closable="false" :maskClosable="false">
    <div class="clearfix">
      <div class="pull-right">
        <a-icon type="close" class="close-model" @click="cancelModel" />
      </div>
    </div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item
        label="班次名"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        :prop="bankName"
      >
        <a-input v-model="bankName" maxlength="50" />
      </a-form-item>
      <a-form-item label="选择时间" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <span class="time">
          <a-time-picker
            @openChange="handleOpen1Change"
            :open="open"
            :getPopupContainer="triggerNode => {return triggerNode.parentNode}"
            @change="selStartTime"
            placeholder="请选择时间"
            format="HH:mm"
            :defaultValue="this.parentDate && this.parentDate.startTime ? moment(this.parentDate.startTime, 'HH:mm') :null"
          />
        </span>
        <span>~</span>
        <span class="time">
          <a-time-picker
            :open="open2"
            :getPopupContainer="triggerNode => {return triggerNode.parentNode}"
            @openChange="handleOpen2Change"
            @change="selEndTime"
            placeholder="请选择时间"
            format="HH:mm"
            :defaultValue="this.parentDate && this.parentDate.endTime ? moment(this.parentDate.endTime, 'HH:mm') : null"
          />
        </span>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <div v-if="isReturn" class="color">{{text}}</div>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { addBank } from '@/api/printer'
const plainOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const defaultCheckedList = []
export default {
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      open: false,
      open2: false,
      isReturn: false,
      bankName: '',
      text: '',
      startTime: '',
      isClick:false,
      entTime: '',
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  props: ['showVisible', 'parentDate'],
  filters: {},
  created() {
    if (this.parentDate) {
      this.bankName = this.parentDate.name;
      this.startTime = this.parentDate.startTime;
      this.endTime = this.parentDate.endTime;
    }else{
      this.bankName = null;
      this.startTime = null;
      this.endTime = null;
    }
  },
  methods: {
    moment,
    cancelModel() {
      this.$emit('childByValue', false)
    },
    //表单提交
    handleSubmit(e) {
      this.isReturn = false
      if (!this.bankName) {
        this.text = '请输入班次名'
        this.isReturn = true
        e.preventDefault()
        return false
      }
      if (!this.startTime || !this.endTime) {
        this.text = '请输入您的开始时间或结束时间'
        this.isReturn = true
        e.preventDefault()
        return false
      } 
      let start = this.startTime.split(':')
      let startAll
      let end = this.endTime.split(':')
      let endAll
      start[0] > 10 ? (startAll = start[0] * 60 + start[1]) : (startAll = start[0].substring(1) * 60 + start[1])
      end[0] > 10 ? (endAll = end[0] * 60 + end[1]) : (endAll = end[0].substring(1) * 60 + end[1])
      // if (startAll < endAll) {
      //   this.text = ' 开始时间不能大于结束时间'
      //   this.isReturn = true
      //   e.preventDefault()
      //   return false
      // }
      e.preventDefault();
      if(this.isClick){
         return false;
      }
      this.isClick = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          let param = {
            name: this.bankName,
            startTime: this.startTime,
            endTime: this.endTime
          }
          addBank(param).then(res => {
            res.state == 1 ? this.cancelModel() : '';
            this.isClick = false;
          })
        }
      })
    },
    // 时间选择
    handleOpen1Change(open) {
      this.open = open
    },
    // 时间选择
    handleOpen2Change(open) {
      this.open2 = open
    },
    // 选择开始时间
    selStartTime(time, timeString) {
      if (time) {
        this.startTime = timeString
      } else {
        this.startTime = null
      }
    },
    // 选择结束时间
    selEndTime(time, timeString) {
      if (time) {
        this.endTime = timeString
      } else {
        this.endTime = null
      }
    }
  }
}
</script>
<style lang="less">
.close-model {
  font-size: 20px;
  cursor: pointer;
}
.color {
  color: #ff1531;
}
</style>
