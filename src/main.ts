import { createApp } from "vue";
import App from "./App.vue";
import router from "./route";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./styles.css";
import "@/assets/iconfont/iconfont.css";
import "@/assets/iconfont/iconfont.js";
import { createPinia } from "pinia";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/theme-chalk/dark/css-vars.css"; //这句是暗黑模式切换
import "@/style/element/dark/css-vars.css";
import "@/style/theme.css";
import "@/style/index.scss";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import i18n from "./lang/index";
import "virtual:svg-icons-register";
import "virtual:uno.css";
import dayjs from 'dayjs';
// import '@/icons' // icon
import globalComponent from "@/components/index";
// import Windows from "./hooks/windows/index.js";
const app = createApp(App);
app
  .use(createPinia())
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(i18n);
app.use(globalComponent);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.config.globalProperties.$dayjs = dayjs;
app.mount("#app");
const screenWidth = window.screen.width;
const x = screenWidth - 100 - 520;
// const { createWin } = new Windows();

// createWin({
//   label: "todo",
//   title: "待办",
//   url: "/todo",
//   width: 520,
//   height: 310,
//   minWidth: 300,
//   minHeight: 200,
//   x: x,
//   y: 100,
//   center: false,
//   resizable: false,
// });
