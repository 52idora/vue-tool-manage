import {
  axios
} from '@/utils/request'

// 打印机列表
export function printerList(parameter) {
  return axios({
    url: 'machine/page',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//打印机详情machine/find
export function printerDetail(parameter) {
  return axios({
    url: 'machine/find',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//打印机设置温度参数machine/settings
export function printerMachineSet(parameter) {
  return axios({
    url: 'machine/settings',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//设置打印机启动暂停停止、接受任务、led设置machine/switchs
export function printerMachineSwitch(parameter) {
  return axios({
    url: 'machine/switchs',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 打印机修改尺寸
export function printerEdit(parameter) {
  return axios({
    url: 'machine/edit',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 打印机解绑machine/others
export function printerOther(parameter) {
  return axios({
    url: 'machine/others',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 获取视频路径machine/getVideoInfo
export function printerGetVideoInfo(parameter) {
  return axios({
    url: 'machine/getVideoInfo',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//班次值排班
export function bankList(parameter) {
  return axios({
    url: 'dutyScheduling/getDutySchedulings',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 班次列表
export function defultBank(parameter) {
  return axios({
    url: 'dutyShift/page',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//删除值排班
export function delBank(parameter) {
  return axios({
    url: 'dutyScheduling/deleteScheduling',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//人员列表
export function personList(parameter) {
  return axios({
    url: 'user/page',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//新增班次
export function addBank(parameter) {
  return axios({
    url: 'dutyShift/save',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 新增值排班
export function addSchedule(parameter) {
  return axios({
    url: 'dutyScheduling/save',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 值排班修改
export function editSchedule(parameter) {
  return axios({
    url: 'dutyScheduling/saveOrUpdate',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//编辑班次
export function editBank(parameter) {
  return axios({
    url: 'dutyShift/edit',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//人员排班列表
export function personBank(parameter) {
  return axios({
    url: 'dutyUserScheduling/userShiftsPage',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 人员日历
export function personCandaler(parameter) {
  return axios({
    url: 'dutyUserScheduling/getUserShifts',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//人员编辑
export function personEdit(parameter) {
  return axios({
    url: 'dutyUserScheduling/saveOrUpdate',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//人员删除
export function personDel(parameter) {
  return axios({
    url: 'dutyUserScheduling/deleteUserShift',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//已启用的班次
export function hasBank(parameter) {
  return axios({
    url: 'dutyScheduling/getAllScheduling',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 删除班次
export function delBankList(parameter) {
  return axios({
    url: 'dutyShift/delete',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}