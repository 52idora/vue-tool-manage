// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import {
  VueAxios
} from './utils/request'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './utils/filter' // global filter
import './components/global.less'
/* import {
  codemirror
} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodemirror) */
import {
  VueCodemirror
} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios, VueCodemirror)

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')