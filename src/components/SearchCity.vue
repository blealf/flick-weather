<template>
    <div class="search">
      <input v-model="search" type="text" placeholder="Enter City" />
      <ClearButton v-if="showClearButton" class="clear" @click="clearInput" />
      <div ref="searchResultsBox" class="suggestion">
        <p v-show="loading" class="loading"></p>
        <p v-for="city in citiesResults" :key="city.name" @click="selectCity(city)">
          {{ city.name + ', ' + city.country }}
        </p>
      </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import * as allCities from 'cities.json';
import { useRoute } from 'vue-router';
import { ref, watch, defineAsyncComponent } from 'vue';
import useWeather from '../stores/weatherStore';

const weather = useWeather();
const ClearButton = defineAsyncComponent(() => import('../assets/images/cancel.svg'));
const searchResultsBox = ref(null);
const citiesResults = ref([]);
const search = ref('');
const showClearButton = ref(false);
const selectedCity = ref('');
const loading = ref(false);

const route = useRoute();

const clearInput = () => {
  search.value = '';
  citiesResults.value.splice(0);
};

const fetchCities = async () => {
  try {
    const cities = await allCities.default.filter(
      (city) => city.name.toLowerCase().includes(search.value.toLowerCase()),
    ).slice(0, 7)
      .map((city) => ({ name: city.name, country: city.country }));

    citiesResults.value.splice(0);
    citiesResults.value.push(...cities);
  } catch (error) {}
};

const debounce = (func, delay) => {
  let timeoutId;
  loading.value = true;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func();
      loading.value = false;
    }, delay);
  };
};

const debounceFetchCities = debounce(fetchCities, 1000);

const selectCity = async (city) => {
  selectedCity.value = city;
  await weather.setCurrentCity(city, route.path === "/");
  await weather.setCurrentWeather({ city })
    .then(async (coord) => {
      await weather.setHourlyForecast(coord)
    })
  clearInput();
};

watch(search, (newVal, preVal) => {
  loading.value = true
  showClearButton.value = newVal;
  searchResultsBox.value.style.display = newVal ? 'flex' : 'none';
  if (newVal.length === 0) clearInput();
  if (newVal !== preVal && newVal.length >= 3) debounceFetchCities();
});
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  margin: 20px 0;
  width: 40vw;
  @include sm {
    width: 90vw;
  }
  input {
    border-radius: 10px;
    padding: 5px 10px;
    width: 100%;
    border: none;
    height: 50px;
    max-width: 900px;
    background: var(--card-bg);
    font-size: 18px;
  }
  .clear {
    position: absolute;
    right: -10px;;
    top: 12px;
    height: 25px;
    cursor: pointer;
  }
  .suggestion {
    position: absolute;
    display: none;
    flex-direction: column;
    background: var(--card-bg);
    width: 100%;
    padding: 10px 5px 5px 5px;

    p {
      margin-top: 2px;
      background: var(--main-bg);
      padding: 10px 20px;
      border-bottom: 1px solid #444;
      cursor: pointer;
      border-radius: 5px;
      &:hover {
        /*  */
      }
    }
  }
}
.loading {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  height: 40px;
  &::before {
    animation: shimmer 500ms infinite;
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    background: var(--card-bg);
  }
}


</style>
