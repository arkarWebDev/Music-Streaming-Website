import { auth } from "./includes/firebase";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VeeValidatePlugin from "./includes/validate";
import timeago from "vue-timeago3";
import i18n from "./includes/i18n";

import "./includes/firebase";
import "./assets/base.css";
import "./assets/main.css";

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(timeago);
    app.use(i18n);
    app.mount("#app");
  }
});
