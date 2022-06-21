import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/tailwind.css";
import axios from "axios";
import VueAxios from "vue-axios";

axios.defaults.baseURL = `${process.env.VUE_APP_API_HOST}/api/price-engine`;

const app = createApp(App);
app.use(VueAxios, axios);
app.mount("#app");
