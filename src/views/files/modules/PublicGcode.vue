<template>
  <a-drawer placement="right" :closable="false" @close="onClose" :visible="visible" :width="600">
    <a-spin :spinning="confirmLoading">
      <a-tabs defaultActiveKey="1">
        <div class="extra-wrapper" slot="tabBarExtraContent">
          <div class="extra-item">
            <a-button class="default_btn" @click="handlePrivate()">复制到我的文件</a-button>
          </div>
        </div>
        <a-tab-pane tab="基础信息" key="1">
          <a-form :form="form">
            <a-row :gutter="48">
              <a-col :md="24" :sm="24">
                <a-form-item label="文件名称" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                  <ellipsis :length="50" tooltip>{{ basicList.fileName }}</ellipsis>
                </a-form-item>
              </a-col>
            </a-row>

            <div class="tabs_top">文件信息</div>

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
                  <span v-if="basicList.printTime == null">--</span>
                  <span v-else>{{ basicList.printTime | time }}</span>
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
        <a-tab-pane tab="" key="2"> </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-drawer>
</template>

<script>
import { Ellipsis } from '@/components'
import { getFilePublicDetail, getFilePublicIntoPrivate } from '@/api/file'
export default {
  components: {
    /* CreateForm,
    StepByStepModal */
    Ellipsis
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
      historyList: [
        {
          id: 1,
          date: '2019-10-10',
          status: '审核通过',
          name: 'anni'
        },
        {
          id: 2,
          date: '2019-10-10',
          status: '审核通过',
          name: 'anni',
          tips: '顶层打印不合格'
        },
        {
          id: 3,
          date: '2019-10-10',
          status: '审核通过',
          name: 'anni',
          tips: '顶层打印不合格'
        },
        {
          id: 4,
          date: '2019-10-10',
          status: '审核通过',
          name: 'anni',
          tips: '顶层打印不合格'
        },
        {
          id: 5,
          date: '2019-10-10',
          status: '审核未通过',
          name: 'anni',
          tips: '顶层打印不合格'
        }
      ],
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
      basicList: {},
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
      this.tabsChange(1)
    },
    // tab
    tabsChange(key) {
      if (key == 1) {
        getFilePublicDetail({ fileId: this.fileId }).then(res => {
          console.log(res)
          if (res.state == 1) {
            if (res.data == null) {
              console.log('暂无详情')
              this.visible = true
            }
            this.visible = true
            console.log('1', res)
            this.basicList = res.data
            this.imgUrl = `https://src.raise3d.cn/factory/${res.data.imgUrl}`
            for (let i = 0; i < this.modeList.length; i++) {
              if (this.modeList[i].id == this.basicList.printMode) {
                this.printMode = this.modeList[i].text
              }
            }
          }
        })
      } else {
        console.log('历史')
      }
    },
    // 复制到我的文件夹
    handlePrivate() {
      this.confirmLoading = true
      getFilePublicIntoPrivate({ fileId: this.fileId }).then(res => {
        console.log(res)
        if (res.state == 1) {
          this.confirmLoading = false
          this.$notification.success({
            message: '复制到我的文件成功'
          })
        } else {
          this.confirmLoading = false
          this.$notification.error({
            message: '复制到我的文件失败'
          })
        }
      })
    },
    // 打印
    handlePrint() {},
    onClose() {
      this.visible = false
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
  overflow: hidden;
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
</style>
