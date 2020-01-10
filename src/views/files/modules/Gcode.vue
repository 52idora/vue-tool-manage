<template>
  <a-drawer placement="right" :closable="false" @close="onClose" :visible="visible" :width="600">
    <a-spin :spinning="confirmLoading">
      <a-tabs defaultActiveKey="1" @change="tabsChange">
        <div class="extra-wrapper" slot="tabBarExtraContent">
          <div class="extra-item">
            <a-button style="margin-left: 8px;" type="primary" size="small" @click="$refs.approval.add(basicList)"
              >审批</a-button
            >
            <a-dropdown style="width: 100px;margin-left:20px">
              <a-menu slot="overlay" @click="handleMoreChange">
                <!-- <a-menu-item key="1">打印</a-menu-item> -->
                <a-menu-item key="2">gcode编辑</a-menu-item>
                <a-menu-item key="3">复制到公海</a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                更多
                <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </div>
        </div>
        <a-tab-pane tab="基础信息" key="1">
          <a-form :form="form">
            <div class="tabs_top">文件信息</div>
            <a-row :gutter="48">
              <a-col :md="24" :sm="24">
                <a-form-item label="文件名称" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                  <ellipsis :length="50" tooltip>{{ basicList.fileName }}</ellipsis>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="48">
              <a-col :md="12" :sm="12">
                <a-form-item label="文件大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ basicList.fileSize | FileSize }}</span>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="12">
                <a-form-item label="文件格式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ basicList.fileType }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="48">
              <a-col :md="12" :sm="12">
                <a-form-item label="上传人" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ basicList.userName }}</span>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="12">
                <a-form-item label="上传日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ basicList.created | date }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="tabs_top">模型信息</div>
            <a-row :gutter="48">
              <a-col :md="12" :sm="12">
                <a-form-item label="打印模式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ printMode }}</span>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="12">
                <a-form-item label="模型尺寸" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ basicList.length }}*{{ basicList.width }}*{{ basicList.height }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="48">
              <a-col :md="12" :sm="12">
                <a-form-item label="切片模版" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ basicList.binName }}</span>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="12">
                <a-form-item label="预计打印时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ basicList.printTime | time }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="48">
              <a-col :md="24" :sm="24">
                <a-form-item label="左喷嘴材料" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                  <span>{{ basicList.leftNozzleMaterial }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="48">
              <a-col :md="24" :sm="24">
                <a-form-item label="右喷嘴材料" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                  <span>{{ basicList.rightNozzleMaterial }}</span>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="48">
              <a-col :md="6" :sm="6" style="padding-right:0;">
                <a-form-item label="层高" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
                  <span>{{ basicList.layerHeight }}</span>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="6" style="padding-right:0;">
                <a-form-item label="层厚" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
                  <span>{{ basicList.shells }}</span>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="6" style="padding-right:0;">
                <a-form-item label="填充" :labelCol="labelCol3" :wrapperCol="wrapperCol3">
                  <span>{{ basicList.fillDensity }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="tabs_top" style="border-bottom:0;">Gcode预览</div>

            <a-row :gutter="48">
              <a-col :md="24" :sm="24">
                <a-form-item>
                  <div class="img_gcode">
                    <img :src="imgUrl" alt />
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane tab="审批历史" key="2" forceRender v-if="showHistory">
          <a-form :form="form">
            <a-row :gutter="48">
              <a-col :md="24" :sm="24" style="border-bottom:1px solid #000">
                <a-form-item label="文件名称" :labelCol="labelCol2">
                  <ellipsis :length="30" tooltip>{{ basicList.fileName }}</ellipsis>
                </a-form-item>
              </a-col>
            </a-row>
            <ul class="history_ul">
              <li v-for="item in basicList.histories" :key="item.id" :index="item.index">
                <a-row :gutter="48">
                  <a-col :md="24" :sm="24">
                    <span>审批人:</span>
                    <span>{{ item.userName }}</span>
                    <span>{{ item.state | stateFilter }}</span>
                    <span>{{ item.created | date }}</span>
                  </a-col>
                </a-row>
                <a-row :gutter="48">
                  <div class="history_remark" v-if="item.remark">
                    <a-col :md="24" :sm="24">
                      <a-form-item label="备注" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
                        <div>
                          <ellipsis style="width:100%" :length="50" tooltip>{{ item.remark }}</ellipsis>
                        </div>
                      </a-form-item>
                    </a-col>
                  </div>
                </a-row>
              </li>
            </ul>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <approval ref="approval" @ok="handleOk" />
      <code-mirror ref="codeMirror" @ok="handleOk" />
    </a-spin>
  </a-drawer>
</template>

<script>
import Approval from './Approval'
import CodeMirror from './CodeMirror'
import { Ellipsis } from '@/components'
import { getMyFileDetail, getMyFileList, getMyFileIntoPublic } from '@/api/file'
const statusMap = {
  '-1': {
    text: '我发起的'
  },
  0: {
    text: '未审批的'
  },
  1: {
    text: '审批通过的'
  },
  2: {
    status: 'success',
    text: '审批被驳回的'
  }
}
export default {
  components: {
    Approval,
    Ellipsis,
    CodeMirror
    /* CreateForm,
    StepByStepModal */
  },
  data() {
    return {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 9 }
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 15 }
      },
      labelCol2: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol2: {
        xs: { span: 19 },
        sm: { span: 19 }
      },
      labelCol3: {
        xs: { span: 12 },
        sm: { span: 12 }
      },
      wrapperCol3: {
        xs: { span: 12 },
        sm: { span: 12 }
      },

      modeList: [
        {
          id: 0,
          text: '普通打印'
        },
        {
          id: 1,
          text: '顺序打印'
        },
        {
          id: 2,
          text: '顺序复制'
        },
        {
          id: 3,
          text: '顺序镜像'
        },
        {
          id: 4,
          text: '复制'
        },
        {
          id: 5,
          text: '镜像'
        }
      ],
      showHistory: false,
      basicList: {},
      historyList: [],
      fileId: '',
      printMode: '',
      imgUrl: '',
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    add(id) {
      this.fileId = id
      this.defaultValue = '1'
      this.handleMoreChange('1')
      console.log(id)
      this.tabsChange(1)
    },
    tabsChange(key) {
      if (key == 1) {
        getMyFileDetail({ fileId: this.fileId }).then(res => {
          if (res.state == 1) {
            this.visible = true
            console.log(res)
            this.basicList = res.data
            if (this.basicList.histories.length != 0) {
              console.log(1)
              this.showHistory = true
            } else {
              console.log(12)
              this.showHistory = false
            }
            // this.historyList = res.data.histories
            this.imgUrl = `https://src.raise3d.cn/factory/${res.data.imgUrl}`
            for (let i = 0; i < this.modeList.length; i++) {
              if (this.modeList[i].id == this.basicList.printMode) {
                this.printMode = this.modeList[i].text
              }
            }
          }
        })
      } else {
      }
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleOk() {
      this.tabsChange(1)
    },
    handleMoreChange(e) {
      if (e.key == 1) {
        // 打印
        console.log('打印')
      } else if (e.key == 2) {
        // Gcode编辑
        this.$refs.codeMirror.add(this.fileId)
      } else if (e.key == 3) {
        // 复制到公海
        this.confirmLoading = true
        getMyFileIntoPublic({ fileId: this.fileId }).then(res => {
          if (res.state == 1) {
            this.confirmLoading = false
            this.$notification.success({
              message: '转入公海文件成功'
            })
          } else {
            this.confirmLoading = false
            this.$notification.error({
              message: '转入公海文件失败'
            })
          }
        })
      }
    },
    onClose() {
      this.visible = false
      console.log(1)
      this.$emit('ok')
    }
  },
  filters: {
    stateFilter(type) {
      return statusMap[type].text
    }
  }
}
</script>
<style lang="less" scoped>
.tabs_top {
  height: 35px;
  margin-bottom: 15px;
  margin-top: 5px;
  border-bottom: 1px solid #14141c;
}
.ant-row /deep/ .ant-form-item {
  margin-bottom: 6px;
}
.ant-form /deep/ .ant-form-item-label {
  text-align: left;
}
.img_gcode {
  width: 180px;
  height: 180px;
  transform: translate(100%);
  border: 1px dashed #97979d;
  position: relative;
  img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
.history_list {
  display: inline-block;
  width: 30%;
  text-align: left;
}
.history_ul {
  height: 10px;
  padding-left: 0;
  li {
    float: left;
    list-style: none;

    line-height: 40px;
    width: 100%;
    span {
      display: inline-block;
      width: 25%;
      text-align: left;
    }
    .history_remark {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
