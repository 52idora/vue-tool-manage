<template>
  <a-modal
    :title="'统计分布'"
    :width="800"
    :visible="visible"
    okText="保存"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-card :bordered="false" :body-style="{padding: '0px 20px 20px'}">
      <a-row :gutter="24">
        <a-col :span="12">
          <div class="m-b-20">按颜色分布</div>
          <div>
            <v-chart
              :forceFit="true"
              :height="300"
              :padding="[30,30,100,30]"
              :data="colorData"
              :scale="scale"
            >
              <v-axis />
              <v-legend data-key="filamentColor" />
              <v-pie
                position="percent"
                color="filamentColor"
                :v-style="pieStyle"
                :label="labelConfig"
              />
              <v-coord type="theta" />
            </v-chart>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="m-b-20">按重量分布</div>
          <div>
            <v-chart
              :forceFit="true"
              :height="300"
              :padding="[30, 30, 100, 30]"
              :data="weightData"
              :scale="scale"
            >
              <v-axis />
              <v-legend data-key="filamentWeight" />
              <v-pie
                position="percent"
                color="filamentWeight"
                :v-style="pieStyle"
                :label="labelConfig2"
              />
              <v-coord type="theta" />
            </v-chart>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </a-modal>
</template>

<script>
import { filamentStoreStastic } from '@/api/manage'
import { STable } from '@/components'
let lodash = require('lodash')
const DataSet = require('@antv/data-set')

const sourceData = [
  { item: '事例一', count: 40 },
  { item: '事例二', count: 21 },
  { item: '事例三', count: 17 },
  { item: '事例四', count: 13 },
  { item: '事例五', count: 9 }
]

const scale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
]

const dv = new DataSet.View().source(sourceData)
dv.transform({
  type: 'percent',
  field: 'colorCount',
  dimension: 'filamentColor',
  as: 'percent'
})
const colorData = dv.rows
const sv = new DataSet.View().source(sourceData)
sv.transform({
  type: 'percent',
  field: 'weightCount',
  dimension: 'filamentWeight',
  as: 'percent'
})
const weightData = sv.rows
export default {
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      colorData,
      weightData,
      scale,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      labelConfig: [
        'percent',
        {
          formatter: (val, item) => {
            return item.point.filamentColor + ': ' + val
          }
        }
      ],
      labelConfig2: [
        'percent',
        {
          formatter: (val, item) => {
            console.log(val, item)
            return item.point.filamentWeight + ': ' + val
          }
        }
      ]
    }
  },
  created() {
    this.getInit()
  },

  methods: {
    add(record = null) {
      if (record == null) {
        this.visible = true
      } else {
        this.visible = true
      }
    },
    getInit() {
      filamentStoreStastic({ filamentId: this.$route.query.id }).then(res => {
        console.log(res)
        if (res.state == 1) {
          let colorList = res.data.colors
          const dv = new DataSet.View().source(colorList)
          dv.transform({
            type: 'percent',
            field: 'colorCount',
            dimension: 'filamentColor',
            as: 'percent'
          })
          this.colorData = dv.rows
          let weightList = res.data.weights
          const sv = new DataSet.View().source(weightList)
          sv.transform({
            type: 'percent',
            field: 'weightCount',
            dimension: 'filamentWeight',
            as: 'percent'
          })
          this.weightData = sv.rows
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  },
  // 过滤器
  filters: {}
}
</script>
<style lang="less">
</style>