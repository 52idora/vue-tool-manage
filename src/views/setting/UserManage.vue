<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <div class="table-operator">
              <a-button type="primary" @click="$refs.newUser.add()">
                <a-icon type="plus" />新增
              </a-button>
              <a-button @click="allDelete">批量删除</a-button>
              <a-button @click="$refs.table.loadData()">刷新</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="userId"
      :columns="columns"
      :data="loadData"
      :pagination="{ showTotal: total => `共 ${total} 条记录` }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      showPagination="auto"
    >
      <!-- <span slot="roleType" slot-scope="text">
        <span v-if="text == 1">超级管理员</span>
        <span v-if="text == 2">项目经理</span>
        <span v-if="text == 3">员工</span>
        <span v-if="text == 0">普通用户</span>
      </span> -->
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$refs.newUser.add(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="你确定要删除这个用户吗？"
            @confirm="confirmDelete(record)"
            okText="确认"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <!-- 新建与编辑规则 -->
    <new-user ref="newUser" @ok="handleOk" />
  </a-card>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import NewUser from './modules/NewUser'
import { getUserList,getRoleList,getUserDelete } from '@/api/setting'
const columns = [
        {
          title: '用户名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: '角色名称',
          dataIndex: 'roleName',
          scopedSlots: { customRender: 'roleName' }
        },
        {
          title: '创建时间',
          dataIndex: 'registTime',
          scopedSlots: { customRender: 'registTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ]

export default {
  name: 'User',
  components: {
    STable,
    Ellipsis,
    NewUser
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter,this.queryParam)).then(res => {
          this.selectedRowKeys = [];
          this.selectedRows = [];
          return res
        })
      },
      roleList:[],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
  },
  methods: {
    // 新增
    handelAdd() {},
    //批量删除
    allDelete(){
      if(this.selectedRowKeys.length == 0){
        this.$notification.info({message: '未选择任何角色！'})
      }else{
        this.$confirm({
          title: '你确定删除选中的角色吗？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk:() => {
            this.confirmDelete();
          }
        })
      }
    },
    // 删除
    confirmDelete(record=null) {
      let param = {
        userIds:[]
      }
      if(record){
        param.userIds.push(record.userId);
      }else{
        param.userIds = this.selectedRowKeys
      }
      getUserDelete(Object.assign(param)).then(res => {
        if (res.state == 1) {
          this.$refs.table.refresh()
          this.$notification.success({message: '成功'});
        }
      })
    },
    // 编辑完成
    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
  }
}
</script>
<style lang="less" scoped>
.batch-delete {
  background: rgb(21, 145, 207);
  color: #fff;
  padding: 0 30px;
  margin: 0 0 15px 15px;
}
</style>
