<template>
  <transition name="showHeader">
    <div class="global_upload header-animat" v-if="visible" ref="upload">
      <div class="upload_top">
        <a-icon type="close" @click="handleClose()" class="upload_close" />
        <div class="upload_close">
          <a-icon type="down" @click="toggle" v-if="collapsed == false" class="toggle" />
          <a-icon type="up" @click="toggle" v-else class="toggle" />
        </div>
      </div>
      <div class="upload_main">
        <div class="main_top">
          <div>文件正在上传 ({{ listSuccess }}/{{ fileList.length }})</div>
          <p>单个文件大小不超过20MB</p>
        </div>

        <div class="main_content" v-if="showFile">
          <ul>
            <li v-for="(item, index) in fileList" :key="index">
              <div class="file_name">
                <ellipsis :length="20" tooltip> {{ item.file.name }}</ellipsis>
              </div>
              <div class="file_size">{{ item.file.size | FileSize }}</div>
              <a-progress type="circle" :percent="100" :status="item.status" :width="30" class="file_progress" />
              <!-- <div class="file_progress">{{item.progress}}</div> -->
              <div class="file_delete">
                <a-icon type="close" @click="handleDelete(item, index)" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import bus from '@/views/files/bus'
import SMenu from '../Menu/'
import Logo from '../tools/Logo'
import { mixin } from '@/utils/mixin'
import { Ellipsis } from '@/components'
import axios from 'axios'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'GlobalUpload',
  components: {
    UserMenu,
    SMenu,
    Ellipsis,
    Logo
  },
  mixins: [mixin],
  props: {},
  data() {
    return {
      percent: 20,
      visible: false,
      collapsed: false,
      showFile: true,
      listSuccess: 0,
      fileList: []
    }
  },
  created() {
    bus.$on('uploadFile', value => {
      this.add(value)
    })
  },
  methods: {
    add(files) {
      this.visible = true
      let data = {
        file: files.file,
        type: files.type,
        totalP: 0
      }
      this.fileList.unshift(data)
      this.upload(this.fileList[0])
    },
    upload(data) {
      let param = new FormData()
      //通过append向form对象添加数据
      param.append('files', data.file)
      //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      // console.log(param.get('files'))

      //通过axios上传文件
      //配置
      const token = Vue.ls.get(ACCESS_TOKEN)
      let that = this
      let config = {
        //添加请求头

        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        },
        //添加上传进度监听事件
        onUploadProgress: e => {
          data.totalP = ((e.loaded / e.total) * 100) | 0
          if (data.totalP == 100) {
            that.listSuccess += 1
          }
        }
      }
      //fileBin/upload
      let url = ''
      if (data.type == 1) {
        //个人文件上传
        url = 'filePrivate/upload'
      } else if (data.type == 2) {
        //切片模板上传
        url = 'fileBin/upload'
      }
      axios
        .post(`${process.env.VUE_APP_API_BASE_URL}` + url, param, config)
        .then(function(response) {
          if (response.data.state == 1) {
            if (data.type == 1) {
              //个人文件上传
              bus.$emit('updateFileList', 1)
            } else if (data.type == 2) {
              //切片模板上传
              bus.$emit('updateBinList', 1)
            }
          }
        })
        .catch(function(error) {})
    },
    // 关闭上传详情弹框
    handleClose() {
      this.fileList = []
      this.visible = false
    },
    handleDelete(item, index) {
      if (item.totalP == 100) {
        this.listSuccess -= 1
      }
      this.fileList.splice(index, 1)
    },
    /*  toggle() {
      this.$emit('toggle')
    } */
    toggle() {
      this.collapsed = !this.collapsed
      if (this.collapsed) {
        console.log('yincang')
        this.showFile = false
      } else {
        console.log('xianshi')
        this.showFile = true
      }
    }
  },
  filters: {},
  beforeDestroy() {
    document.body.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';

.header-animat {
  position: relative;
  z-index: @ant-global-header-zindex;
}
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  transition: all 0.5s ease;
}
.showHeader-enter,
.showHeader-leave-to {
  opacity: 0;
}
/deep/ .ant-card {
  position: absolute;
  background-color: pink;
  right: 0;
  width: 35%;
}
.global_upload {
  position: fixed;
  padding: 14px;
  background-color: #272733;
  border-radius: 2px;
  width: 500px;
  bottom: 0;
  right: 0;
  border: 1px solid #181820;
  .upload_top {
    position: relative;
    line-height: 30px;
    .upload_close {
      line-height: 30px;
      color: #d6d6d9;
      float: right;
      margin-left: 20px;
    }
  }
  .upload_main {
    .main_top {
      color: #cdcdd0;
      border-bottom: 1px solid #181820;
      div {
        line-height: 30px;
        font-size: 16px;
        color: #fff;
      }
      p {
        font-size: 12px;
        line-height: 26px;
        margin-bottom: 0;
      }
    }
    .main_content {
      padding-top: 0;
      margin: 0;
      ul {
        padding-left: 0;
        margin-top: 0;
        height: 150px;
        margin-bottom: 10px;
        overflow: auto;
        li {
          color: #c2c3c6;
          height: 50px;
          line-height: 50px;
          list-style: none;
          width: 100%;
          float: left;
          border-bottom: 1px solid #15151d;
          div {
            float: left;
          }
          .file_name {
            width: 50%;
          }
          .file_size,
          .file_progress {
            text-align: center;
            width: 20%;
          }
          .file_progress {
            margin-top: 10px;
          }
          .file_delete {
            width: 10%;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
