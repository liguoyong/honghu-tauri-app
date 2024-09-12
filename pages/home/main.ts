// 2. 引入组件样式
import 'vant/lib/index.css';
import { createApp } from 'vue';
import vant from 'vant';
import App from "./App.vue";
const app = createApp(App);
app.use(vant);
app.mount("#app");