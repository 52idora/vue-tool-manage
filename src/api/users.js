import {
  axios
} from '@/utils/request'

const api = {
  add: '/users/add',
  edit: '/users/edit',
  del: '/users/del',
  page: '/users/page',
  listByDepart: '/users/listByDepart',
}

export function usersAdd(parameter) {
  return axios({
    url: api.add,
    method: 'post',
    data: parameter
  })
}

export function usersEdit(parameter) {
  return axios({
    url: api.edit,
    method: 'post',
    data: parameter
  })
}

export function usersDel(parameter) {
  return axios({
    url: api.del,
    method: 'post',
    data: parameter
  })
}

export function usersPage(parameter) {
  return axios({
    url: api.page,
    method: 'post',
    data: parameter
  })
}

export function usersByDepart(parameter) {
  return axios({
    url: api.listByDepart,
    method: 'post',
    data: parameter
  })
}
