<template>
  <div class="app">
    <SideNav />
    <div v-if="weather.getCurrentCity">
      <SearchCity v-if="route.path !== '/settings'" @geo-locate="getLocationAndFetch" />
      <RouterView />
    </div>
    <div v-else>
      <NoCity>
        <SearchCity v-if="route.path !== '/settings'" @geo-locate="getLocationAndFetch" />
      </NoCity>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import SideNav from './components/SideNav.vue';
import SearchCity from './components/SearchCity.vue';
import useWeather from './stores/weatherStore';
import NoCity from './components/NoCity.vue';

const route = useRoute();
const weather = useWeather();

const getStoredValues = async () => {
  const [localCity, localUnit] = await [localStorage.getItem('city'), localStorage.getItem('unit')];
  const city = localCity ? JSON.parse(localCity) : null;
  const unit = localUnit || weather.getUnit;
  weather.setUnit('temperature', unit === 'metric' ? 'Celsius' : 'Fahrenheit');
  return {
    city, unit,
  };
};

const usePosition = async (position) => {
  const { unit } = getStoredValues();
  const { longitude: lon, latitude: lat } = position.coords;

  await weather.setPosition({ longitude: lon, latitude: lat });
  await weather.fetchAllWeather({ position: { lon, lat }, unit });
};

const getLocationAndFetch = async () => {
  if (navigator.geolocation) {
    await navigator.geolocation.getCurrentPosition(usePosition);
  }
};

onMounted(async () => {
  const { city, unit } = await getStoredValues();
  if (city) return weather.fetchAllWeather({ city, unit });

  await getLocationAndFetch();
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
