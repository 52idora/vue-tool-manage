<template>
  <a-modal
    title="文件详情"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-row style="margin-left:10px">
        <span v-text="project.name" class="topTitle"></span>
        <span class="topTitle">/</span>
        <span v-text="project.file" class="topTitle"></span>
      </a-row>
      <a-table
        class="box"
        size="default"
        :columns="columns"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :dataSource="loadData"
        :pagination="false"
        rowKey="id"
      >
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="fileName" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="fileSize" slot-scope="text">{{ text | FileSize }}</span>
        <span slot="printTime" slot-scope="text">{{ text | time }}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-popconfirm title="确定删除吗?" @confirm="handleDel(record.id)" okText="是" cancelText="否">
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
      <a-row :gutter="48" style="text-align:center" v-if="showSave">
        <a-button @click="handleSubmit" type="primary">保存</a-button>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getProjectDirFiles, getProjectDirfileDelete, getProjectDirSetSaveFile } from '@/api/file'
// import { getPrinterHistory } from '@/api/printer'
export default {
  components: {
    STable,
    Ellipsis
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
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '文件名',
          dataIndex: 'fileName',
          scopedSlots: { customRender: 'fileName' }
        },
        {
          title: '文件大小',
          dataIndex: 'fileSize',
          scopedSlots: { customRender: 'fileSize' }
        },
        {
          title: '预计打印时间',
          dataIndex: 'printTime',
          scopedSlots: { customRender: 'printTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      selectedRowKeys: [],
      selectedRows: [],
      dirId: '',
      setId: '',
      showSave: false,
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this)
    }
  },
  methods: {
    add(dirId, setId, name, title, status) {
      ;(this.selectedRowKeys = []), (this.selectedRows = []), (this.dirId = '')
      this.setId = ''
      this.project = {}
      this.dirId = dirId
      this.setId = setId
      this.project.name = name
      this.project.file = title
      if (status) {
        //设置成套添加
        console.log(1)
        this.showSave = true
      } else {
        // 文件夹详情
        console.log(2)
        this.showSave = false
      }
      this.visible = true
      this.getInit()
      //   this.$refs.table.refresh()
    },
    getInit() {
      getProjectDirFiles({ dirId: this.dirId }).then(res => {
        console.log(res)
        if (res.state == 1) {
          this.loadData = res.data
        }
      })
    },
    // 删除文件
    handleDel(id) {
      const params = {
        id: id
      }
      getProjectDirfileDelete(params).then(res => {
        console.log(res)
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
    },

    handleCancel() {
      this.visible = false
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleSubmit() {
      // let that = this
      if (this.selectedRowKeys.length == '0') {
        // this.$message.info('请选择要删除的文件')
        this.$notification.warning({
          message: '请选择要添加的文件'
        })
      } else {
        let ids = this.selectedRowKeys.join(',')
        console.log(this.setId)
        const params = {
          setId: this.setId,
          ids: ids
        }
        getProjectDirSetSaveFile(params).then(res => {
          if (res.state == 1) {
            this.$notification.success({
              message: '添加成功'
            })
            this.visible = false
            this.$emit('ok')
          } else {
            this.$notification.error({
              message: '添加失败'
            })
          }
        })
      }
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

.ant_row {
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
  max-height: 400px;
  margin-bottom: 30px;
}
</style>
