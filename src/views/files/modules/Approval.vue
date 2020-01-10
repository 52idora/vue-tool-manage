<template>
  <a-modal
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="基础信息" key="1">
          <a-form :form="form" @submit="handleSubmit">
            <a-row>
              <a-col :md="24" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="{ span: 14 }" label="审批名称">
                  <a-input
                    v-decorator="[
                      'title',
                      { rules: [{ required: true, whitespace: true, message: '名称不能为空！' }] }
                    ]"
                    placeholder="请输入审批名称，字数不超过50个字"
                    :maxlength="50"
                  ></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="24" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="文件">
                  <ellipsis :length="50" tooltip> {{ detail.fileName }}</ellipsis></a-form-item
                >
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="24" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属项目">
                  <a-select
                    :getPopupContainer="
                      triggerNode => {
                        return triggerNode.parentNode
                      }
                    "
                    v-decorator="['projectId', { rules: [{ required: true, message: '请选择所属项目！' }] }]"
                    @change="handleProjectChange"
                  >
                    <a-select-option v-for="item in projectList" :key="item.index" :value="item.projectId">{{
                      item.title
                    }}</a-select-option>
                  </a-select>
                  <a-select
                    :getPopupContainer="
                      triggerNode => {
                        return triggerNode.parentNode
                      }
                    "
                    v-decorator="['dirId', { rules: [{ required: true, message: '请选择所属项目！' }] }]"
                    class="select_right"
                  >
                    <a-select-option v-for="item in dirList" :key="item.dirId" :value="item.dirId">{{
                      item.title
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <div class="clearfix">
                <a-upload
                  v-decorator="['images', { rules: [{ required: true, message: '请上传图片！' }] }]"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  :fileList="fileList"
                  :beforeUpload="beforeUpload"
                  accept="image/*"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 3">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleImgCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </a-row>
            <a-row>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="详情">
                <a-textarea
                  :rows="3"
                  v-decorator="['details', { rules: [{ required: false }] }]"
                  placeholder="请输入详情，字数不超过200个字"
                  :maxlength="200"
                />
              </a-form-item>
            </a-row>
            <a-row :gutter="48">
              <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
                <a-button htmlType="submit" type="primary">提交</a-button>
              </a-form-item>
            </a-row>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
import { getApprovalDetail, getApprovalSave, getApprovalUploadImg } from '@/api/file'
import { getProjectDirsList, projectGetProjects } from '@/api/manage'
import { Ellipsis } from '@/components'
import axios from 'axios'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
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
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  components: {
    Ellipsis
  },
  data() {
    return {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 19 },
        sm: { span: 19 }
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
      previewVisible: false,
      previewImage: '',
      detail: {},
      imageUrl: '',
      imgs: [],
      data: {
        title: '审批名称'
      },
      projectList: [],
      dirList: [],
      fileList: [],
      files: [],
      imgsList: []
    }
  },
  methods: {
    add(data) {
      console.log(data)
      this.form.resetFields()
      this.fileList = []
      this.detail = data
      this.confirmLoading = false
      this.visible = true
      this.getInit()
    },
    getInit(id) {
      projectGetProjects().then(res => {
        console.log(res)
        if (res.state == 1) {
          this.projectList = res.data
        }
      })
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this

      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = {
            title: values.title,
            details: values.details
          }
          let files = []
          params.files = files
          files.push({
            fileId: this.detail.fileId,
            projectId: values.projectId,
            dirId: values.dirId,
            images: this.imgs
          })

          getApprovalSave(params).then(res => {
            if (res.state == 1) {
              this.$notification.success({ message: '发起审批成功' })
              this.confirmLoading = false
              this.visible = false
              this.$emit('ok')
            } else {
              this.$notification.error({ message: '发起审批失败' })
              this.confirmLoading = false
            }
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    // 项目文件夹联动
    handleProjectChange(value) {
      getProjectDirsList({ projectId: value }).then(res => {
        this.dirList = res.data
      })
    },
    // 上传图片前
    // 上传文件之前beforeUpload
    beforeUpload(file) {
      console.log(file)
      if (file.size > 0 && file.size <= 5242880) {
        this.files = [...this.files, file]
      } else {
        this.$notification.error({
          message: '上传的图片不能小于0mb且不能大于5mb！'
        })
        return false
      }
    },
    handleCancel() {
      this.visible = false
    },
    handleImgCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange(info) {
      console.log(info)
      this.confirmLoading = true
      this.fileList = info.fileList
      console.log(info.fileList)
      getBase64(info.file.originFileObj, imageUrl => {
        this.imageUrl = imageUrl.substring(imageUrl.indexOf(',') + 1)
        // console.log(this.imageUrl)
        //   this.loading = false
        this.uploadImg()
      })
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
      }
    },
    // 上传图片
    uploadImg() {
      getApprovalUploadImg({ img: this.imageUrl }).then(res => {
        console.log(res)
        if (res.state == 1) {
          this.imgs.push(res.data)
          console.log(this.imgs)
          this.confirmLoading = false
        } else {
          this.confirmLoading = false
          this.$notification.error({
            message: '上传图片失败！'
          })
        }
      })
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
/*定义滚动条轨道 内阴影+圆角*/
.box::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #1b1b21;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
.box::-webkit-scrollbar {
  width: 10px;
  background-color: #202029;
}
/*定义滑块 内阴影+圆角*/
.box::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  background-color: #555;
}

/*定义滚动条轨道 内阴影+圆角*/
.history::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #1b1b21;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
.history::-webkit-scrollbar {
  width: 10px;
  background-color: #202029;
}
/*定义滑块 内阴影+圆角*/
.history::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.clearfix {
  /deep/.ant-upload-list-picture-card .ant-upload-list-item {
    width: 90px !important;
    height: 90px !important;
  }
  /deep/ .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  /deep/ .ant-upload.ant-upload-select-picture-card {
    width: 90px !important;
    height: 90px !important;
    background-color: transparent;
  }
}

.box {
  height: 320px;
  width: 100%;
  overflow: auto;
  border: 1px solid #9e9e9e;
  padding: 15px 20px 0;
}
.history {
  height: 150px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #9e9e9e;
  margin-top: 20px;
  ul {
    padding-left: 20px;
    li {
      list-style: none;
      line-height: 50px;
      height: 50px;
      span {
        display: inline-block;
        width: 20%;
      }
      .tips {
        width: 40%;
      }
    }
  }
}
.ant-select {
  width: 46%;
}
.select_right {
  float: right;
}
.imgs {
  ul {
    li {
      list-style: none;
      float: left;
      width: 90px;
      height: 90px;
      margin: 10px;
      border: 1px dashed #dcdcde;
      border-radius: 2px;
      position: relative;
      //   background-color: pink;
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
  }
}
.ant-row {
  margin: 5px 0;
}
.ant-form {
  /deep/ .ant-form-item-label {
    text-align: left;
  }
}
</style>
