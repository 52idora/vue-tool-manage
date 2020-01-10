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
          label="角色名称"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
          :maxLength="100"
            v-decorator="[
            'roleName',{rules: [{ required: true, message: '请输入角色名称' }]}
          ]"
            name="roleName"
            placeholder="请输入角色名"
          />
        </a-form-item>
        <a-form-item
          label="角色描述"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
          :maxLength="100"
            placeholder="请输入描述"
            v-decorator="['roleDesc']"
          />
        </a-form-item>
        <a-form-item
          label="角色类型"
          :maxLength="100"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-select
            v-decorator="['roleType',{rules: [{ required: true, message: '请选择角色类型' }]}]"
            placeholder="请选择角色类型"
          >
            <a-select-option :value="1">超级管理员</a-select-option>
            <a-select-option :value="2">项目经理</a-select-option>
            <a-select-option :value="3">员工</a-select-option>
            <a-select-option :value="0">普通用户</a-select-option>
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
import { userRoleSave,userRoleEdit } from '@/api/setting'
export default {
  components: {},
  data() {
    return {
      // 下拉框列表
      rolesList: [],
      visible: false,
      confirmLoading: false,
      showTime: false,
      title:"新建角色",
      roleId:null,
      form: this.$form.createForm(this)
    }
  },
  created() {},
  methods: {
    add(record) {
      this.visible = true
      if (!record) {
        this.showTime = false;
        this.title = "新建角色";
        this.roleId = null;
        this.form.resetFields()
      } else {
        this.showTime = true
        this.form.resetFields()
        this.roleId = record.roleId
        this.title = "编辑角色"
        setTimeout(() => {
          this.form.setFieldsValue({
            roleName: record.roleName,
            roleDesc: record.roleDesc,
            roleType: record.roleType
            // 'id':record.id
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
          if (this.roleId) {
            // 编辑提交
            userRoleEdit(Object.assign(values, {roleId:this.roleId})).then(res => {
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
            userRoleSave(Object.assign(values)).then(res => {
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
      // this.form = this.$form.createForm(this, options);
    },
    handleCancel() {
      this.visible = false
      console.log('关闭弹窗')
    },
    // 下拉框search事件
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
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
