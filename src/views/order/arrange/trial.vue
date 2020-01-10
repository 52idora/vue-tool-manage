<template>
<a-card :bordered="false" :body-style="{padding: '0'}">
  <a-modal
  :title="'试算结果'"
  :width="600"
  :visible="visible"
  @cancel="handleCancel"
  :footer="null"
  >
    <a-card :bordered="false" :body-style="{padding: '20px 20px 20px'}">
      <div class="trial">
        <a-row v-for="item of trialList" :key="item.inventoryId" class="trial-list">
          <a-col :span="20" class="p-l-24">{{item.inventoryName}}</a-col>
          <a-col :span="4" class="fz-24">
            <span v-if="item.isPass"><a-icon type="check-circle" /></span>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>有缺失部件，点击查看详情</span>
              </template>
              <span v-if="!item.isPass" class="yellow"><a-icon type="exclamation-circle" @click="item.select = !item.select" /></span>
            </a-tooltip>
          </a-col>
          <a-col :span="24" v-if="item.inventoryFiles && item.select">
            <a-row v-for="data of item.inventoryFiles" :key="data.fileId" class="trial-list-item">
              <a-col :span="12" class="p-l-24">{{data.fileName}}</a-col>
              <a-col :span="12">{{data.deficiencyNumber}}</a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      
    </a-card>
  </a-modal>
</a-card>
</template>

<script>
import { STable } from '@/components'
import { machineTrayTrialBalance } from '@/api/manage'
let lodash = require('lodash')

export default {
  components: {
    STable
  },
  data() {
    return {
      //新建托盘
      visible:false,
      trialList:[]
    }
  },
  created() {
  },

  methods: {
    //添加托盘弹框
    handleCancel(){
      this.visible = false;
    },
    //增加托盘
    add(data){
      machineTrayTrialBalance(Object.assign(data)).then(res => {
        if (res.state == 1) {
          this.visible = true;
          res.data.forEach(element => {
            element.select = false;
          });
          this.trialList = res.data;
        }else{
          this.$notification.error({message: '失败'});
        }
      })
    }
  },
  // 过滤器
  filters: {
  }
}
</script>
<style lang="less" scoped>
.trial{
  border: 1px solid RGBA(16, 16, 25, 1);
  .trial-list{
    line-height: 60px;
    background: RGBA(44, 44, 58, 1);
    border-bottom: 1px solid RGBA(16, 16, 25, 1);
    &-item{
      background: RGBA(30, 30, 42, 1);
      border-bottom: 1px solid RGBA(16, 16, 25, 1);
    }
    &-item:last-child{
      border-bottom: none;
    }
  }
  .trial-list:last-child{
    border-bottom: none;
  }
  .l-h-60{
    line-height: 60px;
  }
  .yellow{
    color: RGBA(255, 172, 0, 1);
  }
}
</style>