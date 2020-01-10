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
                <a-form-item :labelCol="labelCol" :wrapperCol="{ span: 10 }" label="审批名称">
                  <a-input
                    v-decorator="[
                      'title',
                      { rules: [{ required: true, whitespace: true, message: '名称不能为空！' }] }
                    ]"
                    placeholder="请输入名称，字数不超过50个字"
                    :maxlength="50"
                  ></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="box">
              <a-row>
                <a-col :md="12" :sm="12" style="text-align: center">文件</a-col>

                <a-col :md="12" :sm="12" style="text-align: center">所属项目</a-col>
              </a-row>

              <div v-for="item in dataList" :index="item.index" :key="item.id">
                <a-row>
                  <a-col :md="12" :sm="12">
                    <ellipsis :length="25" tooltip>{{ item.fileName }} </ellipsis></a-col
                  >

                  <a-col :md="12" :sm="12">
                    <a-select
                      :getPopupContainer="
                        triggerNode => {
                          return triggerNode.parentNode
                        }
                      "
                      v-model="item.projectId"
                      @change="handleProjectChange"
                    >
                      <a-select-option v-for="item in projectList" :key="item.projectId">
                        {{ item.title }}
                      </a-select-option>
                    </a-select>
                    <a-select
                      :getPopupContainer="
                        triggerNode => {
                          return triggerNode.parentNode
                        }
                      "
                      v-model="item.dirId"
                      class="select_right"
                    >
                      <!-- v-decorator="['dirId',{ rules: [{ required: true,  message: '请选择所属项目！' }] } ]" -->
                      <a-select-option v-for="item in dirList" :key="item.index" :value="item.dirId">{{
                        item.title
                      }}</a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
                <a-row>
                  <div class="clearfix" @click="change(item.fileId)" :key="aa">
                    <a-upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      :fileList="fileList"
                      accept="image/*"
                      :beforeUpload="beforeUpload"
                      @preview="handlePreview"
                      @change="handleChange"
                      :disabled="item.disabled"
                    >
                      <div v-if="fileList.length < 3">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">Upload</div>
                      </div>
                    </a-upload>
                    <ul class="upload_img">
                      <!-- <span>{{item.fileList.length}}</span> -->
                      <li v-for="i in item.fileList" :key="i.index">
                        <img :src="i" alt />
                      </li>
                    </ul>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleImgCancel">
                      <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                  </div>
                </a-row>
              </div>
            </div>
            <a-row>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="详情">
                <a-textarea
                  :rows="3"
                  v-decorator="['details']"
                  placeholder="请输入详情，字数不超过200个字"
                  :maxlength="200"
                />
              </a-form-item>
            </a-row>
            <!-- <a-row>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
                <a-textarea placeholder="0/200" :rows="3" />
              </a-form-item>
            </a-row>-->
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
import { Ellipsis } from '@/components'
import { getApprovalSave, getApprovalUploadImg } from '@/api/file'
import { getProjectDirsList, projectGetProjects } from '@/api/manage'
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
      fileList: [],
      fileId: '',
      imageUrl: '',
      projectList: [],
      dirList: [],
      files: [],
      dataList: [],
      aa: 1
    }
  },
  methods: {
    add(data) {
      this.aa = 1
      this.form.resetFields()

      data.map(item => {
        item.fileList = []
        item.images = []
        item.disabled = false
      })
      console.log(data)
      this.dataList = data
      this.visible = true
      this.getInit()
    },
    // 项目列表初始化
    getInit(id) {
      projectGetProjects().then(res => {
        console.log(res)
        if (res.state == 1) {
          this.projectList = res.data
        }
      })
    },
    // 文件夹列表联动
    handleProjectChange(value) {
      getProjectDirsList({ projectId: value }).then(res => {
        this.dirList = res.data
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
          for (let i = 0; i < this.dataList.length; i++) {
            files.push({
              fileId: this.dataList[i].fileId,
              projectId: this.dataList[i].projectId,
              dirId: this.dataList[i].dirId,
              images: this.dataList[i].images
            })
          }
          console.log('values', params)
          this.confirmLoading = false
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
    // 上传文件之前beforeUpload
    beforeUpload(file) {
      this.imageUrl = ''

      if (file.size > 0 && file.size <= 5242880) {
        getBase64(file, imageUrl => {
          this.imageUrl = imageUrl.substring(imageUrl.indexOf(',') + 1)
          this.customRequest()
          return
          //   this.uploadImg(this.fileId)
        })
      } else {
        this.$notification.error({
          message: '上传的图片不能小于0mb且不能大于5mb！'
        })
        return false
      }
    },
    // 上传图片
    customRequest(info) {
      getApprovalUploadImg({ img: this.imageUrl }).then(res => {
        if (res.state == 1) {
          this.dataList.map(item => {
            if (item.fileId == this.fileId) {
              item.fileList.push('https://src.raise3d.cn/factory/' + res.data)
              item.images.push(res.data)
              if (item.fileList.length >= 3) {
                item.disabled = true
              }
            }
            this.aa = this.aa + 1
          })
          return
          this.confirmLoading = false
        } else {
          this.confirmLoading = false
          this.$notification.error({
            message: '上传图片失败！'
          })
        }
      })
    },
    handleChange(info) {},
    handleCancel() {
      this.visible = false
      this.$emit('cancle')
    },
    handleImgCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    change(id) {
      this.fileId = id
      return
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
    display: inline-block;
    background-color: transparent;
  }
  .upload_img {
    float: left;
    height: 10px;
    padding-left: 0;
    li {
      float: left;
      list-style: none;
      width: 90px;
      padding: 8px;
      height: 90px;
      margin-right: 10px;
      border: 1px dashed rgb(59, 59, 76);
      border-radius: 5px;
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
.ant-row {
  margin: 5px 0;
}
.ant-form {
  /deep/ .ant-form-item-label {
    text-align: left;
  }
}
</style>
