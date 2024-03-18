<template>
  <div class="app">
    <sideNav />
    <div>
      <SearchCity v-if="route.path !== '/settings'" />
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import SideNav from './components/SideNav.vue';
import SearchCity from './components/SearchCity.vue';

const route = useRoute();
</script>

<style lang="scss" scoped>
.app {
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-gap: 20px;
  padding: 20px;

  @include xs {
    display: flex;
    justify-content: center;
    align-items: center;
    grid-template-columns: 1fr;
  }
}
</style>
