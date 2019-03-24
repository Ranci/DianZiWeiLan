import 'babel-polyfill'
import 'es6-promise/auto'
import Vue from 'vue'
import router from './router'
import Icon from 'vue-awesome'
import axios from 'axios'
import ElementUI from 'element-ui'
import BaiduMap from 'vue-baidu-map'
// import BMap from 'BMap'
// import BMapLib from 'BMapLib'
// import 'element-ui/lib/theme-chalk/index.css'    // 默认主题
import '../static/css/element-#5CC1C0/index.css'     // 主题
import App from './App.vue'
// 导入假数据
// import mock from './mock'
// mock.bootstrap()
import directive from 'element-ui/packages/popover/src/directive'
Vue.directive('popover', directive)

Vue.use(ElementUI)
Vue.use(Icon)
// Vue.use(BMap)
// Vue.use(BMapLib)
Vue.use(BaiduMap, {
  ak: 'LFGEWzFyfGuXWOC0eWshWLFkDdgFLrqd'  //  这个地方是官方提供的ak密钥
})
Vue.prototype.$axios = axios
new Vue({
  router,
  // router: router,
  render: h => h(App)
}).$mount('#app')
