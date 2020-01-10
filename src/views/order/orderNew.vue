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
          v-if="title == '修改订单'"
          label="订单号"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
          :required="false">
          <span>{{orderNo}}</span>
        </a-form-item>
        <a-form-item
          label="订单名称"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
          <a-input
            :maxLength="100"
            v-decorator="[
              'orderName',
              {rules: [{ required: true,whitespace:true, message: '请输入订单名称' }]}
            ]" />
        </a-form-item>
        <a-form-item
          label="需求数量"
          :validate-status="orderNumber.validateStatus"
          :help="orderNumber.errorMsg"
          :required="true"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
          <a-input-number 
          :min="0" 
          :max="999999"
          style="width:300px;"
          :value="orderNumber.value" 
          @change="orderNumberChange"
          />
          <span class="m-l-10">套</span>
        </a-form-item>
        <a-form-item
          label="客户"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
          :required="false"
          >
          <a-input v-decorator="['client']" :maxLength="50" />
        </a-form-item>
        <a-form-item
          label="交付时间"
          :validate-status="deliveryTime.validateStatus"
          :help="deliveryTime.errorMsg"
          :required="true"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
          <a-date-picker
          name="deliveryTime"
          style="width: 100%"
          v-model="deliveryTime.value" 
          @change="deliveryTimeChange"
          />
        </a-form-item>
        <a-form-item
          label="详细说明"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
          :required="false"
        >
           <a-textarea
            :maxLength="200"
          rows="2"
          placeholder="请输入订单的详细说明"
          v-decorator="['description']" />
        </a-form-item>
        <a-form-item
          label="备注"
          :labelCol="{lg: {span: 5}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
          :required="false"
        >
          <a-textarea
           :maxLength="50"
          rows="4"
          v-decorator="['remark']" />
        </a-form-item>
        <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary">提交</a-button>
      </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
</template>

<script>

function validatePrimeNumber(number,type) {
  if (number != null) {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }
  if(number == null &&type=="number"){
    return {
      validateStatus: 'error',
      errorMsg: '请输入需求数量',
    };
  }
  if(number == null &&type=="time"){
    return {
      validateStatus: 'error',
      errorMsg: '请输入交付日期',
    };
  }
}

import { STable } from '@/components'
import moment from 'moment'
import { ordersSave,ordersEdit } from '@/api/manage'
let lodash = require('lodash')
export default {
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      confirmLoading:false,
      title:"新建订单",
      form: this.$form.createForm(this),
      orderNo:null,
      orderNumber:{
        value:null
      },
      deliveryTime:{
        value:null
      },
      orderId:null,
    }
  },
  created() {
  },

  methods: {
    add(record = null) {
      this.form.resetFields()
      if(record == null){
        this.title = '新建订单';
        this.visible = true;
        this.form.setFieldsValue({
          orderName: null,
          client: null,
          description: null,
          remark: null
        })
        this.orderNumber.value = null;
        this.deliveryTime.value = null;
        this.orderId = null;
      } else {
        this.title = '修改订单';
        this.visible = true;
        setTimeout(() => {
          this.form.setFieldsValue({
            orderName: record.orderName,
            client: record.client,
            description: record.description,
            remark: record.remark
          })
          this.orderNumber.value = record.orderNumber;
          this.deliveryTime.value = moment(record.deliveryTime);
          this.orderNo = record.orderNo;
          this.orderId = record.orderId;
        },0)
      }
    },
    handleCancel(){
      this.visible = false;
    },
    handleOk(){
      this.visible = false;
    },
    handleSubmit (e) {
      this.orderNumberChange(this.orderNumber.value)
      this.deliveryTimeChange(this.deliveryTime.value)
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if(this.title == "新建订单"){
            ordersSave(Object.assign(values, {orderNumber:this.orderNumber.value,deliveryTime:this.deliveryTime.value })).then(res => {
              if (res.state == 1) {
                this.visible = false;
                this.$emit('ok', values)
                this.$notification.success({message: '成功'});
              } else{
                this.$notification.error({message: '失败'});
              }
            })
          }else{
            ordersEdit(Object.assign(values, {orderNumber:this.orderNumber.value,deliveryTime:this.deliveryTime.value,orderId:this.orderId })).then(res => {
              if (res.state == 1) {
                this.visible = false;
                this.$emit('ok', values)
                this.$notification.success({message: '成功'});
              } else{
                this.$notification.error({message: '失败'});
              }
            })
          }
        }
      })
    },
    orderNumberChange(value) {
      this.orderNumber = {
        ...validatePrimeNumber(value,'number'),
        value,
      };
    },
    deliveryTimeChange(value) {
      this.deliveryTime = {
        ...validatePrimeNumber(value,'time'),
        value,
      };
    },
  },
  // 过滤器
  filters: {
  }
}
</script>
