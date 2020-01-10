<template>
  <div>
    <calendar @change="change" >
      <ul class="events" slot="dateCellRender" slot-scope="value">
        <li v-for="item in getListData(value)" :key="item.content">
          <a-tooltip placement="topLeft">
            <template slot="title">
              <span>{{item}}</span>
            </template>
            <span>{{item}}</span>
          </a-tooltip>
          <!-- <span class="one-line" title="{{item.content}}">{{item.content}}</span> -->
          <!-- <a-badge :status="item.type" :text="item.content" /> -->
        </li>
      </ul>
    </calendar>
  </div>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { Calendar } from 'ant-design-vue'
import { personCandaler } from '@/api/printer'
/* import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm' */
export default {
  name: 'person',
  components: {
    STable,
    Ellipsis,
    Calendar
  },
  data() {
    return {
      userId: '',
      dataArray: []
    }
  },
  created() {
    this.userId = this.$route.query.id;
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    this.getListData();
    this.getList(year,month);
  },
  methods: {
    getListData(value) {
      let listData
      if (!value) {
        return false
      }
      switch (value.date()) {
        case 1:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '01') {
              listData = item.shiftNameList
            }
          })
          break
        case 2:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '02') {
              listData = item.shiftNameList
            }
          })
          break
        case 3:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '03') {
              listData = item.shiftNameList
            }
          })
          break
        case 41:
         this.dataArray.forEach(item => {
            if (item.date.substring(3) == '04') {
              listData = item.shiftNameList
            }
          })
          break
        case 5:
         this.dataArray.forEach(item => {
            if (item.date.substring(3) == '05') {
              listData = item.shiftNameList
            }
          })
          break
        case 6:
         this.dataArray.forEach(item => {
            if (item.date.substring(3) == '06') {
              listData = item.shiftNameList
            }
          })
          break
        case 7:
         this.dataArray.forEach(item => {
            if (item.date.substring(3) == '07') {
              listData = item.shiftNameList
            }
          })
          break
        case 8:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '08') {
              listData = item.shiftNameList
            }
          })
          break
        case 9:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '09') {
              listData = item.shiftNameList
            }
          })
          break
        case 10:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '10') {
              listData = item.shiftNameList
            }
          })
          break
        case 11:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '11') {
              listData = item.shiftNameList
            }
          })
          break
        case 12:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '12') {
              listData = item.shiftNameList
            }
          })
          break
        case 13:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '13') {
              listData = item.shiftNameList
            }
          })
          break
        case 14:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '14') {
              listData = item.shiftNameList
            }
          })
          break
        case 15:
         this.dataArray.forEach(item => {
            if (item.date.substring(3) == '15') {
              listData = item.shiftNameList
            }
          })
          break
        case 16:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '16') {
              listData = item.shiftNameList
            }
          })
          break
        case 17:
         this.dataArray.forEach(item => {
            if (item.date.substring(3) == '17') {
              listData = item.shiftNameList
            }
          })
          break
        case 18:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '18') {
              listData = item.shiftNameList
            }
          })
          break
        case 19:
         this.dataArray.forEach(item => {
            if (item.date.substring(3) == '19') {
              listData = item.shiftNameList
            }
          })
          break
        case 20:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '20') {
              listData = item.shiftNameList
            }
          })
          break
        case 21:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '21') {
              listData = item.shiftNameList
            }
          })
          break
        case 22:
         this.dataArray.forEach(item => {
            if (item.date.substring(3) == '22') {
              listData = item.shiftNameList
            }
          })
          break
        case 23:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '23') {
              listData = item.shiftNameList
            }
          })
          break
        case 24:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '24') {
              listData = item.shiftNameList
            }
          })
          break
        case 25:
         this.dataArray.forEach(item => {
            if (item.date.substring(3) == '25') {
              listData = item.shiftNameList
            }
          })
          break
        case 26:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '26') {
              listData = item.shiftNameList
            }
          })
          break
        case 27:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '27') {
              listData = item.shiftNameList
            }
          })
          break
        case 28:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '28') {
              listData = item.shiftNameList
            }
          })
          break
        case 29:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '29') {
              listData = item.shiftNameList
            }
          })
          break
        case 30:
          this.dataArray.forEach(item => {
            if (item.date.substring(3) == '30') {
              listData = item.shiftNameList
            }
          })
          break
        case 31:
         this.dataArray.forEach(item => {
            if (item.date.substring(3) == '31') {
              listData = item.shiftNameList
            }
          })
          break
        default:
      }
      return listData || []
    },
    getList(year,month) {
      let param = {
        year: year,
        month: month,
        userId: this.userId
      }
      personCandaler(param).then(res => {
        if (res.state == 1) {
          this.dataArray = res.data;
        }
        console.log(this.dataArray)
      })
    },
    change(value){
      let d = value._d;
      let date = new Date(d);
      let year =  date.getFullYear();
      let month =  date.getMonth() + 1;
      this.getList(year,month);
    }
  }
}
</script>
<style lang="less">
.events {
  padding: 0;
  margin: 0;
  li {
    list-style: none;
  }
}
</style>
