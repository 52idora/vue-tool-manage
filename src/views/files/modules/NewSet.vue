<template>
  <a-modal
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-row>
          <a-col :md="24" :sm="24">
            <a-form-item :labelCol="{ span: 8 }" :wrapperCol="{ span: 10 }" label="成套名称">
              <a-input
                v-decorator="['title', { rules: [{ required: true, whitespace: true, message: '名称不能为空！' }] }]"
                placeholder="请输入成套名称"
                :maxlength="50"
              ></a-input>
            </a-form-item>
          </a-col>
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
import { Ellipsis } from '@/components'
import { getProjectDirSetSave } from '@/api/file'
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
      dirId: '',
      form: this.$form.createForm(this)
    }
  },
  methods: {
    add(id) {
      this.dirId = id
      this.visible = true
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.dirId = this.dirId
          getProjectDirSetSave(values).then(res => {
            if (res.state == 1) {
              this.$notification.success({
                message: '添加成功'
              })
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
            } else {
              this.$notification.error({
                message: '添加失败'
              })
            }
          })
          console.log('values', values)
        } else {
          this.confirmLoading = false
        }
      })
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
    handleChange({ fileList }) {
      this.fileList = fileList
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
    // text-align: left;
  }
}
</style>
