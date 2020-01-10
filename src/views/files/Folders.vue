<template>
  <div class="product_content">
    <div class="product_box">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <a-form-item>
                <div class="folder_name" v-text="title"></div>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item>
                <a-input v-model="queryParam.name" placeholder="请输入文件名" :maxlength="50" @pressEnter="search()" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-button type="primary" @click="search()">查询</a-button>
              <a-button style="margin-left: 8px;" class="default_btn" @click="reset()">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" @click="$refs.newFolder.add()">新建文件夹</a-button>
      </div>
    </div>
    <a-list :grid="{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <!-- <a-card :title="item.title">Card content</a-card> -->
        <a-card hoverable class="card">
          <div class="ant-card-img" :style="{ height: topCardH + 'px' }" @click="handleDetail(item)">
            <img alt="图片加载失败" :src="item.imgUrl" slot="cover" />
          </div>
          <a-card-meta :title="item.title"></a-card-meta>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="handleSet(item)">设置成套</a-menu-item>
              <a-menu-item key="2" @click="del(item.dirId)">删除</a-menu-item>
            </a-menu>
            <a-icon type="bars" class="bars" />
          </a-dropdown>
          <!-- <a-tooltip placement="topLeft">
            <template slot="title">
              <span>设置成套</span>
            </template>
            <a-icon type="bars" class="bars" @click="$refs.folderSet.add()" />
          </a-tooltip>-->
        </a-card>
      </a-list-item>
    </a-list>
    <new-folder ref="newFolder" @ok="handleOk" />
    <folder-detail ref="folderDetail" />
    <folder-set ref="folderSet" @ok="handleOk" />
    <!-- <create-form ref="createModal" @ok="handleOk" />
    <step-by-step-modal ref="modal" @ok="handleOk"/>-->
  </div>
</template>

<script>
import moment from 'moment'
import { Ellipsis } from '@/components'
/* import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm' */
import NewFolder from './modules/NewFolder'
import FolderDetail from './modules/FolderDetail'
import FolderSet from './modules/FolderSet'
import { getProjectDirList, getProjectDirDelete } from '@/api/file'
export default {
  name: 'ProductFile',
  components: {
    Ellipsis,
    NewFolder,
    FolderDetail,
    FolderSet
    /* CreateForm, */
    /* StepByStepModal */
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      projectId: this.$route.query.id,
      title: this.$route.query.name,
      queryParam: {},
      topCardH: 0,

      data: []
    }
  },
  created() {
    let that = this

    window.onresize = function() {
      that.setImgHeight()
    }
    that.getInit()
    // getRoleList({ t: new Date() })
  },
  mounted() {
    // this.setImgHeight()
  },
  methods: {
    getInit(word) {
      const params = {
        word: word || '',
        projectId: this.projectId
      }
      getProjectDirList(params).then(res => {
        console.log(res)
        if (res.state == 1) {
          console.log(res.data)
          this.data = res.data
          this.data.forEach(item => {
            item.imgUrl = `https://src.raise3d.cn/factory/${item.imgUrl}`
          })
        } else {
          console.log('shibai')
        }
      })
    },
    onPageChange(pageNumber) {
      console.log('Page: ', pageNumber)
    },
    handleDetail(item) {
      console.log(item)
      this.$refs.folderDetail.add(item.dirId, item.setId, this.title, item.title)
    },
    handleSet(item) {
      this.$refs.folderSet.add(item, this.title)
    },
    // 更多操作(删除/设置成套)
    handleMenuClick(e) {
      /* if (e.key == 1) {
        console.log('设置成套')
        this.$refs.folderSet.add()
      } else if (e.key == 2) {
        console.log('删除')
        this.del()
      } */
    },
    del(id) {
      this.$confirm({
        title: '你确定删除吗？',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const params = {
            dirIds: id
          }
          getProjectDirDelete(params).then(res => {
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
        }
      })
    },
    handleOk() {
      this.getInit()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 查询
    search() {
      this.getInit(this.queryParam.name)
    },
    reset() {
      this.queryParam = {}
      this.getInit()
    },
    // 计算图片高度
    setImgHeight() {
      this.topCardH = document.getElementsByClassName('ant-card-img')[0].offsetWidth * 0.618
    }
  }
}
</script>
<style lang="less" scoped>
.product_content {
  > .ant-card-body {
  }
}
.product_box {
  margin-bottom: 24px;
  padding: 24px;
  background-color: #1b1b25;
}
.table-operator {
  margin-bottom: 0;
}
.ant-list {
  background-color: #272733;
  height: 700px;
  overflow: auto;
}
/deep/ .ant-list-grid .ant-list-item {
  margin-bottom: 24px;
}
.ant-card.card.ant-card-bordered {
  width: 100%;
  text-align: center;

  /deep/ .ant-card-head {
    border-bottom: 1px solid #1b1b25;
  }
  /deep/ .ant-card-meta-title {
    padding: 15px;
    color: #f1f1f1 !important;
  }
  /deep/ .ant-card-cover {
    background-color: pink;
    // width: 100%;
    // height: 300px;
    overflow: hidden;
  }
  .ant-card-img {
    width: 100%;
    min-height: 180px;
    overflow: hidden;
    position: relative;
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
  .bars {
    position: absolute;
    bottom: 15px;
    right: 15px;
  }
  /deep/ .ant-card-body {
    padding: 0;
  }
}
.layout.ant-layout.mobile .ant-layout-content .ant-card /deep/ .ant-card-body,
.layout.ant-layout.tablet .ant-layout-content .ant-card /deep/ .ant-card-body {
  padding: none !important;
}
.folder_name {
  font-size: 18px;

  color: #fff;
  width: 100%;
}
</style>
