<template>
  <div class="current-weather">
    <div class="conditions">
      <h1>{{ weather.currentCity }}</h1>
      <p>Chance of rain 0%</p>
      <h1 class="temp">31˚</h1>
    </div>
    <div>
      <img :src="weatherIcon" alt="Sun">
    </div>
  </div>
</template>

<script setup>
import useWeather from '../stores/useWeatherStore';

const weather = useWeather();

const weatherIcon = weather.getWetherIcon('01d', '4x');

console.log({ weather: weather.cities, weatherIcon });

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
