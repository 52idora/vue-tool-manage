<template>
  <a-modal :width="700" :visible="visible" okText="保存" @cancel="handleCancel" :footer="null">
    <a-card :bordered="false" :body-style="{padding: '0px 20px 20px'}">
      <a-form :form="form">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item label="领取人员" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <a-select
                v-decorator="['applyUser', { rules: [{ required: true,  message: '请选择领取人员！' }] }]"
                :getPopupContainer="
                triggerNode => {
                return triggerNode.parentNode
                }
                "
                showSearch
                labelInValue
                placeholder="请选择领取人员"
                optionFilterProp="children"
                style="width: 200px"
                @change="handleChange"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="item in userList"
                  :key="item.userId"
                  :value="item.userId"
                >{{item.userName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item label="条码区" :labelCol="{span:6}" :wrapperCol="{span:8}">
              <a-input
                ref="input"
                :maxLength="100"
                :autofocus="autofocus"
                @pressEnter="handlePressEnter"
                v-model="volumeNo"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item label="领取情况" :labelCol="{span:6}" :wrapperCol="{span:14}">
              <div class="apply_box">
                <ul>
                  <li>
                    <div class="apply_code">编码</div>
                    <div>颜色</div>
                  </li>
                  <li v-for="item in dataList" :key="item.index">
                    <div class="apply_code">{{item.volumeNo}}</div>
                    <div>{{item.filamentColor}}</div>
                  </li>
                </ul>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="text-center m-t-20">
        <a-button type="primary" @click="handleSubmit">完成</a-button>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { filamentVolumeGetNoList, filamentVolumeApply } from '@/api/manage'
import { getUserList } from '@/api/setting'
import { STable } from '@/components'
let lodash = require('lodash')
export default {
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      userName: '',
      autofocus: true,
      dataList: [],
      userList: [],
      volumeNo: '',
      applyUser: '',
      form: this.$form.createForm(this)
    }
  },
  created() {},

  methods: {
    add() {
      this.visible = true
      this.dataList = []
      this.autofocus = true
      this.getInit()
    },
    // 初始化数据
    getInit() {
      getUserList({ a: '' }).then(res => {
        console.log(res, 1)
        this.userList = res.data
      })
    },
    // 监听回调
    handlePressEnter(value) {
      console.log(this.volumeNo)
      filamentVolumeGetNoList({ volumeNo: this.volumeNo }).then(res => {
        console.log(res)
        if (res.state == 1) {
          this.dataList.push(res.data)
          this.volumeNo = ''
        } else {
          this.volumeNo = ''
          this.$notification.error({ message: '打印信息获取失败' })
        }
      })
    },
    // 入库卷数变化
    handleChange(value) {
      console.log(`selected `, value)
      this.applyUser = value.key
      console.log(this.applyUser)
    },
    handleCancel() {
      this.visible = false

      this.form.resetFields()
    },
    handleSubmit(e) {
      //filamentVolumeApply
      e.preventDefault()
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          let ids = []
          for (let i = 0; i < that.dataList.length; i++) {
            console.log(that.dataList[i].volumeId)
            ids.push(that.dataList[i].volumeId)
          }
          const params = {
            applyUser: that.applyUser,
            volumeIds: ids
          }
          console.log(params)
          filamentVolumeApply(params).then(res => {
            if (res.state == 1) {
              that.$notification.success({ message: '领取成功' })
              that.$emit('ok')
              that.visible = false
              that.form.resetFields()
            } else {
              that.$notification.error({ message: '领取失败' })
            }
          })
        }
      })
    },
    // 下拉框模糊查询
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  },
  // 过滤器
  filters: {}
}
</script>
<style lang="less" scoped>
.l-h-45 {
  line-height: 45px;
}
.file-list {
  margin-top: 20px;
  max-height: 320px;
  overflow: auto;
}
.ant-modal-body {
  padding-top: 50px;
}
/deep/ .ant-form {
  padding-top: 20px;
}
.apply_box {
  width: 100%;
  height: 200px;
  border: 1px solid #3b3444;
  overflow: auto;
  ul {
    height: 100px;
    padding-left: 5px;
    li {
      list-style: none;
      float: left;
      line-height: 30px;
      div {
        display: inline-block;
      }
      .apply_code {
        width: 200px;
      }
    }
  }
}
</style>