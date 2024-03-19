<template>
  <div class="current-weather">
    <div class="conditions">
      <h1>{{ weather.getCurrentCity.name }}</h1>
      <p v-if="currentWeather.rain">Chance of rain {{ currentWeather.rain }}%</p>
      <p>Humidity: {{ currentWeather.humidity }}</p>
      <p>{{ capitalize(currentWeather.description) }}</p>
      <h1 class="temp">{{ currentWeather.temperature + '' + symbol }}</h1>
    </div>
    <div>
      <img :src="weatherIcon" alt="Sun">
    </div>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue';
import useWeather from '../stores/weatherStore';
import { getWeatherIcon, capitalize } from '../utils/helper';

const weather = useWeather();
const currentWeather = weather.currentWeather;
const symbol = weather.unitSettings.temperature.symbol + weather.unitSettings.temperature.name.slice(0, 1);
const weatherIcon = shallowRef(getWeatherIcon(currentWeather.icon, '4x'));

weather.$subscribe((_, state) => {
  weatherIcon = getWeatherIcon(state.currentWeather.icon, '4x');
})
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
    }
    .temp {
      margin-top: 10vh;
    }
  }

  img {
    width: clamp(250px, 30vh, 40vh);
  }
}
</style>
