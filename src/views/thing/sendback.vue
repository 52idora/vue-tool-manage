<template>
  <a-form  @submit="handleSubmit" :form="form">
    <a-form-item
      label="会员"
      :labelCol="{lg: {span: 5}, sm: {span: 7}}"
      :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
    >
      <a-select  style="width: 120px" @change="handleDepartChange">
        <a-select-option v-for="d in departs" :key="d.id">{{d.depart_name}}</a-select-option>
      </a-select>
      <a-select style="width: 120px" @change="handleUserChange"
                v-decorator="[
              'userId',
              {rules: [{ required: true, message: '请输入条形码' }]}
            ]"
      >
        <a-select-option v-for="u in users" :key="u.id">{{u.nick_name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="条形码"
      :labelCol="{lg: {span: 5}, sm: {span: 7}}"
      :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
    >
      <a-input @keyup.enter="handleSubmit"
               v-decorator="[
              'thingNo',
              {rules: [{ required: true,whitespace:true, message: '请输入条形码' }]}
            ]"
               :maxlength="50"
               id="tingNo"
      />
    </a-form-item>
    <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
      <a-button htmlType="submit" type="primary">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
  import {departAll } from '@/api/depart'
  import {usersByDepart } from '@/api/users'
  import {thingSendback } from '@/api/thing'

  export default {
    name: "sendback",
    data() {
      return {
        departs:[],
        users:[],
        form: this.$form.createForm(this),
        canSubmit: true
      }
    },
    mounted () {

    },
    created() {
      this.getDeparts()
    },
    methods: {
      handleSubmit(){
        this.form.validateFields((err, values) => {
          if (!err) {
            if(this.canSubmit) {
              this.canSubmit = false
              setTimeout(() => {
                this.canSubmit = true
              }, 2000)
              thingSendback(values).then(res => {
                if (res.state == 1) {
                  this.$emit('ok', values)
                  this.$notification.success({message: '成功'})
                } else {
                  this.$notification.error({message: res.msg})
                }
              })
            }
          }
        })
      },
      getDeparts(){
        departAll().then(res => {
          if(res.state == 1){
            this.departs = res.data
          }
        })
      },
      handleDepartChange(d){
        usersByDepart({'departId':d}).then(res => {
          if(res.state == 1){
            this.users = res.data;
          }
        })
      },
      handleUserChange(){
        document.getElementById('thingNo').focus()
      }
    }
  }
</script>

<style scoped>

</style>