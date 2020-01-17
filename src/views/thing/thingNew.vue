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
          label="物品名称"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input
            v-decorator="[
              'thingName',
              {rules: [{ required: true,whitespace:true, message: '请输入物品名称' }]}
            ]"
            :maxlength="50"
          />
        </a-form-item>
        <a-form-item
          label="物品数量"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input
            v-decorator="[
              'totalNum',
              {rules: [{ required: true,whitespace:true, message: '请输入物品数量' }]}
            ]"
            :maxlength="50"
          />
        </a-form-item>
        <a-form-item
          label="物品备注"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-textarea
            v-decorator="[
              'remark',
              {rules: [{ required: false,whitespace:true, message: '请输入物品备注' }]}
            ]"
            :maxlength="500"
          />
        </a-form-item>
        <a-form-item
          label="分类"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-select @change="handleTypeChange"
            v-decorator="[
              'typeId',
              {rules: [{ required: true, message: '请选择分类' }]}
            ]"
            :maxlength="50"
          >
            <a-select-option v-for="t in types" :key="t.id" :value="t.id">{{t.type_name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="条形码"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input
            v-decorator="[
              'thingNo',
              {rules: [{ required: true,whitespace:true, message: '请输入条形码' }]}
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
  import {thingAdd } from '@/api/thing'
  import {typeAll } from '@/api/type'
  import ATextarea from "ant-design-vue/es/input/TextArea";
  let lodash = require('lodash')
  export default {
    components: {
      ATextarea,
      STable
    },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        title: '物品录入',
        form: this.$form.createForm(this),
        types: []
      }
    },
    created() {
      this.getTypes()
    },

    methods: {
      add(record = null) {
        this.form.resetFields()
        if (record == null) {
          this.title = '物品录入'
          this.visible = true
          this.filamentId = null
          this.form.setFieldsValue({
            departName: null
          })
        } else {
          this.getDetail(record.id)
        }
      },
      handleCancel() {
        this.visible = false
      },
      handleOk() {
        this.visible = false
      },
      getDetail(id) {
        thingFind({ thingId: id }).then(res => {
          if (res.state == 1) {
            console.log(res.data)
          } else {
            this.$notification.error({ message: '失败' })
          }
        })
      },
      handleSubmit(e) {
        this.form.validateFields((err, values) => {
          if (!err) {
            thingAdd(
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
      },
      getTypes(){
        typeAll().then(res => {
          if(res.state == 1){
            this.types = res.data
          }
        })
      },
      handleTypeChange(){
        document.getElementById('thingNo').focus()
      },
    },
    // 过滤器
    filters: {}
  }
</script>
