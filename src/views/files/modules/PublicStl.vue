<template>
  <a-drawer placement="right" :closable="false" @close="onClose" :visible="visible" :width="500">
    <a-spin :spinning="confirmLoading">
      <a-tabs defaultActiveKey="1">
        <div class="extra-wrapper" slot="tabBarExtraContent">
          <div class="extra-item">
            <a-button class="default_btn" @click="handlePrivate()">复制到我的文件</a-button>
          </div>
        </div>
        <a-tab-pane tab="基础信息" key="1">
          <a-form :form="form">
            <a-row :gutter="48" style="border-bottom: 1px solid #14141c;">
              <a-col :md="24" :sm="24">
                <a-form-item label="文件名称" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                  <ellipsis :length="50" tooltip>{{ data.fileName }}</ellipsis>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="tabs_top" style="border-bottom:0;margin-top:20px">基础信息</div>

            <a-row :gutter="48" style="margin-bottom:20px">
              <a-col :md="24" :sm="24">
                <a-form-item>
                  <div class="img_gcode">
                    <img :src="'https://src.raise3d.cn/factory/' + data.imgUrl" />
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="48">
              <a-col :md="12" :sm="12">
                <a-form-item label="文件大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span v-decorator="['size']">{{ data.fileSize | FileSize }}</span>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="12">
                <a-form-item label="文件格式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span v-decorator="['format']">{{ data.fileType }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="48">
              <a-col :md="12" :sm="12">
                <a-form-item label="上传人" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span v-decorator="['userName']">{{ data.userName }}</span>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="12">
                <a-form-item label="上传日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span v-decorator="['date']">{{ data.created | date }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="48">
              <a-col :md="24" :sm="24">
                <a-form-item label="描述" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
                  <span>{{ data.comment }}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <batch-slicing ref="batchSlicing" @ok="handleOk" />
    </a-spin>
  </a-drawer>
</template>

<script>
import { Slider } from 'ant-design-vue'
import { getFilePublicDetail, getFilePublicIntoPrivate } from '@/api/file'
import { Ellipsis } from '@/components'
import BatchSlicing from './BatchSlicing'
export default {
  components: { Slider, BatchSlicing, Ellipsis },
  data() {
    return {
      disabled: false,
      labelCol: {
        xs: { span: 10 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 }
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
      visible: false,
      fileId: '',
      data: {},
      confirmLoading: false,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    add(id) {
      console.log(id)
      this.fileId = id

      this.getInit(id)
    },
    getInit(id) {
      getFilePublicDetail({ fileId: id }).then(res => {
        if (res.state == 1) {
          console.log(res)
          this.data = res.data
          this.visible = true
        } else {
          this.$notification.error({ message: '获取文件详情失败' })
        }
      })
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
    tabsChange(key) {},
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
    handleOk() {},
    handleMoreChange(value) {},
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
  transform: translate(75%);
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
</style>
