const docRoute = {
    path: "/doc/detail",
    name: "docDetail",
    hidden: true,
    component: () => import("@/views/doc/detail.vue"),
    meta: { requiresAuth: false, show: false, title: "文档", icon: "" },
  };
export default docRoute;
