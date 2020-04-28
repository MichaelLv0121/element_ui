import Vue from 'vue'
import VueRouter from 'vue-router'

//将 vue-router改造为路由懒加载模式

// import Login from "../components/Login";
// import Home from "../components/Home";
// import Welcome from "../components/Welcome";
const Login = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/Welcome')

// import Users from "../components/user/Users";
const Users = () => import(/* webpackChunkName: "Users" */ '../components/user/Users')

// import Rights from "../components/authority/Rights";
// import Roles from "../components/authority/Roles";
const Rights = () => import(/* webpackChunkName: "Rights-Roles" */ '../components/authority/Rights')
const Roles = () => import(/* webpackChunkName: "Rights-Roles" */ '../components/authority/Roles')

// import Cate from "../components/goods/Cate";
// import Params from "../components/goods/Params";
// import List from "../components/goods/List";
// import Add from "../components/goods/Add";
const Cate = () => import(/* webpackChunkName: "Cate-Params-List-Add" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate-Params-List-Add" */ '../components/goods/Params')
const List = () => import(/* webpackChunkName: "Cate-Params-List-Add" */ '../components/goods/List')
const Add = () => import(/* webpackChunkName: "Cate-Params-List-Add" */ '../components/goods/Add')

// import Order from "../components/order/Order";
const Order = () => import(/* webpackChunkName: "Order" */ '../components/order/Order')

// import Report from "../components/report/Report";
const Report = () => import(/* webpackChunkName: "Report" */ '../components/report/Report')

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            {path: '/welcome', component: Welcome},
            {path: '/users', component: Users},
            {path: '/rights', component: Rights},
            {path: '/roles', component: Roles},
            {path: '/categories', component: Cate},
            {path: '/params', component: Params},
            {path: '/goods', component: List},
            {path: '/goods/add', component: Add},
            {path: '/orders', component: Order},
            {path: '/reports', component: Report},
        ]
    },
]

const router = new VueRouter({
    routes
})

//为路由对象，挂载 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
    //to 表示将要访问的路径
    //from 表示从哪个路径跳转而来
    //next 是一个函数，表示放行，有两种形式
    // 1.next() 表示直接放行
    // 2.next('/login') 表示强制跳转到/login路由

    if (to.path === '/login') return next();

    const token = window.sessionStorage.getItem('token');
    //没有携带token，强制回到login界面
    if (!token) return next('/login');
    next();
})


export default router
