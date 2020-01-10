<template>
  <a-modal v-model="showPerson" :footer="null" :closable="false" :width="600" :maskClosable="false">
    <div class="clearfix m-b-24">
      <div class="pull-right">
        <a-icon type="close" class="close-model" @click="cancelModel" />
      </div>
    </div>
    <a-row class="m-b-24">
      <a-col :span="4" v-if="!onlyPerson">
        <span class="title">班次：</span>
      </a-col>
      <a-col :span="20" class="m-b-24" v-if="!onlyPerson">
        <span>{{showDate.bank}}</span>
      </a-col>
      <a-col :span="4" v-if="!onlyPerson">
        <span class="title">日期</span>
      </a-col>
      <a-col :span="20" class="m-b-24" v-if="!onlyPerson">
        <span>{{showDate.data}}</span> （
        <span v-if="showDate.week == 1">周一</span>
        <span v-if="showDate.week == 2">周二</span>
        <span v-if="showDate.week == 3">周三</span>
        <span v-if="showDate.week == 4">周四</span>
        <span v-if="showDate.week == 5">周五</span>
        <span v-if="showDate.week == 6">周六</span>
        <span v-if="showDate.week == 7">周日</span> ）
      </a-col>
      <a-col :span="4">
        <span class="title">值班员</span>
      </a-col>
      <a-col :span="20" class="m-b-24">
        <a-select
          mode="multiple"
          placeholder="请选择人员"
          style="width:100%"
          @change="choosePerson"
          :defaultValue="defaultValue"
        >
          <a-select-option
            v-for="item in personList"
            :key="item.id"
            :value="item.userId"
          >{{item.userName}}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <div class="text-center">
      <a-button type="primary" @click="save()" v-if="onlyPerson">保存</a-button>
      <a-button type="primary" @click="edit()" v-if="!onlyPerson">保存</a-button>
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { personList, defultBank, editSchedule } from '@/api/printer'

export default {
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      defaultSelBank: {},
      personList: [],
      selPerson: [],
      defaultValue: []
    }
  },
  props: ['showPerson', 'onlyPerson', 'showDate'],
  filters: {},
  created() {
    this.list()
    this.defult()
    if (this.showDate) {
      if (this.showDate.person) {
        this.showDate.person.forEach(element => {
          this.defaultValue.push(element.userId)
        })
      }
    }
  },
  methods: {
    cancelModel() {
      console.log(444)
      this.$emit('childValue', false)
    },
    // 选择人员
    choosePerson(value) {
      this.selPerson = []
      for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < this.personList.length; j++) {
          if (value[i] == this.personList[j].userId) {
            this.selPerson.push(this.personList[j])
            break
          }
        }
      }
    },
    //人员列表
    list() {
      personList({}).then(res => {
        if (res.state == 1) {
          this.personList = res.data
        }
      })
    },
    // 保存
    save() {
      sessionStorage.setItem('selPerson', JSON.stringify(this.selPerson))
      this.cancelModel()
    },
    //默认班次
    defult() {
      defultBank({}).then(res => {
        if (res.state == 1) {
          this.defaultSelBank = res.data
        }
      })
    },
    // 编辑
    edit() {
      if (this.isClick) {
        return false
      }
      this.isClick = true
      let userIds = []
      this.selPerson.forEach(item => {
        userIds.push(item.userId)
      })
      let param = {
        schedulingId: this.showDate.schedulingId,
        date: this.showDate.data,
        userIds: userIds
      }
      console.log(param)
      editSchedule(param).then(res => {
        if (res.state == 1) {
          this.cancelModel()
        }
        this.isClick = false
      })
    }
  }
}
</script>
<style lang="less">
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
    .list-text {
      max-width: 80%;
      display: block;
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
