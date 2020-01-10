<template>
  <div>
    <div class="operation clearfix">
      <div class="pull-left">
        <a-button class="m-r-20" @click="showAdd=true">
          <a-icon type="plus" />新增排班
        </a-button>
        <a-button @click="del">删除</a-button>
      </div>
      <div class="pull-right">
        <span class="m-r-20">
          <timeManage v-on:childTime="childTime"></timeManage>
        </span>
        <a-button class="m-r-20" @click="toTimeTask">值排班班次</a-button>
        <a-button class="m-r-20" type="primary">人员</a-button>
      </div>
    </div>
    <a-card :bordered="false">
      <tables
        ref="tables"
        size="default"
        rowKey="userId"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
        v-model="current"
        :pageSizeOptions="size"
        :pagination="pagination"
      >
        <span slot="userName" slot-scope="text,record">
          <a @click="toPerson(record.userId)" class="a-color cursor-pointer">{{text}}</a>
        </span>
        <span slot="th0" slot-scope="text,record">
          <a @click="edit(record,'th0')" class="a-color">{{text}}</a>
        </span>
        <span slot="th1" slot-scope="text,record">
          <a @click="edit(record,'th1')" class="a-color">{{text}}</a>
        </span>
        <span slot="th2" slot-scope="text,record">
          <a @click="edit(record,'th2')" class="a-color">{{text}}</a>
        </span>
        <span slot="th3" slot-scope="text,record">
          <a @click="edit(record,'th3')" class="a-color">{{text}}</a>
        </span>
        <span slot="th4" slot-scope="text,record">
          <a @click="edit(record,'th4')" class="a-color">{{text}}</a>
        </span>
        <span slot="th5" slot-scope="text,record">
          <a @click="edit(record,'th5')" class="a-color">{{text}}</a>
        </span>
        <span slot="th6" slot-scope="text,record">
          <a @click="edit(record,'th6')" class="a-color">{{text}}</a>
        </span>
      </tables>
    </a-card>

    <!-- 新增班次 -->
    <addSchedule v-if="showAdd" :visible="showAdd" v-on:childByValue="childByValue"></addSchedule>
    <!-- 人员调班 -->
    <a-modal v-model="visible" :footer="null" :closable="false" :maskClosable="false">
      <div class="clearfix m-b-24">
        <div class="pull-right">
          <a-icon type="close" class="close-model" @click="visible = false" />
        </div>
      </div>
      <a-row class="m-b-24">
        <a-col :span="4">
          <span class="title">班次调整</span>
        </a-col>
        <a-col :span="20" class="m-b-24">
          <!-- <a-select style="width: 100%" v-model="editBank">
            <a-select-option :value="bank.schedulingId" v-for="bank in hasBankArray" :key="bank.schedulingId">{{bank.shiftName}}</a-select-option>
          </a-select>-->
          <a-select
            mode="multiple"
            placeholder="请选择班次"
            style="width:100%"
            @change="choose"
            :defaultValue="defaultValue"
          >
            <a-select-option
              v-for="bank in hasBankArray"
              :key="bank.schedulingId"
              :value="bank.schedulingId"
            >{{bank.shiftName}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <div class="text-center">
        <a-button type="primary" @click="save()">保存</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { Tables, Ellipsis } from '@/components'
/* import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm' */
import { personBank, personEdit, personDel, hasBank } from '@/api/printer'
import timeManage from './common/timeManage'
import addSchedule from './common/addSchedule'
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
  name: 'personManage',
  components: {
    Tables,
    Ellipsis,
    timeManage,
    addSchedule
    /* CreateForm,
    StepByStepModal */
  },
  data() {
    return {
      visible: false,
      showAdd: false,
      checkAll: false,
      total: 0,
      selCheck: [],
      hasBankArray: [],
      defaultValue: [],
      selArray: [],
      editBank: '',
      theader: [],
      editParam: {},
      tbody: [],
      current: 1,
      size: 10,
      pagination: {
        current: 1,
        hideOnSinglePage: false,
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: total => `Total:${total}`
      },
      // 表头
      columns: [],
      queryParam: {},

      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return personBank(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.state == 1) {
            let titleArray = []
            res.data.column.forEach((item, index) => {
              let itemObj = {
                title: '',
                dataIndex: '',
                scopedSlots: { customRender: '' }
              }
              if (index == 0) {
                ;(itemObj.title = item), (itemObj.dataIndex = 'userName')
                itemObj.scopedSlots.customRender = 'userName'
              } else if (index == 1) {
                ;(itemObj.title = item), (itemObj.dataIndex = 'th0')
                itemObj.scopedSlots.customRender = 'th0'
              } else if (index == 2) {
                ;(itemObj.title = item), (itemObj.dataIndex = 'th1')
                itemObj.scopedSlots.customRender = 'th1'
              } else if (index == 3) {
                ;(itemObj.title = item), (itemObj.dataIndex = 'th2')
                itemObj.scopedSlots.customRender = 'th2'
              } else if (index == 4) {
                ;(itemObj.title = item), (itemObj.dataIndex = 'th3')
                itemObj.scopedSlots.customRender = 'th3'
              } else if (index == 5) {
                ;(itemObj.title = item), (itemObj.dataIndex = 'th4')
                itemObj.scopedSlots.customRender = 'th4'
              } else if (index == 6) {
                ;(itemObj.title = item), (itemObj.dataIndex = 'th5')
                itemObj.scopedSlots.customRender = 'th5'
              } else if (index == 7) {
                ;(itemObj.title = item), (itemObj.dataIndex = 'th6')
                itemObj.scopedSlots.customRender = 'th6'
              }
              titleArray.push(itemObj)
            })
            this.columns = titleArray
          }
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: []
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
    this.getHasBank()
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    childTime(childValue) {
      this.queryParam.year = childValue.year;
      this.queryParam.month = childValue.month;
      this.queryParam.week = childValue.week;
      console.log(childValue.isFirst)
      childValue.isFirst == 'true' ?  this.$refs.tables.loadData() : '';
    },
    toTimeTask() {
      //班次
      this.$router.push({ name: 'scheduleManage' })
    },
    //删除人员排班
    del() {
      let that = this
      this.$confirm({
        title: '请确认删除此项排班人员?',
        onOk() {
          if (that.selectedRowKeys.length == 0) {
            that.$notification.info({ message: '请选择要删除的排班人员' })
            return false
          }
          let userIds = []
          that.selectedRowKeys.forEach(item => {
            userIds.push(item)
          })
          let param = {
            year: that.queryParam.year,
            month: that.queryParam.month,
            week: that.queryParam.week,
            userIds: userIds
          }
          personDel(param).then(res => {
            if (res.state == 1) {
              this.$refs.table.loadData();
            }
          })
        },
        onCancel() {}
      })
    },
    //人员值班调整
    edit(item, n) {
      let array = item[n].split(',');
      let currentDay = new Date().getDate();
      let currentMonth = new Date().getMonth()+1;
      let currentDate;
      let canEdit = false;
      this.editParam.userId = item.userId
      this.defaultValue = []
      this.columns.forEach(item => {
        if (item.dataIndex == n) {
          currentDate = item.title.substring(0, item.title.length - 4);
          let selMonth = currentDate.split("-")[0];
          let selDay= currentDate.split("-")[1];
          console.log(currentDate)
          this.editParam.date = this.queryParam.year + '-' + currentDate;
          if(currentMonth == selMonth){
            currentDay <  selDay ? canEdit = true : canEdit = false;
          }else{
            canEdit = true;
          }
        }
      })
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < this.hasBankArray.length; j++) {
          if (array[i] == this.hasBankArray[j].shiftName) {
            this.defaultValue.push(this.hasBankArray[j].schedulingId)
          }
        }
      }
      this.editParam.schedulingIds = this.defaultValue;
      if(canEdit){
        this.visible = true;
      }else{
        this.$notification.info({ message: '您不能编辑今天或今天之前的日期' })
        this.visible = false;
      }
    },
    // 人员排班
    toPerson(id) {
      this.$router.push({ name: 'person', query: { id: id } })
    },
    childByValue: function(childValue) {
      // childValue就是子组件传过来的值
      this.showAdd = childValue
    },
    //获取已启用的班次
    getHasBank() {
      hasBank({}).then(res => {
        if (res.state == 1) {
          this.hasBankArray = res.data;
        }
      })
    },
    //班次选择
    choose(value) {
      this.selArray = value
    },
    // 人员编辑保存
    save() {
      let schedulingIds = []
      if (this.selArray.length > 0) {
        this.selArray.forEach(item => {
          schedulingIds.push(item)
        })
        this.editParam.schedulingIds = schedulingIds
      }
      personEdit(this.editParam).then((res)=>{
        if(res.state == 1){
          this.$refs.table.loadData();
          this.visible = false;
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.operation {
  padding: 20px;
}
.close-model {
  font-size: 20px;
  cursor: pointer;
}
.defult {
  color: #fff;
}
.a-color {
  color: rgba(255, 255, 255, 0.65);
}
</style>
