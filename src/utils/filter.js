import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('date', function (dataStr, pattern = 'YYYY-MM-DD') {
  return moment(dataStr).format(pattern)
})

Vue.filter('FileSize',function (value){
    let convalue
    value = value *1
    if(value < 1024){
        convalue=value.toFixed(0)+'Byte';
    } else if(value<(1024*1024)){
        convalue=(value/1024).toFixed(0)+'KB'
    } else if(value<(1024*1024*1024)){
        convalue=(value/(1024*1024)).toFixed(1)+'MB';
    } else {
        convalue=(value/(1024*1024*1024)).toFixed(2)+'G';
    }
    return convalue;
})

Vue.filter('time',function (value){
  let convalue
  if(!value){
    return "--"
  }
  value = value *1
  if(value<60){
    convalue = value+ '秒';
  }else if(value<(60*60)){
    convalue = Math.floor(value/60) +'分';
  }else if(value<(60*60*24)){
    let h = Math.floor(value/60/60);
    let m = value - h*60*60;
    convalue = h +'小时'+ Math.floor(m/60) +'分';
  }else{
    let d = Math.floor(value/60/60/24);
    let h = Math.floor((value-(d*24*60*60))/60/60);
    let m = value - h*60*60 - d*24*60*60;
    convalue = d+'天'+h +'小时'+ Math.floor(m/60) +'分';
  }
  return convalue;
})
