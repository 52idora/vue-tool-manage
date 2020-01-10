<template>
  <div class="product_content">
    <div class="product_box">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item>
                <a-input
                  v-model="queryParam.word"
                  placeholder="请输入项目名称"
                  :maxlength="50"
                  @pressEnter="search()"
                />
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
        <a-button type="primary" @click="$refs.newProject.add()">新建项目</a-button>
      </div>
    </div>
    <a-list :grid="{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- <a-card :title="item.title">Card content</a-card> -->

        <a-card hoverable class="card">
          <div class="ant-card-img" :style="{ height: topCardH + 'px' }" @click="handleFolder(item)">
            <img alt="图片加载失败" :src="item.imgUrl" slot="cover" />
          </div>
          <a-card-meta :title="item.title"></a-card-meta>
          <a-popconfirm title="确定删除吗?" @confirm="del(item.projectId)" okText="是" cancelText="否">
            <a href="#">删除</a>
          </a-popconfirm>
        </a-card>
      </a-list-item>
    </a-list>
    <new-project ref="newProject" @ok="handleOk" />
    <!-- <create-form ref="createModal" @ok="handleOk" />
    <step-by-step-modal ref="modal" @ok="handleOk"/>-->
  </div>
</template>

<script>
import moment from 'moment'
import { Ellipsis } from '@/components'
/* import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm' */
import NewProject from './modules/NewProject'
import { getProjectList, getProjectDelete } from '@/api/file'

export default {
  name: 'ProductFile',
  components: {
    Ellipsis,
    NewProject
    /* CreateForm, */
    /* StepByStepModal */
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
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
      //   this.setImgHeight()
      const params = {
        size: 20,
        current: 1,
        word: word || ''
      }
      getProjectList(params).then(res => {
        console.log(res)
        if (res.state == 1) {
          console.log(res.data)
          this.data = res.data
          this.data.forEach(item => {
            item.imgUrl = `https://src.raise3d.cn/factory/${item.imgUrl}`
          })
        }
      })
    },
    handleFolder(item) {
      console.log('点击')
      console.log(item)
      this.$router.push({
        name: 'folders',
        query: {
          id: item.projectId,
          name: item.title
        }
      })
    },
    handleEdit(record) {
      console.log(record)
      this.$refs.modal.edit(record)
    },
    handleOk() {
      this.getInit()
    },
    // 删除
    del(id) {
      const params = {
        projectIds: id
      }
      getProjectDelete(params).then(res => {
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
    // 查询
    search() {
      this.getInit(this.queryParam.word)
    },
    // 重置
    reset() {
      this.queryParam = {}
      this.getInit()
    },
    // 计算图片高度
    setImgHeight() {
      // this.topCardH = document.getElementsByClassName('ant-card-img')[0].offsetWidth * 0.618
    }
  }
}
</script>
<style lang="less" scoped>
.product_box {
  margin-bottom: 24px;
  padding: 24px;
  background-color: #1b1b25;
}
.ant-list {
  height: 700px;
  overflow: auto;
  background-color: #272733;
}
/deep/ .ant-list-grid .ant-list-item {
  margin-bottom: 24px;
}
.table-operator {
  margin-bottom: 0;
}

.ant-card.card {
  width: 100%;
  text-align: center;
  //   border: 1px solid #fff;
  /deep/ .ant-card-body {
    padding: 0 !important;
  }
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
  a {
    position: absolute;
    bottom: 12px;
    right: 15px;
  }
}
</style>
