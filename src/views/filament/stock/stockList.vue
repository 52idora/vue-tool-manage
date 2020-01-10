<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-row :gutter="24">
        <a-col :span="20" style="padding-right:0;">
          <span class="table-page-search-submitButtons">
            <a-button type="primary" icon="plus" @click="$refs.stockNew.add()">存入</a-button>
            <a-button style="margin-left: 8px;" class="default_btn" @click="del(1,1)">批量删除</a-button>
            <a-button style="margin-left: 8px;" class="default_btn" @click="clear(1,1)">估清</a-button>
            <a-button
              style="margin-left: 8px;"
              class="default_btn"
              @click="$refs.stockApply.add()"
            >领取</a-button>
          </span>
        </a-col>
        <a-col :span="4">
          <span class="table-page-search-submitButtons">
            <a-button class="pull-right" @click="$refs.stockDashboard.add()">统计分布</a-button>
          </span>
        </a-col>
      </a-row>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="storeId"
      :columns="columns"
      :data="loadData"
      :pagination="{ showTotal: total => `共 ${total} 条记录` }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      showPagination="auto"
    >
      <span slot="createTime" slot-scope="text">
        <span>{{text | date}}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$refs.stockDetail.add(record)">详情</a>

          <a-divider type="vertical" />
          <a-popconfirm title="确定估清?" @confirm="clear(record.storeId)" okText="是" cancelText="否">
            <a href="#">估清</a>
          </a-popconfirm>
          <a-divider type="vertical" />

          <a-popconfirm title="确定打印条码吗?" @confirm="print(record.storeId)" okText="是" cancelText="否">
            <a>打印条码</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="del(record.storeId)" okText="是" cancelText="否">
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <stock-new ref="stockNew" @ok="handleOk" @hide="handleHide" />
    <stock-apply ref="stockApply" @ok="handleOk" />
    <stock-detail ref="stockDetail" @ok="handleOk" />
    <stock-dashboard ref="stockDashboard" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { filamentStorePage, filamentStoreClear, filamentStoreDelete, filamentStorePrint } from '@/api/manage'
import stockNew from './stockNew'
import stockApply from './stockApply'
import stockDashboard from './stockDashboard'
import stockDetail from './stockDetail'

export default {
  components: {
    STable,
    Ellipsis,
    stockNew,
    stockDashboard,
    stockDetail,
    stockApply
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        filamentId: this.$route.query.id
      },
      // 表头
      columns: [
        {
          title: '入库卷数',
          dataIndex: 'totalNumber',
          scopedSlots: { customRender: 'totalNumber' }
        },
        {
          title: '剩余卷数',
          dataIndex: 'restNumber'
        },
        {
          title: '颜色',
          dataIndex: 'filamentColor',
          scopedSlots: { customRender: 'filamentColor' }
        },
        {
          title: '剩余重量',
          dataIndex: 'restWeight',
          scopedSlots: { customRender: 'restWeight' }
        },
        {
          title: '入库人',
          dataIndex: 'nickName',
          scopedSlots: { customRender: 'nickName' }
        },
        {
          title: '入库时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return filamentStorePage(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  created() {},
  methods: {
    handleDowload(record) {
      this.$refs.table.refresh()
      console.log(11)
      console.log(this.$route.query.id)

      //   this.$refs.modal.edit(record)
    },
    // 删除
    del(id, batch) {
      let that = this
      // filamentStoreDelete
      if (!batch) {
        const params = {
          storeId: id
        }
        filamentStoreDelete(params).then(res => {
          if (res.state == 1) {
            that.$notification.success({
              message: '删除成功'
            })
            that.$refs.table.refresh(true)
          } else {
            that.$notification.error({
              message: '删除失败'
            })
          }
        })
      } else {
        console.log(that.selectedRows)
        console.log(that.selectedRowKeys)
        if (that.selectedRowKeys.length == '0') {
          that.$notification.warning({
            message: '请选择要删除的文件'
          })
        } else {
          that.$confirm({
            title: 'Info',
            content: `确定删除吗？`,
            okText: 'OK',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
              const params = {
                storeIds: that.selectedRowKeys
              }
              console.log(params)
              filamentStoreDelete(params).then(res => {
                if (res.state == 1) {
                  that.$notification.success({
                    message: '删除成功'
                  })
                  that.selectedRowKeys = []
                  that.$refs.table.refresh()
                } else {
                  that.selectedRowKeys = []
                  that.$notification.error({
                    message: '删除失败'
                  })
                }
              })
            },
            onCancel() {
              that.selectedRowKeys = []
              that.$notification.warning({
                message: '取消删除'
              })
            }
          })
        }
      }
    },
    // 沽清
    clear(id, batch) {
      let that = this
      if (!batch) {
        const params = {
          storeId: id
        }
        filamentStoreClear(params).then(res => {
          if (res.state == 1) {
            that.$notification.success({
              message: '沽清成功'
            })
            that.$refs.table.refresh(true)
          } else {
            that.$notification.error({
              message: '沽清失败'
            })
          }
        })
      } else {
        if (that.selectedRowKeys.length == '0') {
          that.$notification.warning({
            message: '请选择要沽清的文件'
          })
        } else {
          that.$confirm({
            title: 'Info',
            content: `确定沽清吗？`,
            okText: 'OK',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
              const params = {
                storeIds: that.selectedRowKeys
              }
              console.log(params)
              filamentStoreClear(params).then(res => {
                if (res.state == 1) {
                  that.$notification.success({
                    message: '沽清成功'
                  })
                  that.selectedRowKeys = []
                  that.$refs.table.refresh()
                } else {
                  that.selectedRowKeys = []
                  that.$notification.error({
                    message: '沽清失败'
                  })
                }
              })
            },
            onCancel() {
              that.selectedRowKeys = []
              that.$notification.warning({
                message: '取消删除'
              })
            }
          })
        }
      }
      // filamentStoreClear
    },
    // 打印条码
    print(id) {
      filamentStorePrint({ storeId: id }).then(res => {
        console.log(res)
        if (res.state == 1) {
          if (res.data.code == 0) {
            that.$notification.success({ message: '打印正常' })
          } else {
            that.$notification.error({
              message: res.data.msg
            })
          }
        }
      })
    },
    // 操作编辑按钮
    handleHide() {
      this.$emit('hide')
    },
    // 更多操作
    handleMenuClick(e) {},
    handleOk() {
      this.$refs.table.refresh(true)
    },
    // 编辑
    handleEdit(record) {
      this.$refs.stockDetail.add(record)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>
