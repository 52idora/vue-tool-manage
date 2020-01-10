<template>
  <a-modal :width="800" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel" :footer="null">
    <a-spin :spinning="confirmLoading">
      <a-row style="margin:15px 10px">
        <span v-text="project.file" class="topTitle"></span>
        <span class="topTitle">/</span>
        <span v-text="project.name" class="topTitle"></span>
        <a-button class="default_button" style="float:right" @click="newSet()">新增套</a-button>
      </a-row>
      <a-table
        class="box"
        ref="table"
        size="default"
        :columns="columns"
        :dataSource="loadData"
        rowKey="id"
        childrenColumnName="setFiles"
        :pagination="false"
      >
        <span slot="titles" slot-scope="text">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="fileName" slot-scope="text">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="num" slot-scope="text, record">
          <template>
            <!-- <div ></div> -->
            <div v-if="record.fileName">
              <div v-if="record.showNum">
                <span>{{ text }}</span>
                <a-icon type="edit" style="margin-left:10px; color:#FF1531" @click="editNum(record)" />
              </div>
              <div v-else>
                <a-input-number id="inputNumber" :min="1" v-model="record.num"  :max="999999" />
                <a-icon type="check" style="margin-left:10px; color:rgb(82, 196, 26)" @click="saveNum(record)" />
              </div>
            </div>
          </template>
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-if="!record.num">
            <a @click="addFile(record)">添加文件</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="handleDel(record, 1)" okText="是" cancelText="否">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm title="确定移除吗?" @confirm="handleDel(record, 2)" okText="是" cancelText="否">
              <a href="#">移除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
      <!-- <a-row :gutter="48" style="text-align:center">
        <a-button @click="handleSubmit" type="primary">保存</a-button>
      </a-row>-->
      <folder-detail ref="folderDetail" @ok="handleOk" />
      <new-set ref="newSet" @ok="handleOk" />
    </a-spin>
  </a-modal>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getProjectDirSetList, getProjectDirSetEdit, getProjectDirSetDelete } from '@/api/file'
import FolderDetail from './FolderDetail'
import NewSet from './NewSet'

// import { getPrinterHistory } from '@/api/printer'
export default {
  components: {
    STable,
    Ellipsis,
    NewSet,
    FolderDetail
  },
  data() {
    return {
      query: [],
      project: {
        file: 'AJ900系列',
        name: '41码男鞋'
      },
      queryParam: {},
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'title',
          key: 'title',
          scopedSlots: { customRender: 'titles' }
        },

        {
          title: '',
          dataIndex: 'fileName',
          key: 'fileName',
          scopedSlots: { customRender: 'fileName' }
        },
        {
          title: '个数',
          dataIndex: 'num',
          width: '30%',
          key: 'num',
          scopedSlots: { customRender: 'num' }
        },

        {
          title: '操作',
          dataIndex: 'action',
          width: '30%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      visible: false,
      dirId: '',
      confirmLoading: false,
      countVisible: false,
      countConfirmLoading: false,
      num: '',
      showNum: true,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    add(item, title) {
      this.visible = true
      this.dirId = item.dirId
      this.project.file = title
      this.project.name = item.title
      this.getInit()
      //   this.$refs.table.refresh()
    },

    getInit() {
      getProjectDirSetList({ dirId: this.dirId }).then(res => {
        if (res.state == 1) {
          res.data.map(item => {
            item.setFiles.map(i => {
              i.showNum = true
            })
          })
          this.loadData = res.data
        }
      })
    },
    // 删除文件
    handleDel(record, name) {
      let params
      if (name == 1) {
        // 删除成套
        params = {
          setId: record.setId
        }
      } else {
        // 删除单个
        params = {
          setId: record.setId,
          fileApprovalId: record.fileApprovalId
        }
      }

      this.$nextTick(() => {
        getProjectDirSetDelete(params).then(res => {
          if (res.state == 1) {
            this.$notification.success({
              message: '删除成功'
            })
            this.getInit()
          } else {
            this.$notification.error({
              message: '删除失败'
            })
          }
        })
      })
    },
    // 数字编辑
    onCountChange(number) {
      this.num = number
    },
    // 编辑数量
    editNum(record) {
      this.loadData.map(item => {
        item.setFiles.map(i => {
          if (i.fileApprovalId == record.fileApprovalId) {
            i.showNum = false
          } else {
            return
          }
        })
      })
    },
    // 提交编辑数量
    saveNum(record) {
      /* if (this.num == '') {
        this.num = record.num
      } */
      const params = {
        fileApprovalId: record.fileApprovalId,
        setId: record.setId,
        num: record.num
      }
      getProjectDirSetEdit(params).then(res => {
        if (res.state == 1) {
          this.$notification.success({
            message: '编辑成功'
          })
          this.loadData.map(item => {
            item.setFiles.map(i => {
              if (i.fileApprovalId == record.fileApprovalId) {
                i.showNum = true
              }
            })
          })
          this.getInit()
        } else {
          this.$notification.error({
            message: '编辑失败'
          })
        }
      })
    },
    // 添加文件
    addFile(record) {
      this.$refs.folderDetail.add(this.dirId, record.setId, this.project.file, this.project.name, 1)
    },
    // 添加成套
    newSet() {
      this.$refs.newSet.add(this.dirId)
    },
    // 保存
    handleSubmit() {},
    handleOk() {
      this.getInit()
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.ant-modal {
  /deep/ .ant-modal-body {
    padding-top: 0 !important;
  }
}

.topTitle {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  margin-top: -24px;
  color: #fff;
}
.table-wrapper /deep/ .ant-pagination {
  li.ant-pagination-total-text {
    // display: none;
    position: absolute;
    left: 0;
    // float: right;
  }
}
/deep/ .ant-table-wrapper {
  height: 400px;
  margin-bottom: 30px;
}
/deep/ .ant-table-row-expand-icon {
  background: transparent;
}
</style>
