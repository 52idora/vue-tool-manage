<template>
  <a-drawer placement="right" :closable="false" @close="onClose" :visible="visible" :width="500">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row style="text-align:right">
          <a-button type="primary" style="margin-right:20px" @click="handleSlice()">切片</a-button>
          <a-button class="default_btn" @click="handleIntoPublic">复制到公海文件夹</a-button>
        </a-row>
        <a-row :gutter="48" style="border-bottom: 1px solid #14141c;">
          <a-col :md="24" :sm="24">
            <a-form-item>
              <span v-decorator="['fileName']">{{ data.fileName }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="tabs_top" style="border-bottom:0;margin-top:20px">基础信息</div>

        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item>
              <div class="img_gcode">
                <img :src="'https://src.raise3d.cn/factory/' + data.imgUrl" alt />
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
              <span v-decorator="['name']">{{ data.comment }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <batch-slicing ref="batchSlicing" @ok="handleOk" />
    </a-spin>
  </a-drawer>
</template>

<script>
import { Slider } from 'ant-design-vue'
import BatchSlicing from './BatchSlicing'
import { getMyFileDetail, getMyFileList, getMyFileIntoPublic, getMyFileDetailUrl } from '@/api/file'
import { a } from '@/utils/exeUtil'
export default {
  components: { Slider, BatchSlicing },
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
      data: {},
      fileId: '',
      fileUrl: '',
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    add(id) {
      this.getInit(id)
      this.fileId = id
    },
    getInit(id) {
      getMyFileDetail({ fileId: id }).then(res => {
        console.log(res)
        if (res.state == 1) {
          this.visible = true
          this.data = res.data
        }
      })
    },
    // 复制到公海文件夹
    handleIntoPublic() {
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
    },
    // 切片
    handleSlice() {
      let that = this
      console.log(a)
      //   that.confirmLoading = true
      getMyFileDetailUrl({ filePath: that.data.filePath }).then(res => {
        console.log(res)
        if (res.state == 1) {
          let exe = a
          console.log(exe)
          that.fileUrl = res.data
          exe.jump('ideaMaker://download/?fileUrl=' + that.fileUrl + '&fileName=' + that.data.fileName, function() {
            //打开下载ideamaker弹框
            // that.$confirm()
            that.$confirm({
              title: '提示',
              content: '是否前往下载ideaMaker ?',
              onOk: () => {
                window.open('https://www.raise3d.cn/ideamaker/')
                // this.$router.push({ path: '/user/login' })
              },
              onCancel() {}
            })

            /* that.$confirm({
              closeAnimation: 'top',
              animationSpeed: 200,
              title: $filter('translate')('common.tips'),
              content: $filter('translate')('common.download_ideamaker'),
              buttons: {
                no: {
                  text: $filter('translate')('dashboard.cancel'),
                  btnClass: 'btn-danger'
                },
                ok: {
                  text: $filter('translate')('dashboard.confirm'),
                  btnClass: 'btn-primary',
                  keys: ['enter'], // will trigger when enter is pressed
                  action: function(scope) {
                    window.open(
                      vm.server == 'ali' ? 'https://www.raise3d.cn/ideamaker/' : 'https://www.raise3d.com/ideamaker/'
                    )
                  }
                }
              }
            }) */
          })
        }
      })
    },
    handleOk() {},
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
