<template>
  <a-modal :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <template slot="footer">
      <div :style="{ textAlign: 'center' }">
        <a-button type="primary" @click="handleSubmit(1)" style="margin-right:40px">通过</a-button>
        <a-button type="info" @click="handleSubmit(2)">驳回</a-button>
      </div>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="基础信息" key="1">
          <a-form :form="form">
            <a-row>
              <a-col :md="24" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="{ span: 10 }" label="审批名称">
                  <span>{{ data.title }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="files_approval">
              <div v-for="item in data.files" :key="item.id">
                <a-row>
                  <a-col :md="24" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="{ span: 18 }" label="文件"
                      ><ellipsis :length="50" tooltip>{{ item.fileName }}</ellipsis></a-form-item
                    >
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :md="24" :sm="24">
                    <a-form-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="所属项目"
                      style="position:relative"
                    >
                      <a-select v-model="item.projectId" @change="handleProjectChange">
                        <!-- {initialValue: data.files[0].projectId}  -->
                        <a-select-option v-for="i in projectList" :key="i.index" :value="i.projectId">{{
                          i.title
                        }}</a-select-option>
                      </a-select>
                      <a-select
                        :getPopupContainer="
                          triggerNode => {
                            return triggerNode.parentNode
                          }
                        "
                        v-model="item.dirId"
                        class="select_right"
                      >
                        <a-select-option v-for="i in dirList" :key="i.dirId" :value="i.dirId">{{
                          i.title
                        }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="imgs" v-if="item.imgUrlList != undefined && item.imgUrlList.length > 0">
                  <ul>
                    <li v-for="i in item.imgUrlList" :key="i.index" style="float;left">
                      <img :src="'https://src.raise3d.cn/factory/' + i" />
                    </li>
                  </ul>
                </a-row>
              </div>
            </div>

            <a-row>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="详情">
                <div style="line-height:22px">{{ data.details }}</div>
              </a-form-item>
            </a-row>
            <a-row>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
                <a-textarea :rows="3" v-model="remark" :maxlength="200" />
              </a-form-item>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane tab="审批历史" key="2" v-if="showHistory">
          <a-form :form="form">
            <a-row>
              <a-col :md="24" :sm="24">
                <a-form-item :labelCol="labelCol" :wrapperCol="{ span: 18 }" label="审批名称">
                  <ellipsis :length="50" tooltip>{{ data.title }}</ellipsis>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="24" :sm="24">
                <a-form-item label="发起人" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ data.userName }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="files_approval">
              <div v-for="item in data.files" :key="item.fileId">
                <a-row>
                  <a-col :md="24" :sm="24">
                    <a-form-item :labelCol="labelCol" :wrapperCol="{ span: 18 }" label="文件"
                      ><ellipsis :length="50" tooltip>{{ item.fileName }}</ellipsis></a-form-item
                    >
                  </a-col>
                </a-row>
                <a-row>
                  <a-form-item label="所属项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span style="margin-right:30px">{{ item.projectTitle }}</span>
                    <span>{{ item.dirTitle }}</span>
                  </a-form-item>
                </a-row>
                <a-row class="imgs" v-if="item.imgUrlList != undefined && item.imgUrlList.length > 0">
                  <ul>
                    <li v-for="i in item.imgUrlList" :key="i.index" style="float;left">
                      <img :src="'https://src.raise3d.cn/factory/' + i" />
                    </li>
                  </ul>
                </a-row>
              </div>
            </div>

            <div class="history">
              <a-row :gutter="48">
                <a-col :md="24" :sm="24">
                  <ul>
                    <li v-for="item in data.histories" :key="item.id" :index="item.index">
                      <span>{{ item.created | date }}</span>
                      <span>{{ item.state | stateFilter }}</span>
                      <span>审批人: {{ item.userName }}</span>

                      <ellipsis :length="28" tooltip class="tips">备注: {{ item.remark }}</ellipsis>
                    </li>
                  </ul>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
import { getApprovalDetail, getApprovalCheck } from '@/api/file'
import { getProjectDirsList, projectGetProjects } from '@/api/manage'
import { Ellipsis } from '@/components'
const statusMap = {
  '-1': {
    text: '我发起的'
  },
  0: {
    text: '未审批的'
  },
  1: {
    text: '审批通过的'
  },
  2: {
    status: 'success',
    text: '审批被驳回的'
  }
}
export default {
  components: {
    Ellipsis
  },
  data() {
    return {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 19 },
        sm: { span: 19 }
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
      showHistory: false,
      previewVisible: false,
      previewImage: '',
      projectList: [],
      dirList: [],
      approvalId: '',
      remark: '',
      data: {},
      imgsList: [],
      historyList: []
    }
  },
  methods: {
    add(id) {
      this.remark = ''
      this.visible = true
      this.getInit(id)
    },
    getInit(id) {
      getApprovalDetail({ approvalId: id }).then(res => {
        console.log('detail', res)
        this.approvalId = id
        this.data = res.data
        if (this.data.histories.length != 0) {
          console.log(1)
          this.showHistory = true
        } else {
          console.log(12)
          this.showHistory = false
        }

        this.data.files.map(i => {
          getProjectDirsList({ projectId: i.projectId }).then(res => {
            // console.log(res)
            this.dirList = res.data
          })
          i.imgUrlList = eval('(' + i.imgUrlList + ')')
        })
      })
      projectGetProjects().then(res => {
        if (res.state == 1) {
          this.projectList = res.data
        }
      })
    },
    // 项目文件夹联动
    handleProjectChange(value) {
      /* this.data.files.map(item => {
        if (item.projectId == value) {
          //项目列表未改动
          return
        } else {
          console.log(1)
          item.dirId = ''
        }
      }) */
      this.data.files.map(item => {
        if (item.projectId == value) {
          item.dirId = ''
        }
      })

      getProjectDirsList({ projectId: value }).then(res => {
        // console.log(res)
        this.dirList = res.data
      })
    },
    handleSubmit(state) {
      const params = {
        approvalId: this.approvalId,
        state: state,
        remark: this.remark,
        files: this.data.files
      }
      console.log(params)
      getApprovalCheck(params).then(res => {
        if (res.state == 1) {
          this.$notification.success({
            message: '文件审批成功'
          })
          this.$emit('ok')
          this.visible = false
        } else {
          this.$notification.error({
            message: '文件审批失败'
          })
        }
      })
    },
    handleRefuse() {},
    handleCancel() {
      this.visible = false
    },
    handleImgCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    }
  },
  filters: {
    stateFilter(type) {
      return statusMap[type].text
    }
  }
}
</script>
<style lang="less" scoped>
/*定义滚动条轨道 内阴影+圆角*/
.box::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #1b1b21;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
.box::-webkit-scrollbar {
  width: 10px;
  background-color: #202029;
}
/*定义滑块 内阴影+圆角*/
.box::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  background-color: #555;
}

/*定义滚动条轨道 内阴影+圆角*/
.history::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #1b1b21;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
.history::-webkit-scrollbar {
  width: 10px;
  background-color: #202029;
}
/*定义滑块 内阴影+圆角*/
.history::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.clearfix {
  /deep/.ant-upload-list-picture-card .ant-upload-list-item {
    width: 90px !important;
    height: 90px !important;
  }
  /deep/ .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  /deep/ .ant-upload.ant-upload-select-picture-card {
    width: 90px !important;
    height: 90px !important;
    background-color: transparent;
  }
}

.box {
  height: 320px;
  width: 100%;
  overflow: auto;
  border: 1px solid #9e9e9e;
  padding: 15px 20px 0;
}
/deep/ .ant-tabs-bar {
  margin: 0;
}
.history {
  height: 150px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 20px;
  ul {
    padding-left: 20px;
    li {
      list-style: none;
      line-height: 50px;
      height: 50px;
      span {
        display: inline-block;
        width: 20%;
      }
      .tips {
        width: 40%;
      }
    }
  }
}
.files_approval {
  height: 300px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding-left: 20px;
}
.ant-select {
  width: 46%;
}
.select_right {
  float: right;
  margin-top: 3px;
}
.imgs {
  ul {
    margin-left: 50px;
    li {
      list-style: none;
      float: left;
      width: 90px;
      height: 90px;
      margin: 10px;
      border: 1px dashed rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      position: relative;
      //   background-color: pink;
      img {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
.ant-row {
  margin: 5px 0;
}
.ant-form {
  /deep/ .ant-form-item-label {
    text-align: left;
  }
}
/deep/ .ant-modal-footer {
  padding-bottom: 20px;
}
</style>
