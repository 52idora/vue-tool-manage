import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import {
  VueAxios
} from './axios'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 120000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})
service.defaults.headers.common['myauth'] = "Bearer "

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '您没有此操作的权限'
      })
    }
     if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      const token = Vue.ls.get(ACCESS_TOKEN);
      if(!token){return;}
      localStorage.clear();
      notification.warning({
        message: '登录已过期，请重新登陆！',
        description: ''
      })
      setTimeout(() => {
        let url = window.location.href;
        let upUrl = url.replace(url.substring(url.indexOf("#")), "#/user/login");
        window.location.href = upUrl;
        window.location.reload();
      }, 1500);
    } 
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = "Bearer "+Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}