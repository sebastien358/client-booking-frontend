import "../src/assets/scss/index.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();

import App from "./App.vue";
import router from "./router";
pinia.use(piniaPluginPersistedstate);

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import icons and add them to the Library */
import {
  faUserSecret,
  faBars,
  faAngleDown,
  faPhone,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

library.add(
  faUserSecret,
  faBars,
  faFacebook,
  faInstagram,
  faAngleDown,
  faInstagram,
  faTwitter,
  faPhone,
  faUser,
  faXmark
);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(pinia);
app.use(router);

app.mount("#app");
