import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js'
import axios from 'axios'
import cookie from './js/cookie.js'
import qs from 'qs'
import installElementPlus from './plugins/element'

import './assets/icon/iconfont.css'

const app = createApp(App);
installElementPlus(app);
app.use(router).mount('#app');
 

app.config.globalProperties.api = '';
app.config.globalProperties.axios = axios;
app.config.globalProperties.qs = qs;
app.config.globalProperties.cookie = cookie;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/backend/api/api.php';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';