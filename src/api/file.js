import {
  axios
} from '@/utils/request'
// import qs from 'qs'
/* eslint-disable */
/*
 *@description: feedback+request页面接口
 *@author: CoraLiu
 *@date: 2019-12-23 13:47
 *@version: V1.0.5
 */

/* 
 // file相关页面
*/
// 上传文件filePrivate/upload
export function getMyFileUpload(parameter) {
  return axios({
    url: 'filePrivate/upload',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
/* 
    我的文件filePrivate
*/
// 我的文件列表filePrivate/page
export function getMyFileList(parameter) {
  return axios({
    url: 'filePrivate/page',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 我的文件详情filePrivate/find
export function getMyFileDetail(parameter) {
  return axios({
    url: 'filePrivate/find',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 我的文件stl详情切片获取文件路径/filePrivate/url
export function getMyFileDetailUrl(parameter) {
  return axios({
    url: 'filePrivate/url',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 我的文件删除filePrivate/delete
export function getMyFileDelete(parameter) {
  return axios({
    url: 'filePrivate/delete',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 我的文件下载filePrivate/download
export function getMyFileDownload(parameter) {
  return axios({
    url: 'filePrivate/download',
    method: 'get',
    params: parameter,
  })
}

// 转为公海文件filePrivate/intoPublic
export function getMyFileIntoPublic(parameter) {
  return axios({
    url: 'filePrivate/intoPublic',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// gcode文件获取filePrivate/getUrl
export function getMyFileGetUrl(parameter) {
  return axios({
    url: 'filePrivate/getUrl',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 编辑gcode文件filePrivate/editGcode
export function getMyFileEditGcode(parameter) {
  return axios({
    url: 'filePrivate/editGcode',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/* 
    公海文件filePublic

*/
// 公海文件列表filePublic/page
export function getFilePublicList(parameter) {
  return axios({
    url: 'filePublic/page',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 公海文件详情filePublic/find
export function getFilePublicDetail(parameter) {
  return axios({
    url: 'filePublic/find',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 公海文件下载filePublic/download
export function getFilePublicDownload(parameter) {
  return axios({
    url: 'filePublic/download',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 转为私人文件filePublic/intoPrivate
export function getFilePublicIntoPrivate(parameter) {
  return axios({
    url: 'filePublic/intoPrivate',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/* 
    我的切片模版
*/
// 模版文件列表fileBin/page
export function getSliceFileList(parameter) {
  return axios({
    url: 'fileBin/page',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 模版文件上传fileBin/upload
export function getSliceFileUpload(parameter) {
  return axios({
    url: 'fileBin/upload',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 模版文件删除fileBin/delete
export function getSliceFileDelete(parameter) {
  return axios({
    url: 'fileBin/delete',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/* 
    生产项目模块
*/
// 项目列表project/page
export function getProjectList(parameter) {
  return axios({
    url: 'project/page',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 项目删除project/delete
export function getProjectDelete(parameter) {
  return axios({
    url: 'project/delete',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 项目新增project/save
export function getProjectSave(parameter) {
  return axios({
    url: 'project/save',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 文件夹列表projectDir/page
export function getProjectDirList(parameter) {
  return axios({
    url: 'projectDir/page',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 文件夹删除projectDir/delete
export function getProjectDirDelete(parameter) {
  return axios({
    url: 'projectDir/delete',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 文件夹新增projectDir/save
export function getProjectDirSave(parameter) {
  return axios({
    url: 'projectDir/save',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 文件夹文件列表projectDir/getFiles
export function getProjectDirFiles(parameter) {
  return axios({
    url: 'projectDir/getFiles',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 文件夹新增projectDir/deleteFile
export function getProjectDirfileDelete(parameter) {
  return axios({
    url: 'projectDir/deleteFile',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 添加成套projectDirSet/save
export function getProjectDirSetSave(parameter) {
  return axios({
    url: 'projectDirSet/save',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 成套列表projectDirSet/list
export function getProjectDirSetList(parameter) {
  return axios({
    url: 'projectDirSet/list',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 添加成套文件projectDirSet/saveFile
export function getProjectDirSetSaveFile(parameter) {
  return axios({
    url: 'projectDirSet/saveFile',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 修改成套文件数量projectDirSet/editFile
export function getProjectDirSetEdit(parameter) {
  return axios({
    url: 'projectDirSet/editFile',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 删除成套文件projectDirSet/delete
export function getProjectDirSetDelete(parameter) {
  return axios({
    url: 'projectDirSet/delete',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/* 
  文件审批模块List
*/

// 文件审批列表approval/page
export function getApprovalList(parameter) {
  return axios({
    url: 'approval/page',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 文件审批详情approval/find
export function getApprovalDetail(parameter) {
  return axios({
    url: 'approval/find',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 文件审批approval/check
export function getApprovalCheck(parameter) {
  return axios({
    url: 'approval/check',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//发起审批
export function getApprovalSave(parameter) {
  return axios({
    url: 'approval/save',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 上传图片
export function getApprovalUploadImg(parameter) {
  return axios({
    url: '/approval/uploadImg',
    method: 'post',
    data: parameter,
  })
}