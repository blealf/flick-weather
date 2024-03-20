import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import router from './router';
import './style.css';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(LoadingPlugin);
app.mount('#app');
