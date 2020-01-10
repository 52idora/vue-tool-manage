import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const deliverList = {
  state: {
    list:[]
  },

  mutations: {
    SET_LIST: (state, data) => {
      state.list = data
    }
  },

  actions: {
    
  }
}

export default deliverList
