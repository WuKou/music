import 'babel-polyfill'
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import fastclick from 'fastclick'
import router from './router'
import store from './store'

import 'common/stylus/index.styl'

Vue.config.productionTip = false // 阻止显示生产模式的消息
fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('common/image/default.png') // require 可以保证线上打包后路径也是正确的
})

new Vue({
  el: '#app',
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
