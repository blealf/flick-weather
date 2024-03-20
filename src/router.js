import { createMemoryHistory, createRouter } from 'vue-router';
import { nextTick } from 'vue';
import Home from './components/HomeUI.vue';
import Cities from './components/CitiesList.vue';
import Settings from './components/AllSettings.vue';
import { appTitle } from './utils/helper';

const routes = [
  {
    path: '/', component: Home, meta: { title: 'Home' }, name: 'Home',
  },
  { path: '/cities', component: Cities, name: 'Cities' },
  { path: '/settings', component: Settings, name: 'Settings' },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  nextTick(() => {
    document.title = `${appTitle} - ${to.name}`;
  });
});

export default router;
