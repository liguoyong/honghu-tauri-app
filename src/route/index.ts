import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: { requiresAuth: false, show: false, title: '登陆页面' },
    },
    {
        path: '/index',
        name: 'index',
        redirect: '/index/files',
        component: () => import('@/layout/index.vue'),
        meta: {
            requiresAuth: false,
            show: true,
            title: '我的文件',
            icon: 'Files',
        },
        // 所有的分类全都是layout的子路由
        children: [
            // 上传文件嵌套进我的文件中，增加一个按钮
            {
                path: 'files',
                name: 'files',
                meta: {
                    requiresAuth: false,
                    show: true,
                    title: '我的资源',
                    icon: 'FolderOpened',
                },
                component: () => import('@/views/files/index.vue'),
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
    // 判断是否已经登陆，是的话，就直接到主页，否则还是登陆页
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
            localStorage.getItem("menuRoute") ? next(localStorage.getItem("menuRoute")!) : next('/index/files')
        } else {
            //否则就继续
            next()
        }
    } else {
        // 不存在token，就跳转到登陆页
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