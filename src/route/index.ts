import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "@/utils/auth";
import { useUserStore } from "@/stores/user";
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
    meta: { requiresAuth: false, show: false, title: "待办" },
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
      icon: "home",
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
    path: "/note",
    name: "note",
    redirect: "/note/index",
    component: () => import("@/layout/index.vue"),
    meta: {
      requiresAuth: false,
      show: true,
      title: "笔记",
      icon: "note",
    },
    children: [
      {
        path: "index",
        name: "noteIndex",
        meta: {
          requiresAuth: false,
          show: true,
          title: "笔记",
          icon: "note",
        },
        component: () => import("@/views/note/index.vue"),
      },
    ],
  },
  {
    path: "/ai",
    name: "ai",
    redirect: "/ai/index",
    component: () => import("@/layout/index.vue"),
    meta: {
      requiresAuth: false,
      show: true,
      title: "AI",
      icon: "ai",
    },
    children: [
      {
        path: "index",
        name: "aiIndex",
        meta: {
          requiresAuth: false,
          show: true,
          title: "AI",
          icon: "ai",
        },
        component: () => import("@/views/ai/index.vue"),
      },
    ],
  },
  {
    path: "/tool",
    name: "tool",
    redirect: "/tool/index",
    component: () => import("@/layout/index.vue"),
    meta: {
      requiresAuth: false,
      show: true,
      title: "工具",
      icon: "tool",
    },
    children: [
      {
        path: "index",
        name: "toolIndex",
        meta: {
          requiresAuth: false,
          show: true,
          title: "工具",
          icon: "tool",
        },
        component: () => import("@/views/tool/index.vue"),
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const whriteList = ['/todo']

// 配置前置后置路由导航守卫
router.beforeEach(async (to, from, next) => {
  // 判断是否已经登录，是的话，就直接到主页，否则还是登录页
  const userToken = getToken().accessToken;
  const userStore = useUserStore();
  console.log(whriteList.includes(to.path), to.path);
  
  if(whriteList.includes(to.path)) {
    next();
  } else if (!userToken && to.path === "/") {
    // 未登录
    next();
  } else if (userToken && to.path === "/") {
    await userStore.GET_USER_INFO();
    localStorage.getItem("menuRoute")
      ? next(localStorage.getItem("menuRoute")!)
      : next("/home");
  } else if (!userToken) {
    next({ path: "/" });
  } else {
    if (!userStore.userId) {
      await userStore.GET_USER_INFO();
    }
    next();
  }
});

export default router;
export { routes };
