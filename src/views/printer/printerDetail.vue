<template>
  <div>
    <a-row>
      <a-col :span="12" class="p-r-12">
        <machine-info :detail="printerDetail" ref="machineInfo" />
      </a-col>
      <a-col :span="12" class="p-l-12">
        <div class="video-box">
          <div class="title" :key="camera">
            Camera
            <a-button type="info" style="float:right" @click="back">返回</a-button>
          </div>
          <div class="camera_img">
            <img :src="imgUrl" alt />
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12" class="p-r-12">
        <machine-temp :detail="printerDetail" @ok="detail()" ref="machineTemp" />
      </a-col>
      <a-col :span="12" class="p-l-12">
        <machine-queue :detail="printerDetail" @ok="detail()" ref="machineQueue" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import machineInfo from './modules/machineInfo'
import machineQueue from './modules/machineQueue'
import machineTemp from './modules/machineTemp'
import {
  printerMachineSet,
  printerMachineSwitch,
  printerDetail,
  printerGetVideoInfo,
  printerOther
} from '@/api/printer'
export default {
  name: 'printerDetail',
  components: {
    machineInfo,
    machineQueue,
    machineTemp
  },
  data() {
    return {
      printerId: null,
      printerDetail: {},
      description: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
      value: 1,
      imgUrl: '@/assets/img/printer/noSign.png',
      camera: 1,

      // form
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.printerId = this.$route.query.id
    this.detail()
    this.getVedio()
  },
  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.detail()
      }, 5000)
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
        }
      })
    },
    // 详情
    detail() {
      printerDetail({ machineId: this.printerId }).then(res => {
        // console.log(res)
        if (res.state == 1) {
          this.printerDetail = res.data
          if (res.data.nozzle_temp_2 == null) {
            this.$refs.machineTemp.$emit('init', 1, res.data)
          } else {
            this.$refs.machineTemp.$emit('init', 2, res.data)
          }

          this.$refs.machineQueue.$emit('init', res.data)
          this.$refs.machineInfo.$emit('init', res.data)
        }
      })
      /* this.$http.post('/machine/find', { machineId: this.printerId }).then(res => {
        if (res.state == 1) {
          this.printerDetail = res.data
        }
      }) */
    },
    getVedio() {
      //printerOther //printerGetVideoInfo
      printerGetVideoInfo({ machineId: this.$route.query.id }).then(res => {
        if (res.state == 1) {
          console.log(res)
          this.imgUrl = res.data
          clearInterval(this.picture)
        } else {
          this.getPicture()
        }
      })
    },
    getPicture() {
      this.camera = 1
      const params = {
        machine_id: this.$route.query.id,
        get_picture: true
      }
      printerOther(params).then(res => {
        // console.log(res)
        if (res.state == 1) {
          if (res.data == null) {
            this.getAgain()
          } else {
            this.camera = this.camera + 1
            this.imgUrl = res.data
          }
        } else {
          this.imgUrl = '@/assets/img/printer/noSign.png'
          this.getAgain()
        }
      })
    },
    getAgain() {
      if (this.picture) {
        clearInterval(this.picture)
      } else {
        this.picture = setInterval(() => {
          this.getPicture()
        }, 5000)
      }
    },
    back() {
      /* this.$router.push({
        name: 'PrinterManager'
      }) */
      this.$router.push({ name: 'PrinterManage' })
    }
  }
}
</script>
<style lang="less">
.video-box {
  background: #17171f;
  padding: 20px;
  height: 300px;
  .title {
    font-size: 23px;
    margin-bottom: 15px;
  }
}
.camera_img {
  width: 290px;
  height: 206px;
  background: url('../../assets/img/printer/noSign.png');
  background-repeat: no-repeat;
  background-size: cover;
  img {
    width: 100%;
  }
}
</style>
