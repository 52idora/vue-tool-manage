<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" @submit="handleSave">
        <a-form-item
          label="用户名"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
          :maxLength="100"
            v-decorator="[
            'userName',
            {rules: [{ required: true, message: '用户名' }]}
          ]"
            name="userName"
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item
          label="邮箱"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
          :maxLength="100"
            placeholder="请输入邮箱"
            v-decorator="['email', { rules: [{ required: true, min: 5, message: '请输入Email' }] }]"
          />
        </a-form-item>
        <a-form-item
          label="密码"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
          :maxLength="100"
            placeholder="请输入密码"
            v-decorator="['password', { rules: [{ required: true, min: 5, message: '请输入密码' }] }]"
          />
        </a-form-item>
        <a-form-item
          label="选择角色"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-select
            v-decorator="[
                  'roleId',{rules: [{ required: true, message: '请选择权限' }] }
                ]"
            placeholder="请选择权限"
          >
            <a-select-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.roleId"
            >{{item.roleName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getUserEdit,getUserSave,getRoleList } from '@/api/setting'
export default {
  components: {},
  data() {
    return {
      // 下拉框列表
      rolesList: [],
      visible: false,
      confirmLoading: false,
      title: "添加用户",
      form: this.$form.createForm(this)
    }
  },
  created() {
  },
  methods: {
    add(record) {
      this.getUserRole();
      this.visible = true
      if (!record) {
        this.title = "添加用户"
        this.userId = null
        this.form.resetFields()
      } else {
        this.title = "编辑用户"
        this.form.resetFields()
        this.userId = record.userId
        // 定时器解决不能在页面未渲染之前就进行form表单的相关信息的设置
        setTimeout(() => {
          this.form.setFieldsValue({
            userName: record.userName,
            email: record.email,
            password: null,
            roleId: record.roleId
          })
        }, 0)
      }
    },
    // 提交save
    handleSave(e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.userId) {
            // 编辑提交
            getUserEdit(Object.assign(values, {userId:this.userId})).then(res => {
              if (res.state == 1) {
                this.$emit('ok', values)
              this.visible = false
                this.$notification.success({message: '成功'});
              }else{
                this.$notification.error({message: '失败'});
              }
              this.confirmLoading = false
            })
          } else {
            // 新增提交
            getUserSave(Object.assign(values)).then(res => {
              if (res.state == 1) {
                this.$emit('ok', values)
                this.$notification.success({message: '成功'});
                this.visible = false
              }else{
                this.$notification.error({message: '失败'});
              }
              this.confirmLoading = false
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    //获取角色列表
    getUserRole(){
      getRoleList(Object.assign({})).then(res => {
        if (res.state == 1) {
          this.rolesList = res.data;
        }else{
          that.$notification.error({message: '失败'});
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.ant-modal {
  min-width: 800px;
}
.ant_row {
  margin: 10px;
}
.batch-delete {
  background: rgb(21, 145, 207);
  color: #fff;
  padding: 0 30px;
  margin-left: 15px;
  text-align: right;
}
.ant-form-item-label {
  color: pink;
}
</style>
