import {
  axios
} from '@/utils/request'

const api = {
  add: '/depart/add',
  edit: '/depart/edit',
  del: '/depart/del',
  page: '/depart/page'
}

export function departAdd(parameter) {
  return axios({
    url: api.add,
    method: 'post',
    data: parameter
  })
}

export function departEdit(parameter) {
  return axios({
    url: api.edit,
    method: 'post',
    data: parameter
  })
}

export function departDel(parameter) {
  return axios({
    url: api.del,
    method: 'post',
    data: parameter
  })
}

export function departPage(parameter) {
  return axios({
    url: "/depart/page",
    method: 'post',
    data: parameter
  })
}

export function departAll(parameter) {
  return axios({
    url: "/depart/all",
    method: 'post',
    data: parameter
  })
}
