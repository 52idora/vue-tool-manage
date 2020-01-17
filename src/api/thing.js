import {
  axios
} from '@/utils/request'

const api = {
  add: '/thing/add',
  edit: '/thing/edit',
  del: '/thing/del',
  page: '/thing/page',
  borrow: '/thing/borrow',
  sendback: '/thing/sendback',
  stastic: '/thing/stastic',
}

export function thingAdd(parameter) {
  return axios({
    url: api.add,
    method: 'post',
    data: parameter
  })
}

export function thingEdit(parameter) {
  return axios({
    url: api.edit,
    method: 'post',
    data: parameter
  })
}

export function thingDel(parameter) {
  return axios({
    url: api.del,
    method: 'post',
    data: parameter
  })
}

export function thingPage(parameter) {
  return axios({
    url: "/thing/page",
    method: 'post',
    data: parameter
  })
}

export function thingBorrow(parameter) {
  return axios({
    url: "/thing/borrow",
    method: 'post',
    data: parameter
  })
}

export function thingSendback(parameter) {
  return axios({
    url: "/thing/sendback",
    method: 'post',
    data: parameter
  })
}

export function stastic(parameter) {
  return axios({
    url: "/thing/stastic",
    method: 'post',
    data: parameter
  })
}
