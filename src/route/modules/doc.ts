const docRoute = [{
  path: "/doc/add",
  name: "docAdd",
  hidden: true,
  component: () => import("@/views/doc/create.vue"),
  meta: { requiresAuth: false, show: false, title: "文档", icon: "" },
}, {
  path: "/doc/detail",
  name: "docDetail",
  hidden: true,
  component: () => import("@/views/doc/detail.vue"),
  meta: { requiresAuth: false, show: false, title: "文档", icon: "" },
}];
export default docRoute;
