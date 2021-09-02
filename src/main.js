import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/index.less'
import './element-ui/index.js'
import { ElementTiptapPlugin } from 'element-tiptap'
// import ElementUI's styles
import 'element-ui/lib/theme-chalk/index.css'
// import this package's styles
import 'element-tiptap/lib/index.css'

Vue.config.productionTip = false

Vue.use(ElementTiptapPlugin, {
  lang: 'zh'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
