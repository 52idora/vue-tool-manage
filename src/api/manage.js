import {
  axios
} from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function getUserList(parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree(parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

//物料模块
//材料列表
export function getFilamentList(parameter) {
  return axios({
    url: "filament/page",
    method: "post",
    data: parameter
  })
}
//材料新增
export function filamentAdd(parameter) {
  return axios({
    url: "filament/save",
    method: "post",
    data: parameter
  })
}
//材料新增
export function filamentEdit(parameter) {
  return axios({
    url: "filament/edit",
    method: "post",
    data: parameter
  })
}
//材料详情
export function filamentDetail(parameter) {
  return axios({
    url: "filament/find",
    method: "post",
    data: parameter
  })
}
//材料删除
export function filamentDelete(parameter) {
  return axios({
    url: "filament/delete",
    method: "post",
    data: parameter
  })
}
//库存列表
export function filamentStorePage(parameter) {
  return axios({
    url: "filamentStore/page",
    method: "post",
    data: parameter
  })
}
//库存入库
export function filamentStoreSave(parameter) {
  return axios({
    url: "filamentStore/save",
    method: "post",
    data: parameter
  })
}
//库存删除filamentStore/delete
export function filamentStoreDelete(parameter) {
  return axios({
    url: "filamentStore/delete",
    method: "post",
    data: parameter
  })
}

//库存沽清filamentStore/clear
export function filamentStoreClear(parameter) {
  return axios({
    url: "filamentStore/clear",
    method: "post",
    data: parameter
  })
}
//库存详情filamentStore/find
export function filamentStoreFind(parameter) {
  return axios({
    url: "filamentStore/find",
    method: "post",
    data: parameter
  })
}
//库存统计分布filamentStore/stastic
export function filamentStoreStastic(parameter) {
  return axios({
    url: "filamentStore/stastic",
    method: "post",
    data: parameter
  })
}
//库存料卷标签打印filamentStore/print
export function filamentStorePrint(parameter) {
  return axios({
    url: "filamentStore/print",
    method: "post",
    data: parameter
  })
}
//料卷分页filamentVolume/page
export function filamentVolumePage(parameter) {
  return axios({
    url: "filamentVolume/page",
    method: "post",
    data: parameter
  })
}
//料卷分页编辑filamentVolume/edit
export function filamentVolumeEdit(parameter) {
  return axios({
    url: "filamentVolume/edit",
    method: "post",
    data: parameter
  })
}
//料卷逻辑删除filamentVolume/delete
export function filamentVolumeDelete(parameter) {
  return axios({
    url: "filamentVolume/delete",
    method: "post",
    data: parameter
  })
}
// 料卷领取filamentVolume/apply
export function filamentVolumeApply(parameter) {
  return axios({
    url: "filamentVolume/apply",
    method: "post",
    data: parameter
  })
}
// 料卷扫码获取信息filamentVolume/getByNo
export function filamentVolumeGetNoList(parameter) {
  return axios({
    url: "filamentVolume/getByNo",
    method: "post",
    data: parameter
  })
}

// 料卷标签打印filamentVolume/print
export function filamentVolumePrint(parameter) {
  return axios({
    url: "filamentVolume/print",
    method: "post",
    data: parameter
  })
}
//订单模块
//订单列表
export function ordersPage(parameter) {
  return axios({
    url: "orders/page",
    method: "post",
    data: parameter
  })
}
//新增订单
export function ordersSave(parameter) {
  return axios({
    url: "orders/save",
    method: "post",
    data: parameter
  })
}
//编辑订单
export function ordersEdit(parameter) {
  return axios({
    url: "orders/edit",
    method: "post",
    data: parameter
  })
}
//修改订单状态
export function ordersChangeState(parameter) {
  return axios({
    url: "orders/changeState",
    method: "post",
    data: parameter
  })
}
//重新生产
export function ordersReproduced(parameter) {
  return axios({
    url: "orders/reproduced",
    method: "post",
    data: parameter
  })
}
//删除订单
export function ordersDelete(parameter) {
  return axios({
    url: "orders/delete",
    method: "post",
    data: parameter
  })
}
//订单详情
export function ordersFind(parameter) {
  return axios({
    url: "orders/find",
    method: "post",
    data: parameter
  })
}
//清单列表
export function inventoryPage(parameter) {
  return axios({
    url: "ordersInventory/page",
    method: "post",
    data: parameter
  })
}
//清单新增
export function inventorySave(parameter) {
  return axios({
    url: "ordersInventory/save",
    method: "post",
    data: parameter
  })
}
//清单编辑
export function inventoryEdit(parameter) {
  return axios({
    url: "ordersInventory/edit",
    method: "post",
    data: parameter
  })
}
//清单删除
export function inventoryDelete(parameter) {
  return axios({
    url: "ordersInventory/delete",
    method: "post",
    data: parameter
  })
}
//生产项目列表
export function projectGetProjects(parameter) {
  return axios({
    url: "project/getProjects",
    method: "get",
    data: parameter
  })
}
//文件夹列表
export function getProjectDirsList(parameter) {
  return axios({
    url: "projectDir/getProjectDirs",
    method: "post",
    data: parameter
  })
}
//文件列表
export function getFileApprovalsList(parameter) {
  return axios({
    url: "fileApproval/getFileApprovals",
    method: "post",
    data: parameter
  })
}
//配套列表
export function projectDirSetList(parameter) {
  return axios({
    url: "projectDirSet/getProjectDirSets",
    method: "post",
    data: parameter
  })
}
//配套文件列表
export function projectFiletList(parameter) {
  return axios({
    url: "fileApprovalSet/getFileApprovalSets",
    method: "post",
    data: parameter
  })
}
//交货单历史
export function deliveryHistory(parameter) {
  return axios({
    url: "ordersInventoryDelivery/getDeliveries",
    method: "post",
    data: parameter
  })
}
//批量交付
export function deliveryAdd(parameter) {
  return axios({
    url: "ordersInventoryDelivery/save",
    method: "post",
    data: parameter
  })
}
//清单详情
export function ordersInventoryFind(parameter) {
  return axios({
    url: "ordersInventory/find",
    method: "post",
    data: parameter
  })
}
//托盘试算
export function machineTrayTrialBalance(parameter) {
  return axios({
    url: "machineTray/trialBalance",
    method: "post",
    data: parameter
  })
}
//托盘生成
export function machineTraySave(parameter) {
  return axios({
    url: "machineTray/save",
    method: "post",
    data: parameter
  })
}
//托盘列表
export function machineTrayList(parameter) {
  return axios({
    url: "machineTray/getMachineTrays",
    method: "get",
    data: parameter
  })
}
//机器列表
export function machineMacList(parameter) {
  return axios({
    url: "machine/getMachines",
    method: "post",
    data: parameter
  })
}
//队列列表
export function machineQueuePage(parameter) {
  return axios({
    url: "machineQueue/page",
    method: "post",
    data: parameter
  })
}
//停止打印
export function machineQueueStopPrint(parameter) {
  return axios({
    url: "machineQueue/stopPrint",
    method: "post",
    data: parameter
  })
}
//挂起继续
export function machineQueueChangeState(parameter) {
  return axios({
    url: "machineQueue/changeState",
    method: "post",
    data: parameter
  })
}
//甘特图列表
export function getGanttCharts(parameter) {
  return axios({
    url: "machineQueue/getGanttCharts",
    method: "get",
    data: parameter
  })
}
//队列保存
export function machineGetMachines (parameter) {
  return axios({
    url: "machineQueue/saveOrUpdate",
    method: "post",
    data: parameter
  })
}