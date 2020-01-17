<template>
  <div class="user-wrapper">
    <div class="content-box">
      <notice-icon class="action" />
      <a-badge :count="count" :overflowCount="99">
        <!-- <a href="#" class="name">审</a> -->
        <a href="#" class="name" @click="turnApproval">审</a>
      </a-badge>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar" />
          <span>{{ nickname || 'admin' }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <!-- <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user"/>
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="1">
            <router-link :to="{ name: 'settings' }">
              <a-icon type="setting"/>
              <span>账户设置</span>
            </router-link>
          </a-menu-item>-->
          <!-- <a-menu-divider/> -->
          <a-menu-item key="0">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { getApprovalList } from '@/api/file'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
  data() {
    return {
      count: '1'
    }
  },
  created() {
    this.getInit()
  },
  components: {
    NoticeIcon
  },
  computed: {
    ...mapGetters(['nickname', 'avatar'])
  },
  methods: {
    getInit() {
      const params = {
        current: 1,
        size: 10,
        state: 0
      }
      /*getApprovalList(params).then(res => {
        if (res.state == 1) {
          // console.log(res)
          this.count = res.data.total
        } else {
        }
      })*/
    },
    ...mapActions(['Logout']),
    handleLogout() {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          // return this.Logout({})
          //   .then(() => {
          //     setTimeout(() => {
          //       localStorage.clear();
          //       window.location.reload()
          //     }, 16)
          //   })
          //   .catch(err => {
          //     this.$message.error({
          //       title: '失败',
          //       description: err.message
          //     })
          //   })
          localStorage.clear()
          // this.$router.push({ path: '/user/login' })
          window.location.reload()
        },
        onCancel() {}
      })
    },
    onSearch() {},
    turnApproval() {
      this.$router.push({
        path: '/file/approvalList'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.name {
  display: inline-block;

  font-size: 16px;
  color: #fff;
  line-height: 32px;
  text-align: center;
  border-radius: 2px;
  margin: 0 15px;
  //   background-color: #ff1531;
}
.ant-input-search /deep/ .ant-input {
  background-color: #fff !important;
  border-radius: 20px !important;
  color: #23232d;
}
// 搜索框样式
.content-box /deep/ .anticon {
  color: #b8b8be !important;
}
.ant-badge {
  /deep/ .ant-badge-count,
  .ant-badge-dot,
  .ant-badge .ant-scroll-number-custom-component {
    position: absolute;
    top: 5px;
    right: 8px;
  }
}
</style>
