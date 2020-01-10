<template>
  <a-modal
    title="Gcode编辑"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <codemirror
        ref="myCm"
        v-model="content"
        :value="content"
        :options="Options"
        @changes="handleCodeChange"
        class="code"
      ></codemirror>
      <a-row :gutter="48" style="text-align:center;margin-top:24px">
        <a-button @click="handleSubmit" type="primary">保存</a-button>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import axios from 'axios'
import { codemirror } from 'vue-codemirror'
import { getMyFileGetUrl, getMyFileEditGcode } from '@/api/file'
import 'codemirror/theme/ambiance.css' // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
require('codemirror/mode/javascript/javascript') // 这里引入的模式的js，根据设置的mode引入，一定要引入！！
// import { getPrinterHistory } from '@/api/printer'
export default {
  components: {
    codemirror
  },

  data() {
    return {
      content: '',
      Options: {
        value: '',
        mode: 'text/javascript', //选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        theme: 'ambiance', // 主题
        // keyMap: 'sublime', // 快键键风格
        lineNumbers: true, // 显示行号
        smartIndent: true, //智能缩进
        indentUnit: 4, // 智能缩进单位为4个空格长度
        indentWithTabs: true, // 使用制表符进行智能缩进
        lineWrapping: true, //
        // 在行槽中添加行号显示器、折叠器、语法检测器`
        /* gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'], */
        foldGutter: true, // 启用行槽中的代码折叠
        autofocus: true, //自动聚焦
        matchBrackets: true, // 匹配结束符号，比如"]、}"
        autoCloseBrackets: true, // 自动闭合符号
        styleActiveLine: true // 显示选中行的样式s
      },
      visible: false,
      confirmLoading: false,
      fileId: '',

      form: this.$form.createForm(this)
    }
  },

  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror
    }
  },

  methods: {
    add(id) {
      this.fileId = id
      this.getInit()
    },
    // 初始化数据
    getInit() {
      getMyFileGetUrl({ fileId: this.fileId }).then(res => {
        if (res.state == 1) {
          if (res.data) {
            axios.get(res.data).then(
              res => {
                console.log(res)
                if (res.status == 200) {
                  this.content = res.data
                  this.visible = true
                } else {
                  this.$notification.error({ message: '获取Gcode文件失败' })
                }
              },
              error => {
                this.$notification.error({ message: '获取Gcode文件失败' })
              }
            )
          } else {
            this.$notification.error({ message: '获取Gcode文件失败' })
          }
        } else {
          this.$notification.error({ message: '获取Gcode文件失败' })
        }
      })
    },
    // Gcode编辑
    handleCodeChange(value) {},
    //gcode编辑提交
    handleSubmit() {
      this.confirmLoading = true
      const params = {
        content: this.content,
        fileId: this.fileId
      }
      getMyFileEditGcode(params).then(res => {
        console.log(res)
        if (res.state == 1) {
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
          this.$notification.success({ message: 'Gcode编辑成功！' })
        } else {
          this.confirmLoading = false
          this.$notification.error({ message: 'Gcode编辑失败！' })
        }
      })
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
.code {
  font-size: 11pt;
  background-color: pink;
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono,
    Courier New, monospace, serif;
}
</style>
