<template>
  <a-card :body-style="{padding: '20px 20px'}" title="基础信息" :bordered="false">
    <span slot="extra">
      <a-button style="margin-right:20px" type="primary" v-if="showEdit" @click="handleEdit()">
        <span v-if="!edit">编辑</span>
        <span v-if="edit">取消编辑</span>
      </a-button>
      <router-link :to="{ name: 'filamentList' }">
        <a-button>返回</a-button>
      </router-link>
    </span>
    <a-spin :spinning="confirmLoading">
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSubmit">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item
              label="物料名称"
              :labelCol="{lg: {span: 6}}"
              :wrapperCol="{lg: {span: 18}}"
              :required="false"
            >
              <span>{{detail.filamentName}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="品牌" :labelCol="{lg: {span: 6}}" :wrapperCol="{lg: {span: 18}}">
              <a-input
                v-if="edit"
                v-decorator="['filamentBrand',{initialValue: detail.filamentBrand}]"
                :maxlength="50"
              ></a-input>
              <span v-else>{{detail.filamentBrand}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="种类" :labelCol="{lg: {span: 6}}" :wrapperCol="{lg: {span: 18}}">
              <a-input
                v-if="edit"
                v-decorator="['filamentTextures',{initialValue: detail.filamentTextures}]"
                :maxlength="50"
              ></a-input>
              <span v-else>{{detail.filamentTextures}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="密度"
              :labelCol="{lg: {span: 6}}"
              :wrapperCol="{lg: {span: 18}}"
              :required="false"
            >
              <a-input-number
                v-if="edit"
                v-decorator="['filamentDensity',{initialValue: detail.filamentDensity}]"
                :maxlength="999999"
              ></a-input-number>
              <span v-else>{{detail.filamentDensity}}</span>
              <span class="m-l-10">
                g/cm
                <sup>3</sup>
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="线径"
              :labelCol="{lg: {span: 6}}"
              :wrapperCol="{lg: {span: 18}}"
              :required="false"
            >
              <a-input-number
                v-if="edit"
                v-decorator="['filamentDiameter',{initialValue: detail.filamentDiameter}]"
                :maxlength="999999"
              ></a-input-number>
              <span v-else>{{detail.filamentDiameter}}</span>
              <span class="m-l-10">mm</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="规格"
              :labelCol="{lg: {span: 6}}"
              :wrapperCol="{lg: {span: 18}}"
              :required="false"
            >
              <a-input-number
                v-if="edit==true"
                v-decorator="['filamentSpecs',{initialValue: detail.filamentSpecs}]"
                :maxlength="999999"
              ></a-input-number>
              <span v-else>{{detail.filamentSpecs}}</span>
              <span class="m-l-10">kg/loops</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="入库人"
              :labelCol="{lg: {span: 6}}"
              :wrapperCol="{lg: {span: 18}}"
              :required="false"
            >
              <span>{{detail.nickName}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="料卷数"
              :labelCol="{lg: {span: 6}}"
              :wrapperCol="{lg: {span: 18}}"
              :required="false"
            >
              <span>{{detail.filamentNumber}} 卷</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="入库时间" :labelCol="{lg: {span: 6}}" :wrapperCol="{lg: {span: 18}}">
              <span>{{detail.updateTime | date}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="剩余重量" :labelCol="{lg: {span: 6}}" :wrapperCol="{lg: {span: 18}}">
              <span>{{detail.restWeight}} g</span>
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="温度" :labelCol="{lg: {span: 6}}" :wrapperCol="{lg: {span: 18}}">
              <a-input-number
                v-if="edit==true"
                v-decorator="['temperature',{initialValue: detail.temperature}]"
                :maxlength="999999"
              ></a-input-number>
              <span v-if="!edit">{{detail.temperature}}</span>
              <span class="m-l-10">°C</span>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="{lg: {span: 2}}" :wrapperCol="{lg: {span: 22}}">
              <span v-if="edit==true">
                <a-textarea v-decorator="['remark',{initialValue: detail.remark}]" :maxlength="500"></a-textarea>
              </span>
              <span v-else>{{detail.remark || '--'}}</span>
              <a-button v-if="edit" htmlType="submit" class="submit_btn" type="primary">保存</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <stock-list ref="stockList" @hide="handleHide" />
  </a-card>
</template>

<script>
import stockList from './stock/stockList'
import { filamentDetail, filamentEdit } from '@/api/manage'

export default {
  name: 'filamentDetail',
  components: {
    stockList
  },
  data() {
    return {
      visible: true,
      value: 1,
      confirmLoading: false,
      filamentId: this.$router.currentRoute.query.id,
      detail: {},
      edit: false,
      showEdit: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
    let filamentId = this.$router.currentRoute.query.id

    this.getFilamentDetail(filamentId)
  },
  methods: {
    //材料详情
    getFilamentDetail(filamentId) {
      console.log(this.filamentId)
      this.filamentId = filamentId
      filamentDetail(Object.assign({ filamentId: filamentId })).then(res => {
        if (res.state == 1) {
          this.detail = res.data

          if (res.data.storeCount == 0) {
            //不可编辑
            this.showEdit = true
          } else {
            //可编辑
            this.showEdit = false
          }
        } else {
          this.$notification.error({ message: '失败' })
        }
      })
    },
    // 点击编辑
    handleEdit() {
      this.edit = !this.edit
    },
    handleHide() {
      this.getFilamentDetail(this.filamentId)
    },
    // 提交编辑
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        console.log(values)
        if (!errors) {
          values.filamentId = this.filamentId
          console.log('values', values)
          filamentEdit(values).then(res => {
            console.log(res)
            if (res.state == 1) {
              this.$notification.success({
                message: '编辑信息成功'
              })
              this.confirmLoading = false
              this.getFilamentDetail(this.filamentId)
              this.edit = false
              /* this.$router.push({
                name: 'filamentList'
              }) */
            } else {
              this.$notification.error({
                message: '编辑信息失败'
              })
              this.confirmLoading = false
            }
          })
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.ant-advanced-search-form .ant-form-item {
  margin-bottom: 0px;
}
.ant-card /deep/ .ant-card-head {
  border-bottom: none;
}
.ant-form {
  padding-bottom: 20px;
  border-bottom: 1px solid #14141c;
}
.ant-form-item /deep/ .ant-input-affix-wrapper {
  width: 60% !important;
}
.ant-form-item /deep/ textarea.ant-input {
  max-width: 60% !important;
}
.submit_btn {
  float: right;
  margin-right: 10px;
  margin-top: 20px;
}
</style>
