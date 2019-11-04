import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import infiniteScroll from 'vue-infinite-scroll'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from './store'

Vue.use(BootstrapVue)
Vue.use(infiniteScroll)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
