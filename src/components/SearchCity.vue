<template>
    <div class="search">
      <input v-model="search" type="text" placeholder="Enter City" />
      <div class="input-icons">
        <ClearButton v-if="showClearButton" class="clear" @click="clearInput" />
        <LocateButton class="locate" @click="emit('geo-locate')" />
      </div>
      <div v-if="search.length > 0" class="suggestion">
        <p v-show="loading" class="loading"></p>
        <p v-for="city in citiesResults" :key="city.name" @click="selectCity(city)">
          {{ city.name + ', ' + city.country }}
        </p>
      </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import {
  ref, watch, defineAsyncComponent, nextTick, onMounted, defineEmits,
} from 'vue';
import { useLoading } from 'vue-loading-overlay';
import useWeather from '../stores/weatherStore';

const weather = useWeather();
const citiesResults = ref([]);
const search = ref('');
const showClearButton = ref(false);
const selectedCity = ref('');
const loading = ref(true);
const allCities = ref([]);
const route = useRoute();

const ClearButton = defineAsyncComponent(() => import('../assets/images/cancel.svg'));
const LocateButton = defineAsyncComponent(() => import('../assets/images/location.svg'));

// Wait for all cities to load before showing the app
const $loading = useLoading({
  color: '#eee',
  loader: 'dots',
  width: 100,
  height: 100,
  backgroundColor: 'var(--main-bg)',
  opacity: 0.9,
  zIndex: 999,
});

onMounted(() => {
  const loader = $loading.show();
  nextTick(async () => {
    const { default: data } = await import('cities.json');
    allCities.value = data;
    loading.value = false;
    loader.hide();
  });
});

const clearInput = () => {
  search.value = '';
  citiesResults.value.splice(0);
};

// return matches on search value anc cities repo
const matchValues = (cityValue) => cityValue.name.toLowerCase().includes(search.value.toLowerCase())
  || `${cityValue.name.toLowerCase()}${cityValue.country.toLowerCase()}`
    .includes(search.value.toLowerCase().replace(' ', ''))
  || `${cityValue.name.toLowerCase()},${cityValue.country.toLowerCase()}`
    .includes(search.value.toLowerCase().replace(' ', ''));

// get cities from search values
const fetchCities = async () => {
  try {
    const cities = await allCities.value.filter(
      (city) => matchValues(city),
    ).slice(0, 20)
      .map((city) => ({ name: city.name, country: city.country }));

    citiesResults.value.splice(0);
    citiesResults.value.push(...cities);
  } catch (error) {
    //
  }
};

// Generic debounce function
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
  await weather.setCurrentCity(city, route.path === '/');
  await weather.setCurrentWeather({ city })
    .then(async (coord) => {
      await weather.setHourlyForecast(coord);
    });
  clearInput();
};

const emit = defineEmits(['geo-locate']);

watch(search, (newVal, preVal) => {
  loading.value = true;
  showClearButton.value = newVal;
  if (newVal.length === 0) clearInput();
  if (newVal !== preVal && newVal.length >= 2) debounceFetchCities();
});
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  margin: 20px 0;
  width: 40vw;
  border-radius: 5px;
  box-shadow: var(--shadow);

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
    color: var(--font-color);
  }
  .input-icons {
    position: absolute;
    right: 5px;;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    /* border: 1px solid red; */
    gap: 10px;
    .clear {
      width: 20px;
      cursor: pointer;
    }
    .locate {
      width: 35px;
      height: 100%;
      padding-left: 5px;
      border-left: 1px solid var(--main-bg);
      cursor: pointer;
    }
  }
  .suggestion {
    position: absolute;
    display: flex;
    flex-direction: column;
    background: var(--card-bg);
    width: 100%;
    max-height: 300px;
    overflow-y: scroll;
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
