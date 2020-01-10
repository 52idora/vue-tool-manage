<template>
  <div>
    <a-modal v-model="visible" :footer="null" :width="700" :closable="false" :maskClosable="false">
      <div class="clearfix m-b-24">
        <div class="pull-right">
          <a-icon type="close" class="close-model" @click="cancelModel" />
        </div>
      </div>
      <div class="add-box">
        <a-row class="m-b-24">
          <a-col :span="4">
            <span class="title">人员选择：</span>
          </a-col>
          <a-col :span="20" class="m-b-24">
            <div  v-if="selPerson.length > 0" class="m-b-24">
              <span v-for="(item,index) in selPerson" :key="index">
                <span>{{item.userName}}</span>
                <span style="margin-left:5px;margin-right:5px" v-if="index != (selPerson.length -1)">,</span>
              </span>
            </div>
            <a-button class="m-r-20" @click="showPerson = true">选择人员</a-button>
          </a-col>
          <a-col :span="4">
            <span class="title">班次选择：</span>
          </a-col>
          <a-col :span="20" class="m-b-24">
            <a-button class="m-b-24" @click="showVisible = true">新建班次</a-button>
            <div class="list-box">
              <a-select style="width: 200px" :getPopupContainer="triggerNode => {return triggerNode.parentNode}" v-model="selSchdele">
                <a-select-option
                  :value="bank.shiftId"
                  v-for="(bank,index) in bankArray"
                  :key="index"
                >
                  <span>{{bank.name}}</span>
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col :span="4">
            <a-checkbox
              :indeterminate="indeterminate"
              @change="onCheckAllChange"
              :checked="checkAll"
            ></a-checkbox>
          </a-col>
          <a-col :span="20" class="m-b-24">
            <a-checkbox-group :options="plainOptions" @change="onChange" v-model="checkedList" />
          </a-col>
          <a-col :span="4">
            <a-checkbox @change="oneChange">按周循环</a-checkbox>
          </a-col>
        </a-row>
        <div class="text-center">
          <a-button type="primary" class="m-b-24" @click="newSchedule()">保存</a-button>
        </div>
      </div>
      <!-- 新增班次 -->
      <addClass v-if="showVisible" :showVisible="showVisible" v-on:childByValue="childByValue"></addClass>
      <!-- 新增人员 -->
      <addPerson
        v-if="showPerson"
        :showPerson="showPerson"
        v-on:childValue="childValue"
        :onlyPerson="'true'"
        :showDate="showDate"
      ></addPerson>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { defultBank, addSchedule } from '@/api/printer'
import addClass from './addClass'
import addPerson from './addPerson'
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
const plainOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const defaultCheckedList = []
export default {
  components: {
    STable,
    Ellipsis,
    addClass,
    addPerson
  },
  data() {
    return {
      bankArray: [],
      selBank: [],
      selPerson:[],
      showDate:[],
      indeterminate: true,
      selSchdele: '',
      checkAll: false,
      showVisible: false,
      showPerson: false,
      isRepeat: false,
      plainOptions,
      checkedList: defaultCheckedList,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      weekNum: 0,
      // 查询参数
      queryParam: {}
    }
  },
  props: ['visible'],
  filters: {},
  created() {
    this.default()
    this.bankList()
  },
  methods: {
    cancelModel() {
      this.$emit('childByValue', false);
    },
    //oneChange
    oneChange(e) {
      this.isRepeat = e.target.checked
    },
    //单选
    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length
      this.checkAll = checkedList.length === plainOptions.length
    },
    //全选
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    // 选择人员
    choosePerson() {},
    // 关闭模态框
    childByValue(childValue) {
      this.showVisible = childValue;
      
    },
    childValue(childValue) {
      this.showPerson = childValue;
      if(sessionStorage.getItem("selPerson")){
        this.selPerson = JSON.parse(sessionStorage.getItem("selPerson"));
        this.showDate.person = this.selPerson;
      }
    },
    //默认班次
    default() {
      defultBank({}).then(res => {
        if (res.state == 1) {
          this.selBank = res.data
        }
      })
    },
    //班次列表
    bankList() {
      defultBank({ current: 1, size: 100 }).then(res => {
        if (res.state == 1) {
          this.bankArray = res.data.records;
          this.selSchdele = res.data.records[0].shiftId;
        }
      })
    },
    //新增值排班
    newSchedule() {
      if(this.selPerson.length == 0){
         this.$notification.info({message: '未选择排班人员！'});
         return false;
      }
       if(this.checkedList.length == 0){
         this.$notification.info({message: '未选择排班周期！'});
         return false;
      }
      if(this.isClick){
        return false;
      }
      this.isClick = true;
      let weekNumList = [];
      let userIds = [];
      this.checkedList.forEach(item => {
        if (item == '周一') {
          weekNumList.push(1)
        } else if (item == '周二') {
          weekNumList.push(2)
        } else if (item == '周三') {
          weekNumList.push(3)
        } else if (item == '周四') {
          weekNumList.push(4)
        } else if (item == '周五') {
          weekNumList.push(5)
        } else if (item == '周六') {
          weekNumList.push(6)
        } else if (item == '周日') {
          weekNumList.push(7)
        }
      })
      this.selPerson.forEach((item)=>{
        userIds.push(item.userId)
      })
      let param = {
        shiftId: this.selSchdele,
        isWeeklyCycle: this.isRepeat,
        weekNumList:weekNumList,
        userIds:userIds
      }
      addSchedule(param).then((res)=>{
        if(res.state == 1){
          this.cancelModel();
        }
        this.isClick = false;
      })
    }
  }
}
</script>
<style lang="less">
.close-model {
  font-size: 20px;
  cursor: pointer;
}
.list-box {
  .list {
    border: 1px solid #fff;
    display: inline-block;
    padding: 5px 0 5px 10px;
    border-radius: 5px;
    height: 32px;
    position: relative;
    width: 200px;
    margin-right: 20px;
    margin-bottom: 24px;
    .close {
      font-size: 20px;
      height: 30px;
      width: 32px;
      position: absolute;
      top: 0;
      right: 0px;
      line-height: 35px;
      cursor: pointer;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .list:hover {
    .close {
      background: #ff1531;
    }
    border-color: #ff1531;
  }
}
</style>
