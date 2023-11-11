/// <reference types="vite/client" />
declare module "element-plus/dist/locale/zh-cn.mjs";
declare module 'js-cookie'
declare module 'qs'
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
