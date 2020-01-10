/*
 *@description: feedback+request页面接口
 *@author: CoraLiu
 *@date: 2019-12-31 11:19
 *@version: V1.0.5
 */
import {
  axios
} from '@/utils/request'

//用户列表
export function getUserList(parameter) {
  return axios({
    url: 'user/page',
    method: 'post',
    data: parameter
  })
}
//用户添加
export function getUserSave(parameter) {
  return axios({
    url: 'user/save',
    method: 'post',
    data: parameter
  })
}
//用户修改
export function getUserEdit(parameter) {
  return axios({
    url: 'user/edit',
    method: 'post',
    data: parameter
  })
}
//用户删除
export function getUserDelete(parameter) {
  return axios({
    url: 'user/delete',
    method: 'post',
    data: parameter
  })
}
//角色列表
export function getRoleList(parameter) {
  return axios({
    url: 'userRole/getUserRoles',
    method: 'post',
    data: parameter
  })
}
//添加角色
export function userRoleSave(parameter) {
  return axios({
    url: 'userRole/save',
    method: 'post',
    data: parameter
  })
}
//修改角色
export function userRoleEdit(parameter) {
  return axios({
    url: 'userRole/edit',
    method: 'post',
    data: parameter
  })
}
//角色删除
export function userRoleDelete(parameter) {
  return axios({
    url: 'userRole/delete',
    method: 'post',
    data: parameter
  })
}
//获取角色权限列表
export function getRoleMenuList(parameter) {
  return axios({
    url: 'userMenu/roleMenuList',
    method: 'post',
    data: parameter
  })
}
//添加角色权限列表
export function getUserMenuSave(parameter) {
  return axios({
    url: 'userMenu/save',
    method: 'post',
    data: parameter
  })
}
//角色权限编辑
export function editRoleMenu(parameter) {
  return axios({
    url: 'userRole/editRoleMenu',
    method: 'post',
    data: parameter
  })
}