const systemRoute = {
    path: "/system",
    name: "system",
    component: () => import("@/layout/index.vue"),
    redirect: "/system/user",
    meta: {
      title: "系统中心",
      icon: "Setting",
    },
    children: [
      {
        path: "user",
        name: "user",
        component: () =>
          import(
            /* webpackChunkName: "user" */ "@/views/system/user/index.vue"
          ),
        meta: {
          title: "用户管理",
          icon: "User"
        },
      },
      {
        path: "menu",
        name: "menu",
        component: () =>
          import(
            /* webpackChunkName: "menu" */ "@/views/system/menu/index.vue"
          ),
        meta: {
          title: "用户管理",
          icon: "Menu"
        },
      }
    ],
  }

  export default systemRoute