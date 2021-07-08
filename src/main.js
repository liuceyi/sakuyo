import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js'
import installElementPlus from './plugins/element'

import { Emit } from './emit/emit.js'

import './assets/icon/iconfont.css'
// import p5 from './static/p5.min.js'

const app = createApp(App)
installElementPlus(app)
app.use(router).mount('#app')
app.config.globalProperties.Emit = Emit