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
          <a-col :md="12" :sm="12">
            <a-form-item label="左喷嘴材料" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                :getPopupContainer="
                        triggerNode => {
                            return triggerNode.parentNode
                        }
                        "
                v-decorator="[
                  'timeZone',
                  { rules: [{ initialValue: '0', required: true, message: 'Please select Zone' }] }
                ]"
                placeholder="请选择"
              >
                <a-select-option :value="0">AJ900系列</a-select-option>
                <a-select-option :value="1">Female</a-select-option>
                <a-select-option :value="2">Unknown</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="右喷嘴材料" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                :getPopupContainer="
                        triggerNode => {
                            return triggerNode.parentNode
                        }
                        "
                v-decorator="[
                  'timeZone',
                  { rules: [{ initialValue: '0', required: true, message: 'Please select Zone' }] }
                ]"
                placeholder="请选择"
              >
                <a-select-option :value="0">AJ900系列</a-select-option>
                <a-select-option :value="1">Female</a-select-option>
                <a-select-option :value="2">Unknown</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <a-form-item label="切片模版" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
              <a-select
                :getPopupContainer="
                        triggerNode => {
                            return triggerNode.parentNode
                        }
                        "
                v-decorator="[
                  'timeZone',
                  { rules: [{ initialValue: '0', required: true, message: 'Please select Zone' }] }
                ]"
                placeholder="请选择"
              >
                <a-select-option :value="0">AJ900系列</a-select-option>
                <a-select-option :value="1">Female</a-select-option>
                <a-select-option :value="2">Unknown</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
            <a-button htmlType="submit" type="primary">切片</a-button>
          </a-form-item>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { Ellipsis } from '@/components'
export default {
  components: {
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
        xs: { span: 5 },
        sm: { span: 5 }
      },
      wrapperCol2: {
        xs: { span: 19 },
        sm: { span: 19 }
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ],
      dataList: [
        {
          fileName: 'Raise3D_benchy_250*250mm',
          id: 1
        },
        {
          fileName: 'Raise3D_benchy_250*250mm',
          id: 2
        },
        {
          fileName: 'Raise3D_benchy_250*250mm',
          id: 3
        },
        {
          fileName: 'Raise3D_benchy_250*250mm',
          id: 4
        }
      ],
      historyList: [
        {
          id: 1,
          date: '2019-10-10',
          status: '审核通过',
          name: 'anni',
          tips: '顶层打印不合格不部分分页发热温柔'
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
      ]
    }
  },
  methods: {
    add() {
      this.visible = true
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
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.select_right {
  float: right;
}
.ant-form {
  margin-top: 20px;
  /deep/ .ant-form-item-label {
    // text-align: left;
  }
}
</style>
