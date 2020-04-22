import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";
import Rights from "../components/authority/Rights";
import Roles from "../components/authority/Roles";

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
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            },
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
