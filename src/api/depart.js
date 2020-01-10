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
    params: parameter
  })
}

export function departEdit(parameter) {
  return axios({
    url: api.edit,
    method: 'post',
    params: parameter
  })
}

export function departDel(parameter) {
  return axios({
    url: api.del,
    method: 'post',
    params: parameter
  })
}

export function departPage(parameter) {
  return axios({
    url: api.page,
    method: 'post',
    params: parameter
  })
}
