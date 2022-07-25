import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/theme-chalk/dark/css-vars.css";

import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.use(ElementPlus, { locale: zhCn });

app.mount("#app");
