<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    okText="保存"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-card :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="部门名称"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input
            v-decorator="[
              'departName',
              {rules: [{ required: true,whitespace:true, message: '请输入部门名称' }]}
            ]"
            :maxlength="50"
          />
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">提交</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
</template>

<script>

  import { STable } from '@/components'
  import {departAdd, departEdit } from '@/api/depart'
  let lodash = require('lodash')
  export default {
    components: {
      STable
    },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        title: '新建物料',
        form: this.$form.createForm(this),
      }
    },
    created() {},

    methods: {
      add(record = null) {
        this.form.resetFields()
        if (record == null) {
          this.title = '新建部门'
          this.visible = true
          this.filamentId = null
          this.form.setFieldsValue({
            departName: null
          })
        } else {
          this.getFilamentDetail(record.filamentId)
        }
      },
      handleCancel() {
        this.visible = false
      },
      handleOk() {
        this.visible = false
      },
      getFilamentDetail(filamentId) {
        this.filamentId = filamentId
        filamentDetail(Object.assign({ filamentId: filamentId })).then(res => {
          if (res.state == 1) {
            setTimeout(() => {
              this.form.setFieldsValue({
                filamentName: res.data.filamentName,
                filamentBrand: res.data.filamentBrand,
                filamentTextures: res.data.filamentTextures,
                remark: res.data.remark
              })
              this.filamentDensity.value = res.data.filamentDensity
              this.filamentDiameter.value = res.data.filamentDiameter
              this.filamentSpecs.value = res.data.filamentSpecs
              this.temperature.value = res.data.temperature
              this.title = '修改物料'
              this.visible = true
            }, 0)
          } else {
            this.$notification.error({ message: '失败' })
          }
        })
      },
      handleSubmit(e) {
        this.form.validateFields((err, values) => {
          if (!err) {
            departAdd(
              Object.assign(values, {
              })
            ).then(res => {
              if (res.state == 1) {
                this.visible = false
                this.$emit('ok', values)
                this.$notification.success({ message: '成功' })
              } else {
                this.$notification.error({ message: '失败' })
              }
            })
          }
        })
      }
    },
    // 过滤器
    filters: {}
  }
</script>
