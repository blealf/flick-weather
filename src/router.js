import { createMemoryHistory, createRouter } from 'vue-router';

import Home from './components/HomePath.vue';
import Cities from './components/CitiesList.vue';
import Settings from './components/AllSettings.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/cities', component: Cities },
  { path: '/settings', component: Settings },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
