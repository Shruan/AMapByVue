// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import http from './utils/request'
import 'iview/dist/styles/iview.css'

Vue.use(iView)

Vue.config.productionTip = false

Vue.prototype.$http = http
Vue.prototype.$qs = require('querystring').stringify
Vue.prototype.$header = {
  'Content-Type': 'application/json;charset=utf-8'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
