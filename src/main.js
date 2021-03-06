import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from './store'
// 设置rem基准值
import 'amfe-flexible'
// 引入Vant
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'
// 引入自己定义的css
import '@/styles/index.less'

import plugin from '@/utils/plugin'

Vue.use(plugin)
Vue.use(Vant)
Vue.use(Lazyload)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
