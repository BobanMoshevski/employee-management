import "./assets/main.css";
import "primeicons/primeicons.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import router from "./router";

import { createApp } from "vue";
import App from "./App.vue";

// Create Vue application instance
const app = createApp(App);

// Register Vue Router plugin
app.use(router);

// Register toast notification plugin
app.use(Toast);

// Mount application to DOM element with id="app"
app.mount("#app");
