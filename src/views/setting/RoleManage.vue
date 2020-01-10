<template>
  <a-card :bordered="false" :style="{ height: '100%' }">
    <a-row :gutter="24">
      <a-col :md="6">
        <a-list itemLayout="horizontal" :dataSource="roles" size="large">
          <a-list-item slot="renderItem" slot-scope="item">
            <a slot="actions" @click="$refs.newRole.add(item)">
              <a-icon type="form" />
            </a>
            <a-popconfirm
             slot="actions"
              title="你确定要删除这个角色吗？"
              @confirm="confirmDelete(item)"
              okText="确认"
              cancelText="取消"
            >
              <a><a-icon type="delete" /></a>
            </a-popconfirm>
            <a-list-item-meta :style="{ marginBottom: '0' }">
              <a slot="title" :class="{red:roleDetail.roleId == item.roleId}" @click="tabChange(item)" style="text-align: left; display: block">
                <span>{{ item.roleName }}</span>
                <!-- <span v-if="item.roleType == 1">超级管理员</span>
                <span v-if="item.roleType == 2">项目经理</span>
                <span v-if="item.roleType == 3">员工</span>
                <span v-if="item.roleType == 0">普通用户</span> -->
              </a>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
        <a-button type="primary" @click="$refs.newRole.add()" style="width:100%">
          <a-icon type="plus" />新增
        </a-button>
      </a-col>
      <a-col :md="18">
        <div style="max-width: 800px">
          <a-row>
            <a-col :span="12" class="l-h-40">角色名：{{roleDetail.roleName}}</a-col>
            <a-col :span="12" class="l-h-40">
              <span>角色类型：</span>
              <span v-if="roleDetail.roleType == 1">超级管理员</span>
              <span v-if="roleDetail.roleType == 2">项目经理</span>
              <span v-if="roleDetail.roleType == 3">员工</span>
              <span v-if="roleDetail.roleType == 0">普通用户</span>
            </a-col>
            <a-col :span="24" class="l-h-40">备注：{{roleDetail.roleDesc}}</a-col>
            <a-col :span="24" class="l-h-40"><a-button @click="$refs.NewPermission.add()">添加权限</a-button></a-col>
          </a-row>
          <h3 class="m-b-20 m-t-20">权限设置：</h3>
          <a-row
            :gutter="16"
            v-for="item in permissions"
            :key="item.menuId"
            class="row_checkbox"
          >
            <a-col :xl="6" :lg="5">{{ item.menuName }}：</a-col>
            <a-col :xl="18" :lg="19">
              <a-checkbox
                :indeterminate="item.indeterminate"
                @change="onCheckAllChange($event,item)"
                :checked="item.checkAll"
              >全选</a-checkbox>
              <a-checkbox-group :options="item.userMenuRS" v-model="item.checkedList" @change="onChange(item)" />
              <!-- <a-checkbox
                v-for="ele in item.userMenuRS"
                :key="ele.menuId"
                @change="onCheckChange(item)"
                v-model="ele.selected"
              >{{ele.menuName}}</a-checkbox> -->
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-button type="primary" class="edit_submit" @click="permissionsSubmit">保存</a-button>
          </a-row>
        </div>
      </a-col>
    </a-row>
    
    <new-role ref="newRole" @ok="handleOk" />
    <new-permission ref="NewPermission" @ok="permissionOk" />
  </a-card>
</template>

<script>
import { getUserList,getRoleList,userRoleDelete,getRoleMenuList,editRoleMenu } from '@/api/setting'
import { mixinDevice } from '@/utils/mixin'
import { actionToObject } from '@/utils/permissions'
import pick from 'lodash.pick'
import NewRole from './modules/NewRole'
import NewPermission from './modules/NewPermission'
/* 参照: /views/role/roleList */

export default {
  name: 'RoleList',
  mixins: [mixinDevice],
  components: {
    NewRole,
    NewPermission
  },
  data() {
    return {
      form: this.$form.createForm(this),
      mdl: {},
      showAdd: false,
      checkedList: [],
      roles: [],
      permissions: [],
      roleDetail:{
        roleId:null,
        roleType:null,
        roleName:null,
        roleDesc:null
      }
    }
  },
  created() {
    this.getUserRole();
  },
  methods: {
    //获取角色列表
    getUserRole(){
      getRoleList(Object.assign({})).then(res => {
        if (res.state == 1) {
          this.roles = res.data;
          if(this.roles[0]) this.tabChange(this.roles[0])
        }else{
          that.$notification.error({message: '失败'});
        }
      })
    },
    //删除角色
    confirmDelete(record) {
      userRoleDelete(Object.assign({roleId:record.roleId})).then(res => {
        if (res.state == 1) {
          this.$refs.table.refresh()
          this.$notification.success({message: '成功'});
        }
      })
    },
    //切换角色
    tabChange(data){
      this.roleDetail = data;
      this.loadPermissions();
    },
    // 获取权限列表
    loadPermissions() {
      getRoleMenuList(Object.assign({roleId:this.roleDetail.roleId})).then(res => {
        if (res.state == 1) {
          res.data.forEach(item => {
            item.checkAll = false;
            item.indeterminate = false;
            item.checkedList = [];
            item.userMenuRS.forEach(ele => {
              ele.label = ele.menuName;
              ele.value = ele.menuId;
              if(ele.selected == true) item.checkedList.push(ele.menuId)
            })
            this.onChange(item);
          })
          this.permissions = res.data;
        }
      })
    },
    //单选操作
    onChange(item) {
      item.indeterminate = !!item.checkedList.length && item.checkedList.length < item.userMenuRS.length;
      item.checkAll = item.checkedList.length === item.userMenuRS.length;
    },
    //全选操作
    onCheckAllChange(e,item) {
      Object.assign(item, {
        checkedList: e.target.checked ? item.userMenuRS.map(obj => obj.value = obj.menuId) : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },
    // 保存角色
    handleOk() {
      this.getUserRole();
    },
    //添加权限菜单
    permissionOk(){
      this.loadPermissions();
    },
    //保存权限配置
    permissionsSubmit(){
      let selecteds = [];
      this.permissions.forEach(item => selecteds = selecteds.concat(item.checkedList))
      editRoleMenu(Object.assign({roleId:this.roleDetail.roleId,menuIds:selecteds.join(",")})).then(res => {
        if (res.state == 1) {
         this.loadPermissions();
         this.$notification.success({message: '成功'});
        }else{
          that.$notification.error({message: '失败'});
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.l-h-40{
  line-height: 40px;
}
.red{
  color: #FF1531;
}
.batch-delete {
  float: right;
  margin-left: 15px;
  text-align: right;
}
.edit_submit {
  float: left;
  margin-left: 30px;
  z-index: 100;
}
.row_checkbox.ant-row {
  line-height: 20px;
}
.ant-form /deep/ .ant-form-item-label label {
  color: #fff;
}
/deep/ .ant-checkbox-wrapper {
  margin-bottom: 18px;
}
/* /deep/ .ant-checkbox-inner {
  background-color: transparent;
}
.ant-checkbox-checked .ant-checkbox-inner,
.ant-checkbox-indeterminate .ant-checkbox-inner {
  background-color: transparent;
  border: 1px solid #1bba79;
} */
/deep/ .ant-checkbox-inner {
  background-color: transparent;
  color: #fff;
}
</style>
