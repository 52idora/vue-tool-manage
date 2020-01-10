<template>
  <a-modal
    title="添加菜单"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" @submit="handleSave">
        <a-form-item
          label="菜单名"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
          :maxLength="100"
            v-decorator="[
            'menuName',
            {rules: [{ required: true, message: '请输入菜单名' }]}
          ]"
            name="menuName"
            placeholder="请输入菜单名"
          />
        </a-form-item>
        <a-form-item
          label="排序号"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
          :maxLength="100"
            placeholder="请输入排序号"
            v-decorator="['sortNum', { rules: [{ required: true, message: '请输入排序号' }] }]"
          />
        </a-form-item>
        <a-form-item
          label="父级菜单ID"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
          :maxLength="100"
            placeholder="请输入父级菜单ID，根目录为0"
            v-decorator="['parentId', { rules: [{ required: true, message: '请输入父级菜单ID' }],initialValue:0 }]"
          />
        </a-form-item>
        
        <a-form-item
          label="菜单路径"
          :maxLength="100"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :required="false"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
          :maxLength="100"
            placeholder="请输入菜单地址"
            v-decorator="['apiUrl']"
          />
        </a-form-item>
        <a-form-item
          label="菜单类型"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-select
            v-decorator="['menuType',{rules: [{ required: true, message: '请选择菜单类型' }],initialValue:1}]"
          >
            <a-select-option :value="1">可操作</a-select-option>
            <a-select-option :value="0">可见</a-select-option>
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
import { getUserMenuSave } from '@/api/setting'
export default {
  components: {},
  data() {
    return {
      // 下拉框列表
      visible: false,
      confirmLoading: false,
      showTime: false,

      form: this.$form.createForm(this)
    }
  },
  created() {},
  methods: {
    add(record=null) {
      this.visible = true
      this.form.resetFields()
    },
    // 提交save
    handleSave(e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          getUserMenuSave(Object.assign(values)).then(res => {
              if (res.state == 1) {
                this.$emit('ok', values)
                this.$notification.success({message: '成功'});
                this.visible = false
              }else{
                this.$notification.error({message: '失败'});
              }
              this.confirmLoading = false
            })
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
