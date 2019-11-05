import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import infiniteScroll from 'vue-infinite-scroll'
import StarRating from 'vue-dynamic-star-rating'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GAuth from 'vue-google-oauth2'

const gauthOption = {
  clientId: '677206663963-5i6kf5v2s8f2i3tlle9r0hq0sppnuprf.apps.googleusercontent.com',
  fetch_basic_profile: true,
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

library.add(faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('star-rating', StarRating);

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
