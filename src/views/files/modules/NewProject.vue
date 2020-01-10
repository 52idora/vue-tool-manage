<template>
  <a-modal :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel" :footer="null">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-row>
          <a-col :md="24" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="{ span: 10 }" label="项目名称">
              <a-input
                v-decorator="['title', { rules: [{ required: true, whitespace: true, message: '名称不能为空！' }] }]"
                placeholder="请输入项目名称"
                :maxlength="50"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
            <a-textarea
              :rows="3"
              v-decorator="['remark']"
              placeholder="此项目保存41码男鞋所有文件，包括鞋舌、鞋面、鞋跟。。。"
              :maxlength="200"
            />
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目封面">
            <div class="clearfix">
              <a-upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                :fileList="fileList"
                v-decorator="['img', { rules: [{ required: true, message: '请上传图片！' }] }]"
                @preview="handlePreview"
                @change="handleChange"
                accept="image/*"
                :beforeUpload="beforeUpload"
              >
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleImgCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
          </a-form-item>
        </a-row>

        <a-row :gutter="48">
          <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
            <a-button htmlType="submit" type="primary">保存</a-button>
          </a-form-item>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getProjectSave } from '@/api/file'
import { Ellipsis } from '@/components'
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
      imageUrl: '',
      previewImage: '',
      fileList: []
    }
  },
  methods: {
    add() {
      this.visible = true
      this.imageUrl = ''
      this.fileList = []
      this.confirmLoading = false
      this.form.resetFields()
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        console.log(values)
        if (!errors) {
          values.imgUrl = this.imageUrl
          console.log('values', values)
          getProjectSave(values).then(res => {
            console.log(res)
            if (res.state == 1) {
              this.$notification.success({
                message: '新建项目成功'
              })
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
            } else {
              this.$notification.error({
                message: '新建项目失败'
              })
              this.confirmLoading = false
            }
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    beforeUpload(file) {
      console.log(file)
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 5MB!')
      }
      return isLt2M
    },
    customRequest() {
      return false
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
      getBase64(info.file.originFileObj, imageUrl => {
        this.imageUrl = imageUrl.substring(imageUrl.indexOf(',') + 1)
        this.loading = false
      })
      this.fileList = info.fileList
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
      //   background-color: pink;
      img {
        width: 100%;
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
