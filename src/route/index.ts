import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        hidden: true,
        meta: { requiresAuth: false, show: false, title: '登录页面' },
    },
    {
        path: '/home',
        name: 'home',
        redirect: '/home/index',
        component: () => import('@/layout/index.vue'),
        meta: {
            requiresAuth: false,
            show: true,
            title: '首页',
            icon: 'home',
        },
        children: [
            {
                path: 'index',
                name: 'homeIndex',
                meta: {
                    requiresAuth: false,
                    show: true,
                    title: '首页',
                    icon: 'home',
                },
                component: () => import('@/views/home/index.vue'),
            }
        ],
    },
    {
        path: '/note',
        name: 'note',
        redirect: '/note/index',
        component: () => import('@/layout/index.vue'),
        meta: {
            requiresAuth: false,
            show: true,
            title: '笔记',
            icon: 'note',
        },
        children: [
            {
                path: 'index',
                name: 'noteIndex',
                meta: {
                    requiresAuth: false,
                    show: true,
                    title: '笔记',
                    icon: 'note',
                },
                component: () => import('@/views/note/index.vue'),
            }
        ],
    },
    {
        path: '/ai',
        name: 'ai',
        redirect: '/ai/index',
        component: () => import('@/layout/index.vue'),
        meta: {
            requiresAuth: false,
            show: true,
            title: 'AI',
            icon: 'ai',
        },
        children: [
            {
                path: 'index',
                name: 'aiIndex',
                meta: {
                    requiresAuth: false,
                    show: true,
                    title: 'AI',
                    icon: 'ai',
                },
                component: () => import('@/views/ai/index.vue'),
            }
        ],
    },
    {
        path: '/tool',
        name: 'tool',
        redirect: '/tool/index',
        component: () => import('@/layout/index.vue'),
        meta: {
            requiresAuth: false,
            show: true,
            title: '工具',
            icon: 'tool',
        },
        children: [
            {
                path: 'index',
                name: 'toolIndex',
                meta: {
                    requiresAuth: false,
                    show: true,
                    title: '工具',
                    icon: 'tool',
                },
                component: () => import('@/views/tool/index.vue'),
            }
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 配置前置后置路由导航守卫
router.beforeEach(async (to, from, next) => {
    // 判断是否已经登录，是的话，就直接到主页，否则还是登录页
    // console.log('to, from ,next', to, from, next)
    const userToken = getToken().accessToken
    // localStorage.getItem('userToken')
    //     ? localStorage.getItem('userToken')
    //     : ''
    console.log(userToken, 'userTokenuserTokenuserTokenuserTokenuserTokenuserTokenuserTokenuserToken')
    if (to.path === '/') {
        if (userToken) {
            // 存在token,就跳转到主页：记住上次的菜单和路由
            // localStorage.removeItem("menuIndex")
            localStorage.getItem("menuRoute") ? next(localStorage.getItem("menuRoute")!) : next('/hone/index')
        } else {
            //否则就继续
            next()
        }
    } else {
        // 不存在token，就跳转到登录页
        if (userToken) {
            // 存在token,就跳转到主页
            next()
        } else {
            //否则就继续
            next('/')
        }
    }
})

export default router
export { routes }
