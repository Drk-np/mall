import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/index'
import toast from  './components/common/toast'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

Vue.use(toast)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
