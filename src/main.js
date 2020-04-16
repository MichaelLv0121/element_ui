import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//全局样式表
import './assets/css/global.css'

//导入axios并配置基准地址
import Axios from "axios";
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http = Axios;

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
