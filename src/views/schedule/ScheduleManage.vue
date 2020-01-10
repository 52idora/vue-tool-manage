<template>
  <div class="schedule-box">
    <div class="operation clearfix">
      <div class="pull-left">
        <a-button @click="showAdd=true">
          <a-icon type="plus" />新增排班
        </a-button>
      </div>
      <div class="pull-right">
        <span class="m-r-20">
          <timeManage v-on:childTime="childTime"></timeManage>
        </span>
        <a-button class="m-r-20" type="primary">值排班班次</a-button>
        <a-button @click="toPersonTask">人员</a-button>
      </div>
    </div>
    <div>
      <table class="table">
        <thead>
          <tr>
            <th>
              <div class="line"></div>
            </th>
            <th v-for="(item,index) in theader" :key="index">
              <span class="line">
                <span v-if="index == 0">周日</span>
                <span v-if="index == 1">周一</span>
                <span v-if="index == 2">周二</span>
                <span v-if="index == 3">周三</span>
                <span v-if="index == 4">周四</span>
                <span v-if="index == 5">周五</span>
                <span v-if="index == 6">周六</span>
                (<span>{{item}}</span>)
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in tbody" :key="index">
            <td class="first" :class="{'defult':index == 0}">
              <span class="line">
                <div class="p-t-30">
                  <div>{{item.shiftName}}</div>
                  <span>{{item.startTime}}</span>~
                  <span>{{item.endTime}}</span>
                </div>
              </span>
              <span class="close" @click="delSchedule(item.schedulingId)">
                <a-icon type="close" />
              </span>
            </td>
            <td v-for="(ele,i) in item.schedulingList" :key="i">
              <span class="line pointer" @click="editPerson(ele,item)" v-if="ele.allowedToEdit">
                <div v-for="(user,userIndex) in ele.userList" :key="userIndex" class="one-line" :title="user.userName">{{user.userName}}</div>
                <div v-if="ele.userList.length == 0">休息</div>
              </span>
              <span class="line" v-if="!ele.allowedToEdit">
                <div v-for="(user,userIndex) in ele.userList" :key="userIndex">{{user.userName}}</div>
                <div v-if="ele.userList.length == 0">休息</div>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <addSchedule v-if="showAdd" :visible="showAdd" v-on:childByValue="childByValue"></addSchedule>
    <addPerson v-if="showPerson" :showPerson="showPerson" v-on:childValue="childValue" :showDate="showDate"></addPerson>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { toExpression } from '@babel/types'
import timeManage from './common/timeManage'
import addSchedule from './common/addSchedule'
import addPerson from './common/addPerson'
import { bankList, delBank } from '@/api/printer'

export default {
  name: 'scheduleManage',
  components: {
    STable,
    Ellipsis,
    timeManage,
    addSchedule,
    addPerson
  },
  data() {
    return {
      showAdd: false,
      showPerson: false,
      param:{},
      showDate:{},
      events: [
        { title: '赵子龙', start: '2019-07-01T12:30', end: '2019-07-01T13:30' },
        { title: '刘备', start: '2019-07-02T10:20', end: '2019-07-02T11:00', color: 'red' },
        { title: '关羽', start: '2019-07-03T14:20', end: '2019-07-03T15:20', backgroundColor: 'green' },
        { title: '张飞', start: '2019-07-04T16:00', end: '2019-07-04T17:00', color: 'orange', editable: true },
        { title: '曹操', start: '2019-07-05T18:40', end: '2019-07-05T19:20' }
      ],
      theader: [],
      tbody: [],
      config: {
        buttonText: { today: '今天', month: '月', week: '周', day: '日' },
        locale: 'zh-cn',
        editable: false, //是否允许修改事件
        selectable: false,
        eventLimit: 4, //事件个数
        allDaySlot: false, //是否显示allDay
        defaultView: 'month', //显示默认视图
        eventClick: this.eventClick, //点击事件
        dayClick: this.dayClick //点击日程表上面某一天
      }
    }
  },
  filters: {
  },
  created() {
    this.getList();
  },
  methods: {
    toTimeTask() {
      //班次
      this.$router.push({ name: 'scheduleManage' })
    },
    toPersonTask() {
      //人员
      this.$router.push({ name: 'personManage' })
    },
    childByValue(childValue) {
      // childValue就是子组件传过来的值
      this.showAdd = childValue;
      this.getList();
    },
    childTime(childValue){
      this.param.year = childValue.year;
      this.param.month = childValue.month;
      this.param.week = childValue.week;
      this.getList();
      // childValue.isFirst == 'true' ? this.getList() : '';
    },
    childValue(childValue) {
      this.showPerson = childValue;
       this.getList();
    },
    // 删除排班
    delSchedule(id) {
      let that = this;
       this.$confirm({
          title: '请确认删除此项排班?',
          onOk() {
             delBank({schedulingId:id}).then(res => {
              if(res.state == 1){
                that.getList();
              }
            })
          },
          onCancel() {
          },
        });
    },
    //班次列表
    getList() {
      bankList(this.param).then(res => {
        if ((res.state = 1)) {
          this.theader = res.data.date;
          let array = [];
          this.theader.forEach((item)=>{
           array.push(item.substring(5));
          })
          this.theader = array;
          this.tbody = res.data.records;
        }
      })
    },
    //修改排班
    editPerson(childItem,parantItem){
      this.showDate.data = childItem.date;
      this.showDate.week = childItem.week;
      this.showDate.bank = parantItem.shiftName+' ( '+parantItem.startTime+' ~ '+parantItem.endTime + ' ) ';
      this.showDate.person = childItem.userList;
      this.showDate.schedulingId = parantItem.schedulingId;
      this.showPerson = true
    }
  }
}
</script>
<style lang="less">
.schedule-box {
  .operation {
    padding: 20px;
  }
  .table {
    width: 100%;
    th {
      height: 60px;
      line-height: 60px;
      text-align: center;
      width: 12.5%;
      padding: 4px 8px;
    }
  }
  td {
    width: 12.5%;
    height: 116px;
    padding: 4px 8px;
  }
  .line {
    border-bottom: 2px solid #fff;
    display: block;
    height: 100px;
    display: block;
    overflow-y: auto;
    max-width: 100px;
    overflow-x: hidden;
  }
  .first {
    position: relative;
    .close {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      display: block;
      border: 1px solid #fff;
      border-radius: 50%;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
    }
  }
  .first.defult {
    .close {
      display: none;
    }
  }
  .p-t-30 {
    padding-top: 30px;
  }
}
</style>
