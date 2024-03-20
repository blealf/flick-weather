<template>
  <div class="app">
    <SideNav />
    <div>
      <SearchCity v-if="route.path !== '/settings'" />
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, nextTick } from 'vue';
import SideNav from './components/SideNav.vue';
import SearchCity from './components/SearchCity.vue';
import useWeather from './stores/weatherStore';

const route = useRoute();
const weather = useWeather();

const usePosition = async (position) => {
  const { longitude: lon, latitude: lat } = position.coords;
  await weather.setPosition({
    longitude: position.coords.longitude,
    latitude: position.coords.latitude,
  });

  await weather.fetchAllWeather({ lon, lat });
};

onMounted(async () => {
  if (navigator.geolocation) {
    await navigator.geolocation.getCurrentPosition(usePosition);
  } else {
    // await weather.setCurrentWeather({ city: weather.getCurrentCity });
  }
});
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
