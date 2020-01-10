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
          label="物料名称"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input
            v-decorator="[
              'filamentName',
              {rules: [{ required: true,whitespace:true, message: '请输入物料名称' }]}
            ]"
            :maxlength="50"
          />
        </a-form-item>
        <a-form-item
          label="品牌"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input
            v-decorator="[
              'filamentBrand',
              {rules: [{ required: true,whitespace:true, message: '请输入品牌' }]}
            ]"
            :maxlength="50"
          />
        </a-form-item>
        <a-form-item
          label="种类"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input
            v-decorator="[
              'filamentTextures',
              {rules: [{ required: true,whitespace:true, message: '请输入种类' }]}
            ]"
            :maxlength="30"
          />
        </a-form-item>
        <a-form-item
          label="密度"
          :validate-status="filamentDensity.validateStatus"
          :help="filamentDensity.errorMsg"
          :required="true"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input-number
            :min="0"
            :max="999999"
            style="width:260px;"
            :value="filamentDensity.value"
            @change="filamentDensityChange"
          />
          <span class="m-l-10">
            g/cm
            <sup>3</sup>
          </span>
        </a-form-item>
        <a-form-item
          label="线径"
          :validate-status="filamentDiameter.validateStatus"
          :help="filamentDiameter.errorMsg"
          :required="true"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input-number
            :min="0"
            :max="999999"
            style="width:260px;"
            :value="filamentDiameter.value"
            @change="filamentDiameterChange"
          />
          <span class="m-l-10">mm</span>
        </a-form-item>
        <a-form-item
          label="规格"
          :validate-status="filamentSpecs.validateStatus"
          :help="filamentSpecs.errorMsg"
          :required="true"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input-number
            :min="0"
            :max="999999"
            style="width:260px;"
            :value="filamentSpecs.value"
            @change="filamentSpecsChange"
          />
          <span class="m-l-10">kg/loops</span>
        </a-form-item>
        <a-form-item
          label="温度"
          :validate-status="temperature.validateStatus"
          :help="temperature.errorMsg"
          :required="true"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
        >
          <a-input-number
            :min="0"
            :max="999999"
            style="width:260px;"
            :value="temperature.value"
            @change="temperatureChange"
          />
          <span class="m-l-10">°C</span>
        </a-form-item>
        <a-form-item
          label="备注"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
          :required="false"
        >
          <a-textarea rows="4" v-decorator="['remark']" :maxlength="500" />
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">提交</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
</template>

<script>
function validatePrimeNumber(number, type) {
  if (number != null) {
    return {
      validateStatus: 'success',
      errorMsg: null
    }
  }
  if (number == null && type == 'Density') {
    return {
      validateStatus: 'error',
      errorMsg: '请输入密度'
    }
  }
  if (number == null && type == 'Diameter') {
    return {
      validateStatus: 'error',
      errorMsg: '请输入线径'
    }
  }
  if (number == null && type == 'Specs') {
    return {
      validateStatus: 'error',
      errorMsg: '请输入规格'
    }
  }
  if (number == null && type == 'temperature') {
    return {
      validateStatus: 'error',
      errorMsg: '请输入温度'
    }
  }
}

import { STable } from '@/components'
import { filamentAdd, filamentDetail } from '@/api/manage'
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
      filamentDensity: {
        value: null
      },
      filamentDiameter: {
        value: null
      },
      filamentSpecs: {
        value: null
      },
      temperature: {
        value: null
      },
      filamentId: null
    }
  },
  created() {},

  methods: {
    add(record = null) {
      this.form.resetFields()
      if (record == null) {
        this.title = '新建物料'
        this.visible = true
        this.filamentId = null
        this.form.setFieldsValue({
          filamentName: null,
          filamentBrand: null,
          filamentTextures: null,
          remark: null
        })
        this.filamentDensity.value = null
        this.filamentDiameter.value = null
        this.filamentSpecs.value = null
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
      this.filamentDensityChange(this.filamentDensity.value)
      this.filamentDiameterChange(this.filamentDiameter.value)
      this.filamentSpecsChange(this.filamentSpecs.value)
      this.temperatureChange(this.temperature.value)
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          filamentAdd(
            Object.assign(values, {
              filamentDensity: this.filamentDensity.value,
              filamentDiameter: this.filamentDiameter.value,
              filamentSpecs: this.filamentSpecs.value,
              temperature: this.temperature.value
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
    filamentDensityChange(value) {
      this.filamentDensity = {
        ...validatePrimeNumber(value, 'Density'),
        value
      }
    },
    filamentDiameterChange(value) {
      this.filamentDiameter = {
        ...validatePrimeNumber(value, 'Diameter'),
        value
      }
    },
    filamentSpecsChange(value) {
      this.filamentSpecs = {
        ...validatePrimeNumber(value, 'Specs'),
        value
      }
    },
    temperatureChange(value) {
      this.temperature = {
        ...validatePrimeNumber(value, 'temperature'),
        value
      }
    }
  },
  // 过滤器
  filters: {}
}
</script>
