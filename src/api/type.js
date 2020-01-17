import {
  axios
} from '@/utils/request'

const api = {
  add: '/type/add',
  edit: '/type/edit',
  del: '/type/del',
  page: '/type/page',
  all: '/type/all',
}

export function typeAdd(parameter) {
  return axios({
    url: api.add,
    method: 'post',
    data: parameter
  })
}

export function typeEdit(parameter) {
  return axios({
    url: api.edit,
    method: 'post',
    data: parameter
  })
}

export function typeDel(parameter) {
  return axios({
    url: api.del,
    method: 'post',
    data: parameter
  })
}

export function typePage(parameter) {
  return axios({
    url: api.page,
    method: 'post',
    data: parameter
  })
}

export function typeAll(parameter) {
  return axios({
    url: api.all,
    method: 'post',
    data: parameter
  })
}
