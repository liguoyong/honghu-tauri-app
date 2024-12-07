import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "@/utils/auth";
import { useUserStore } from "@/stores/user";
import docRoute from "./modules/doc";
// const userStore = useUserStore()
const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    hidden: true,
    meta: { requiresAuth: false, show: false, title: "登录页面" },
  },
  {
    path: "/todo",
    name: "todo",
    hidden: true,
    component: () => import("@/views/todo/index.vue"),
    meta: { requiresAuth: false, show: false, title: "待办", icon: "Management" },
  },
  {
    path: "/home",
    name: "home",
    redirect: "/home/index",
    component: () => import("@/layout/index.vue"),
    meta: {
      requiresAuth: false,
      show: true,
      title: "首页",
      icon: "HomeFilled",
    },
    children: [
      {
        path: "index",
        name: "homeIndex",
        meta: {
          requiresAuth: false,
          show: true,
          title: "首页",
          icon: "home",
        },
        component: () => import("@/views/home/index.vue"),
      },
    ],
  },
  {
    path: "/life",
    name: "noteCloud",
    component: () => import("@/layout/index.vue"),
    redirect: { name: "lifePlan" },
    meta: {
      title: "生活中心",
      icon: "GoodsFilled",
    },
    children: [
      {
        path: "bill",
        name: "lifeBill",
        component: () =>
          import(
            /* webpackChunkName: "lifeBill" */ "@/views/life/bill/index.vue"
          ),
        meta: {
          title: "账单管理",
          activeMenu: '/life/bill',
          icon: 'Money'
        },
      },
      {
        path: "billAnalysis",
        name: "lifeBillAnalysis",
        component: () =>
          import(
            /* webpackChunkName: "billAnalysis" */ "@/views/life/billAnalysis/index.vue"
          ),
        meta: {
          title: "账单分析",
          activeMenu: '/life/billAnalysis',
          icon: 'TrendCharts'
        },
      },
      {
        path: "gold",
        name: "goldPage",
        component: () =>
          import(
            /* webpackChunkName: "goldPage" */ "@/views/life/gold/index.vue"
          ),
        meta: {
          title: "金价分析",
          activeMenu: '/life/gold',
          svg: 'gold'
        },
      },
    ],
  },
  {
    path: "/work",
    name: "work",
    redirect: "/work/index",
    component: () => import("@/layout/index.vue"),
    meta: {
      requiresAuth: false,
      show: true,
      title: "办公中心",
      icon: "SuitcaseLine"
    },
    children: [
      {
        path: "todo",
        name: "workTodo",
        component: () =>
          import(
            /* webpackChunkName: "workTodo" */ "@/views/work/todo/index.vue"
          ),
        meta: {
          title: "待办事项",
          activeMenu: '/work/todo',
          icon: "Flag"
        },
      },
      {
        path: "index",
        name: "noteIndex",
        meta: {
          requiresAuth: false,
          show: true,
          title: "笔记管理",
          activeMenu: '/work/index',
          icon: "EditPen"
        },
        component: () => import("@/views/note/index.vue"),
      },
      {
        path: "doc",
        name: "docIndex",
        meta: {
          requiresAuth: false,
          show: true,
          title: "文档管理",
          activeMenu: '/work/doc',
          icon: "Document"
        },
        component: () => import("@/views/doc/index.vue"),
      },
      {
        path: "doc/create",
        name: "docCreate",
        hidden: true,
        meta: {
          requiresAuth: false,
          show: true,
          title: "新增文档",
          activeMenu: '/work/doc',
          icon: "Document"
        },
        component: () => import("@/views/doc/create.vue"),
      },
      {
        path: "doc/edit",
        name: "docEdit",
        hidden: true,
        meta: {
          requiresAuth: false,
          show: true,
          title: "编辑文档",
          activeMenu: '/work/doc',
          icon: "Document"
        },
        component: () => import("@/views/doc/create.vue"),
      }
    ],
  },
  {
    path: "/operational",
    name: "operational",
    component: () => import("@/layout/index.vue"),
    redirect: { name: "tool" },
    meta: {
      title: "工具中心",
      icon: "Tools",
    },
    children: [
      {
        path: "tool",
        name: "tool",
        component: () =>
          import(
            /* webpackChunkName: "operational" */ "../views/Tool/index.vue"
          ),
        meta: {
          title: "工具专区",
          icon: "Opportunity"
        },
      },
      {
        path: "tool/json",
        name: "toolJSON",
        hidden: true,
        component: () =>
          import(
            /* webpackChunkName: "toolJSON" */ "../views/Tool/components/json.vue"
          ),
        meta: {
          title: "工具中心-json",
          activeMenu: '/operational/tool'
        },
      },
      {
        path: "tool/svg",
        name: "toolSvgPreview",
        hidden: true,
        component: () =>
          import(
            /* webpackChunkName: "SvgPreviewJSON" */ "../views/Tool/components/SvgPreview.vue"
          ),
        meta: {
          title: "svg预览",
          activeMenu: '/operational/tool'
        },
      },
      {
        path: "tool/shell",
        name: "toolShell",
        hidden: true,
        component: () =>
          import(
            /* webpackChunkName: "toolShell" */ "../views/Tool/components/shell.vue"
          ),
        meta: {
          title: "shell",
          activeMenu: '/operational/tool'
        },
      },
      {
        path: "tool/flow",
        name: "toolFlow",
        hidden: true,
        component: () =>
          import(
            /* webpackChunkName: "toolFlow" */ "../views/Tool/flow/index.vue"
          ),
        meta: {
          title: "flow",
          activeMenu: '/operational/tool'
        },
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    redirect: "/user/index",
    hidden: true,
    component: () => import("@/layout/index.vue"),
    meta: {
      requiresAuth: false,
      show: true,
      title: "用户资料",
      icon: "user",
    },
    children: [
      {
        path: "index",
        name: "userInformation",
        meta: {
          requiresAuth: false,
          show: true,
          title: "用户资料",
          icon: "user",
        },
        component: () => import("@/views/user/information/index.vue"),
      },
    ],
  },
  docRoute
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const whriteList = ["/todo"];

// 配置前置后置路由导航守卫
router.beforeEach(async (to, from, next) => {
  // 判断是否已经登录，是的话，就直接到主页，否则还是登录页
  const userToken = getToken().accessToken;
  const userStore = useUserStore();
  if (whriteList.includes(to.path)) {
    next();
  } else if (!userToken && to.path === "/") {
    console.log(111);
    // 未登录
    next();
  } else if (userToken && to.path === "/") {
    console.log(222);
    try {
      await userStore.GET_USER_INFO();
      localStorage.getItem("menuRoute")
      ? next(localStorage.getItem("menuRoute")!)
      : next("/home");
    } catch (error) {
      next("/")
    }
    
  } else if (!userToken) {
    console.log(3333);
    next({ path: "/" });
  } else {
    if (!userStore.userId) {
      await userStore.GET_USER_INFO();
    }
    console.log(444);
    next();
  }
});

export default router;
export { routes };
