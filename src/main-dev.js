import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//全局样式表
import './assets/css/global.css'
//导入树形结构table
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本组件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//导入 nprogress 的js和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//导入axios
import Axios from "axios";
//配置基准地址
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

//通过axios请求拦截器添加token，保证拥有获取数据的权限，当获取token的时候，每次发起需要授权的API请求时，请求头都会携带Authorization:token的参数
//在 request 拦截器中显示 nprogress 进度条 NProgress.start();
Axios.interceptors.request.use(config => {
    NProgress.start();
    //为请求头手动添加一个自定义的对象`Authorization`，并将config对象返回
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
});

//在 response 拦截器中隐藏 nprogress 进度条 NProgress.done();
Axios.interceptors.response.use(config => {
    NProgress.done();
    return config;
});


Vue.prototype.$http = Axios;
Vue.config.productionTip = false;

//将树形结构table注册为全局组件
Vue.component('tree-table', TreeTable);
//将富文本组件注册为全局组件
Vue.use(VueQuillEditor);

//将时间戳转为固定格式
Vue.filter('dateFormat', (originVal) => {
    const newDate = new Date(originVal);

    const y = newDate.getFullYear();
    const m = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');

    const hh = String(newDate.getHours()).padStart(2, '0');
    const mm = String(newDate.getMinutes()).padStart(2, '0');
    const ss = String(newDate.getSeconds()).padStart(2, '0');

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
