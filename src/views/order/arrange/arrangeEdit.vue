<template>

  <div v-if="isFloorEdit">
    <div class="hotspot" :style="{width:hotsWidth+'px',height:hotsHeight+'px'}">
      <div
      draggable="false"
      v-for="(item,i) of hotspotList" 
      :key="item.id" class="hotspot-item" 
      :style="{left:item.leftX+'px',top:item.topY+'px',width:item.width+'px',height:item.height+'px'}"
      @mousedown="hotspotMouseDown($event,i)"
      :title="item.fileName"
      >
        <!-- <span>{{item.name}}</span>&nbsp; -->
        <a-icon type="close" style="margin-right:5px;" @click.stop="hotspotDelete(i)" />
      </div>
    </div>
    <div class="text-center m-t-20 m-b-20">
      <p>托盘打印时间：{{time | time}}</p>
      <a-button type="primary" @click="floorAdd()">保存</a-button>
    </div>
  </div>
</template>

<script>
let lodash = require('lodash')
export default {
  components: {
  },
  data() {
    return {
      //文件列表
      hotspotList:[],
      isFloorEdit:false,
      time:null,
      detail:null,//托盘详情
      index:null,
      hotsWidth:650,
      hotsHeight:650,
    }
  },
  created() {
  },

  methods: {
    //显示组件
    add(item,index){
      this.isFloorEdit = true;
      this.detail = item;
      this.index = index;
      if(item.trayType == 1){
        this.hotsWidth = 330;
        this.hotsHeight = 240;
      }else{
        this.hotsWidth = 650;
        this.hotsHeight = 650;
      }
      this.hotspotList = item.trayFiles;
      this.time = this.timeComputed;
    },
    // 标记保存
    floorAdd(){
      this.isFloorEdit = false;
      this.hotspotList.forEach((item) => {
        let height = item.height*1;
        item.minx = item.leftX;
        item.miny = this.hotsHeight-height-item.topY;
      })
      this.$emit("floorEditFile",{time:this.time,files:this.hotspotList,index:this.index})
    },
    //添加文件
    fileAdd(data){
      let file = {
        fileId:data.fileId,
        fileName:data.fileName,
        leftX:0,
        topY:0,
        printTime:data.printTime,
        width:data.length,
        height:data.width,
      }
      this.hotspotList.push(file);
      this.time = this.timeComputed;
    },
    //移除文件
    hotspotDelete(i){
      this.hotspotList.splice(i,1);
      this.time = this.timeComputed;
    },
    //拖拽事件
    hotspotMouseDown(e,i){
      let odiv = e.target;    //获取目标元素
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = (e)=>{    //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;  
        let top = e.clientY - disY;
        //移动当前元素
        // odiv.style.left = left + 'px';
        // odiv.style.top = top + 'px';
        this.hotspotList[i].leftX = left;
        this.hotspotList[i].topY = top;
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  },
  computed: {
    // 计算属性的 getter
    timeComputed(){
      // `this` 指向 vm 实例
      let time = 0;
      if(this.hotspotList){
        this.hotspotList.forEach((item) => {
          time += item.printTime*1;
        })
      }
      return time
    }
  },
  // 过滤器
  filters: {
  }
}
</script>
<style lang="less" scoped>
  .hotspot{
    margin: 20px auto;
    width: 650px;
    height: 650px;
    border: 1px solid rgba(0, 0, 0, 0.6);
    background: #2C2C3A;
    position: relative;
    overflow: hidden;
    &-item{
      position: absolute;
      left: 0;
      top: 0;
      background: RGBA(255, 13, 45, 0.6);
      border: 1px solid rgba(0, 0, 0, 0.6);
      text-align: center;
      width: 100px;
      height: 60px;
      text-align: right;
      cursor: pointer;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Chrome/Safari/Opera */
      -khtml-user-select: none; /* Konqueror */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; 
      .close{
          padding-right: 10px;
          padding-top: 5px;
          text-align: right;
        }
    }
  }
</style>