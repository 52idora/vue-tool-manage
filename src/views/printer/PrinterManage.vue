<template>
  <div>
    <!-- 筛选操作 -->
    <div class="operation clearfix">
      <div class="m-b-24">
        <a-row>
          <a-col :span="8" class="item">
            <span class="title">按照喷嘴口径：</span>
            <a-select class="select" v-model="queryParam.nozzleSize1">
              <a-select-option value="0.2">0.2mm</a-select-option>
              <a-select-option value="0.4">0.4mm</a-select-option>
              <a-select-option value="0.6">0.6mm</a-select-option>
              <a-select-option value="0.7">0.8mm</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="8" class="item">
            <span class="title">按照喷嘴个数：</span>
            <a-select class="select" v-model="queryParam.nozzleNum">
              <a-select-option value="1">1</a-select-option>
              <a-select-option value="2">2</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="8">
            <a-button type="primary" class="m-r-20" @click="filter(1)">搜索</a-button>
            <a-button @click="filter(0)">重置</a-button>
            <!-- 设置显示字段 -->
            <span class="setting" @click="showModal">
              <a-icon type="setting" />
            </span>
          </a-col>
        </a-row>
      </div>
      <div class="m-b-24">
        <a-row>
          <a-col :span="8" class="item">
            <span class="title">打印机名称：</span>
            <a-input placeholder="打印机名称" class="printer-name" maxLength="100" v-model="queryParam.machineName" />
          </a-col>
          <a-col :span="8" class="item">
            <span class="title">打印材料：</span>
            <a-input placeholder="材料名称" class="printer-name" maxLength="100" v-model="queryParam.filamentName" />
          </a-col>
        </a-row>
      </div>
      <div>
        <a-row>
          <a-col :span="12">
            <!-- <a-button type="primary"> <a-icon type="plus" />绑定打印机 </a-button> -->
          </a-col>
          <a-col :span="12" class="text-right">
            <a-select style="width: 120px" v-model="queryParam.regionId" @change="productChange()" placeholder="请选择产区">
              <a-select-option :value="item.regionId" v-for="(item, index) of productArray" :key="index">{{
                item.regionName
              }}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 列表 -->
    <a-card :bordered="false">
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        rowKey="machineId"
        v-model="current"
        :pageSizeOptions="size"
        @change="tablePage"
        showPagination="auto"
        :pagination="pagination"
      >
        <span slot="machineNum" slot-scope="text">{{ text }}</span>
        <span slot="machineState" slot-scope="text">
          <a-tag class="tag_style" :color="text | statusTypeFilter">{{ text | statusFilter }}</a-tag>
        </span>
        <span slot="regionName" slot-scope="text">{{ text }}</span>
        <span slot="machineName" slot-scope="text">{{ text }}</span>
        <span slot="machineType" slot-scope="text">{{ text }}</span>
        <span slot="nozzleSize" slot-scope="text, record">
          <span class="m-r-15">
            <span class="state">L</span>
            <span>{{ record.nozzleSize1 || '--' }}</span>
            <span v-if="record.nozzleSize1">mm</span>
          </span>
          <span v-if="record.nozzleNum == 2">
            <span class="state">R</span>
            <span>{{ record.nozzleSize2 || '--' }}</span>
            <span v-if="record.nozzleSize2">mm</span>
          </span>
        </span>
        <span slot="filament" slot-scope="text, record"
          ><template>
            <div v-if="record.filamentVolumeRS != undefined && record.filamentVolumeRS.length > 0">
              <div>
                <span v-if="record.filamentVolumeRS[0].restWeight">L: {{ record.filamentVolumeRS[0].restWeight }}</span>
                <span v-else>L: --</span>
              </div>
              <div>
                <div v-if="record.filamentVolumeRS[1]">
                  <span v-if="record.filamentVolumeRS[1].restWeight"
                    >R: {{ record.filamentVolumeRS[1].restWeight }}</span
                  >
                  <span v-else>R: --</span>
                </div>
                <div v-else></div>
              </div>
            </div>
            <div v-else>--</div>
          </template></span
        >
        <span slot="fileName" slot-scope="text">
          <ellipsis :length="50" tooltip>{{ text }} </ellipsis></span
        >
        <span slot="printProgress" slot-scope="text">{{ text }}</span>
        <span slot="nozzleNum" slot-scope="text">{{ text }}</span>
        <span slot="trayName" slot-scope="text">{{ text }}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="printerDetail(record)">详情</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定解绑吗?" @confirm="unbind(record.machineId)" okText="是" cancelText="否">
              <a href="#">解绑</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>
    </a-card>
    <!-- 设置显示字段 -->
    <a-modal title="设置显示字段" v-model="visible" :footer="null">
      <div class="model">
        <div class="clearfix">
          <div class="left">
            <a-checkbox-group
              :options="showFilter"
              @change="isShowFilter"
              :defaultValue="defaultValue"
            ></a-checkbox-group>
          </div>
          <div class="right">
            <span v-for="(item, index) of selFilter" :key="index" class="label">{{ item.value }}</span>
          </div>
        </div>
        <span class="tip" v-if="selFilter.length > 6">最多允许同时添加6个字段</span>
        <div class="text-center">
          <a-button type="primary" class="m-r-20" @click="saveFilter">保存</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { printerList, printerOther } from '@/api/printer'

const statusMap = {
  idle: {
    status: 'rgb(64, 130, 193)',
    text: '空闲'
  },
  busy: {
    status: '#926dde',
    text: '忙'
  },
  running: {
    status: 'rgb(237, 175, 103)',
    text: '打印中'
  },
  completed: {
    status: 'rgb(84, 176, 149)',
    text: '完成'
  },
  error: {
    status: 'rgb(221, 94, 88)',
    text: '错误'
  },
  paused: {
    status: 'rgb(221, 94, 88)',
    text: '暂停'
  },
  offline: {
    status: 'rgb(115, 115, 115)',
    text: '离线'
  },
  cutting: {
    status: 'rgb(221, 94, 88)',
    text: '断料'
  },
  downloading: {
    status: '#926dde',
    text: '下载中'
  },
  starving: {
    status: 'rgb(221, 94, 88)',
    text: '缺料'
  }
}

export default {
  name: 'PrinterManager',
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      current: 1,
      size: 10,
      productArray: [],
      printerArray: [],
      printerName: null,
      filamentName: null,
      currentProduct: null,
      currentSize: null,
      currentNozzle: null,
      visible: false,
      exceedFilter: false, //超出显示字段限制
      loading: false, //filter字段保存loading
      pagination: {
        current: 1,
        hideOnSinglePage: false,
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: total => `Total:${total}`
      },
      //显示字段
      showFilter: [],
      defaultValue: [],
      //默认选中的字段
      defultFilter: [
        {
          label: '打印机编号',
          value: '打印机编号',
          checked: true,
          disabled: true
        },
        {
          label: '产区名称',
          value: '产区名称',
          checked: true,
          disabled: true
        },
        {
          label: '打印机状态',
          value: '打印机状态',
          checked: true,
          disabled: true
        }
      ],
      // 选中的显示字段
      selFilter: [],
      // 查询参数
      queryParam: {},
      // 表头
      columns: [],
      defaultColumns: [
        {
          title: '打印机编号',
          dataIndex: 'machineNum',
          scopedSlots: { customRender: 'machineNum' }
        },
        {
          title: '打印机状态',
          dataIndex: 'machineState',
          scopedSlots: { customRender: 'machineState' }
        },
        {
          title: '产区名称',
          dataIndex: 'regionName',
          scopedSlots: { customRender: 'regionName' }
        },
        {
          title: '打印机名称',
          dataIndex: 'machineName',
          scopedSlots: { customRender: 'machineName' }
        },
        {
          title: '打印机类型',
          dataIndex: 'machineType',
          scopedSlots: { customRender: 'machineType' }
        },
        {
          title: '喷嘴口径',
          dataIndex: 'nozzleSize',
          scopedSlots: { customRender: 'nozzleSize' }
        },
        {
          title: '耗材使用',
          dataIndex: 'filament',
          scopedSlots: { customRender: 'filament' }
        },
        {
          title: '文件名称',
          dataIndex: 'fileName',
          scopedSlots: { customRender: 'fileName' }
        },
        {
          title: '打印进度',
          dataIndex: 'printProgress',
          scopedSlots: { customRender: 'printProgress' }
        },
        {
          title: '喷嘴个数',
          dataIndex: 'nozzleNum',
          scopedSlots: { customRender: 'nozzleNum' }
        },
        {
          title: '托盘名称',
          dataIndex: 'trayName',
          scopedSlots: { customRender: 'trayName' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      //打印机列表
      loadData: parameter => {
        return printerList(Object.assign(parameter, this.queryParam)).then(res => {
          // console.log(res)
          return res
        })
      }
    }
  },
  created() {
    this.product()
    this.showPrinter()
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  methods: {
    // 打印机详情
    printerDetail(record) {
      this.$router.push({ name: 'printerDetail', query: { id: record.machineId } })
    },
    // 打印机解绑
    unbind(id) {
      const params = {
        machine_id: id,
        bind_state: 0
      }
      printerOther(params).then(res => {
        console.log(res)
        if (res.state == 1) {
          this.$notification.success({
            message: '解绑成功'
          })
          this.$refs.table.loadData(true)
        } else {
          this.$notification.error({
            message: '解绑失败'
          })
        }
      })
    },
    // 打印机显示字段
    showPrinter() {
      this.selFilter = []
      this.columns = []
      this.$http.post('/userField/find', { listId: 0 }).then(res => {
        if (res.state == 1) {
          this.showFilter = JSON.parse(res.data.fieldJson)
          for (let i = 0; i < this.defaultColumns.length; i++) {
            for (let j = 0; j < this.showFilter.length; j++) {
              if (this.showFilter[j].checked) {
                if (this.defaultColumns[i].dataIndex == this.showFilter[j].name) {
                  this.defaultValue.push(this.showFilter[j].label)
                  this.selFilter.push(this.showFilter[j])
                  this.columns.push(this.defaultColumns[i])
                  break
                }
              }
            }
          }
          this.columns.push(this.defaultColumns[this.defaultColumns.length - 1])
        }
      })
    },
    //模态框相关操作
    //显示模态框
    showModal() {
      this.visible = true
    },
    //控制显示字段
    isShowFilter(checkedValues) {
      this.selFilter = []
      checkedValues.forEach((ele, index) => {
        this.showFilter.forEach(item => {
          ele == item.label ? this.selFilter.push(item) : ''
        })
      })
    },
    //保存显示的字段
    saveFilter() {
      if (this.selFilter.length > 6) {
        this.exceedFilter = true
        return false
      }
      this.showFilter.forEach(item => {
        let isChecked = false
        this.selFilter.forEach(ele => {
          if (item.name == ele.name) {
            isChecked = true
          }
        })
        isChecked ? (item.checked = true) : (item.checked = false)
      })
      let param = {
        listId: 0,
        fieldJson: JSON.stringify(this.showFilter)
      }
      this.$http.post('/userField/edit', param).then(res => {
        res.state == 1 ? this.showPrinter() : ''
      })
      this.visible = false
    },
    //产区列表
    product() {
      this.$http.post('/factoryRegion/list', { params: {} }).then(res => {
        if (res.state == 1) {
          if (res.state == 1) {
            this.productArray = res.data
          }
        }
      })
    },
    // 筛选
    productChange() {
      this.current = 1
      this.$refs.table.loadData()
    },
    filter(n) {
      this.current = 1
      if (n != 1) {
        this.queryParam = {}
      }
      this.$refs.table.loadData()
    },
    //分页
    tablePage(pagination) {
      this.pagination = pagination
      this.loadData()
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  }
}
</script>
<style lang="less" scoped>
.operation {
  background: #1e1e2a;
  padding: 24px 32px 0;
  .title {
    line-height: 30px;
    width: 100px;
    text-align: right;
  }
  .item {
    display: flex;
    padding-right: 35px;
    .select {
      flex: 1;
    }
  }
  .printer-name {
    height: 30px;
    flex: 1;
  }
  .setting {
    font-size: 25px;
    float: right;
    cursor: pointer;
  }
}
.tag_style {
  border-radius: 0;
  width: 50px;
  text-align: center;
}
.state {
  width: 20px;
  height: 20px;
  border: 1px solid #3b3b4d;
  border-radius: 5px;
  display: inline-block;
  vertical-align: initial;
  text-align: center;
  line-height: 17px;
  margin-right: 5px;
}
// 模态框样式
.model {
  .left {
    width: 75%;
    float: left;
    border-right: 1px solid #fff;
  }
  .label {
    width: 75%;
    margin-left: 0;
    margin-bottom: 24px;
    display: inline-block;
  }
  .right {
    width: 25%;
    float: left;
    padding-left: 20px;
    .label {
      display: inline-block;
      width: 100%;
    }
  }
  .tip {
    margin-bottom: 24px;
    color: #ff1531;
    display: block;
  }
}
.m-r-15 {
  margin-right: 15px;
}
/deep/ .ant-checkbox-disabled + span {
  color: #fff;
}
/deep/ .ant-checkbox-group-item {
  width: 50%;
  margin-left: 0;
  margin-bottom: 24px;
  margin-right: 0;
}
/deep/ .ant-modal-close:focus,
.ant-modal-close:hover {
  color: #fff;
}
</style>
