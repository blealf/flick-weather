<template>
  <div class="current-weather">
    <div class="conditions">
      <h1 ref="title">{{ `${city.name}, ${city.country}` }}</h1>
      <p v-if="currentWeather.rain">Chance of rain {{ currentWeather.rain }}%</p>
      <h>{{ capitalize(currentWeather.description) }}</h>
      <div class="time">
        <h3>{{ currentWeather.date }}</h3>
        <button @click="refreshData">Refresh</button>
      </div>
      <h1 class="temp">{{ currentWeather.temperature + '' + symbol }}</h1>
    </div>
    <div>
      <img :src="currentWeather.icon" alt="Icon">
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted } from 'vue';
import useWeather from '../stores/weatherStore';
import { capitalize, temperatureSymbol } from '../utils/helper';

const title = ref(null);
const weather = useWeather();
const currentWeather = shallowRef(weather.currentWeather);
const city = shallowRef(weather.getCurrentCity);

const symbol = temperatureSymbol(weather.unitSettings.temperature);

const setTextSize = () => {
  const text = `${city.value.name}, ${city.value.country}`;
  title.value.style.fontSize = text.length > 15 ? '25px' : '35px';
};

const refreshData = () => {
  weather.setCurrentWeather(weather.getCurrentCity);
};

onMounted(() => {
  setTextSize();
  refreshData();
});

weather.$subscribe((_, state) => {
  currentWeather.value = state.currentWeather;
  const { cities: [val] } = state;
  city.value = val;
});
</script>

<style lang="scss" scoped>
.current-weather {
  margin-top: 20px;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 300px;
  padding: 0 40px;
  /* border: 1px solid red; */
  width: 100%;

  .conditions {
    text-align: left;
    h1 {
      padding: 0;
      margin: 0;
      margin-bottom: 10px;
      font-size: 35px;
      max-width: 300px;
    }
    .temp {
      margin-top: 10vh;
    }
  }

  img {
    width: clamp(250px, 30vh, 40vh);
    @include sm {
      width: 150px;
    }
    @include xs {
      margin-left: -50px;
      width: 150px;
    }
  }
}

.time {
  display: flex;
  justify-content: start;
  align-items: center;

  button {
    margin-left: 10px;
    padding: 5px 10px;
    background: var(--card-bg);
    color: #eee;
    border: none;
    border-radius: 5px;
  }
}

</style>
