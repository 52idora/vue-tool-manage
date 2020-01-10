<template>
  <span class="time">
    <span class="m-r-20">
      <a-select :defaultValue="currentYear" style="width: 90px" @change="yearChange">
        <a-select-option value="2009">2009年</a-select-option>
        <a-select-option value="2010">2010年</a-select-option>
        <a-select-option value="2011">2011年</a-select-option>
        <a-select-option value="2012">2012年</a-select-option>
        <a-select-option value="2013">2013年</a-select-option>
        <a-select-option value="2014">2014年</a-select-option>
        <a-select-option value="2015">2015年</a-select-option>
        <a-select-option value="2016">2016年</a-select-option>
        <a-select-option value="2017">2017年</a-select-option>
        <a-select-option value="2018">2018年</a-select-option>
        <a-select-option value="2019">2019年</a-select-option>
        <a-select-option value="2020">2020年</a-select-option>
        <a-select-option value="2021">2021年</a-select-option>
        <a-select-option value="2022">2022年</a-select-option>
        <a-select-option value="2023">2023年</a-select-option>
        <a-select-option value="2024">2024年</a-select-option>
        <a-select-option value="2025">2025年</a-select-option>
        <a-select-option value="2026">2026年</a-select-option>
        <a-select-option value="2027">2027年</a-select-option>
        <a-select-option value="2028">2028年</a-select-option>
      </a-select>
    </span>
    <span class="m-r-20">
      <a-select :defaultValue="currentMonth" style="width: 90px" @change="monthChange">
        <a-select-option value="12">12月</a-select-option>
        <a-select-option value="11">11月</a-select-option>
        <a-select-option value="10">10月</a-select-option>
        <a-select-option value="9">9月</a-select-option>
        <a-select-option value="8">8月</a-select-option>
        <a-select-option value="7">7月</a-select-option>
        <a-select-option value="6">6月</a-select-option>
        <a-select-option value="5">5月</a-select-option>
        <a-select-option value="4">4月</a-select-option>
        <a-select-option value="3">3月</a-select-option>
        <a-select-option value="2">2月</a-select-option>
        <a-select-option value="1">1月</a-select-option>
      </a-select>
    </span>
    <span class="m-r-20">
      <a-select :defaultValue="currentWeek" style="width: 90px" @change="weekChange">
        <a-select-option value="1">第1周</a-select-option>
        <a-select-option value="2">第2周</a-select-option>
        <a-select-option value="3">第3周</a-select-option>
        <a-select-option value="4">第4周</a-select-option>
        <a-select-option value="5">第5周</a-select-option>
      </a-select>
    </span>
  </span>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

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
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      currentWeek:'',
      currentMonth:'',
      currentYear:'',
      weekNum:0,
      // 查询参数
      queryParam: {}
    }
  },
  filters: {},
  created() {
    this.getMonthWeek();
  },
  methods: {
    weekChange(value){
      this.currentWeek = value;
      this.cancelModel(true);
    },
    monthChange(value){
      this.currentMonth = value;
       this.cancelModel(true);
    },
    yearChange(value){
      this.currentYear = value;
       this.cancelModel(true);
    },
    getMonthWeek(){
      let date=new Date();
      let currentDay = date.getDate();
      this.currentYear = date.getFullYear();
      this.currentMonth =date.getMonth()+1;
      let week;
      date.setDate(1);
      let dateStart = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();  
      let start = new Date(dateStart).getDay();
      if(start == 0){
        currentDay / 7  == 0 ?  week = parseInt(currentDay / 7) : week = parseInt(currentDay / 7)+1;
      }else{
        let temp =  currentDay - (7 - start);
        temp / 7  == 0 ?  week = parseInt(temp / 7) : week = parseInt(temp / 7)+1;
      }
      this.currentWeek =  week;
       this.cancelModel('false');
    },
    cancelModel(item) {
      this.$emit('childTime', {
        week:this.currentWeek,
        month:this.currentMonth,
        year:this.currentYear,
        isFirst:item
      })
    }
  }
}
</script>
<style lang="less">
</style>
