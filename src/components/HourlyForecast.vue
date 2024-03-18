<template>
  <Card>
    <h2>TODAY'S FORECAST</h2>

    <div class="forecast__wrapper">
      <div v-for="item in 6" :key="item.time" class="forecast__item">
      <p>6:00 AM</p>
      <img src="" alt="">
      <h2>25deg</h2>
    </div>
    </div>
  </Card>
</template>

<script setup>
import Card from './CardComponent.vue';
import useWeather from '../stores/weatherStore';

const weather = useWeather();

const todaysForecast = weather.hourlyWeather;
console.log(todaysForecast);
</script>

<style lang="scss" scoped>
.forecast {
  &__wrapper {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    justify-content: space-evenly;
    align-items: center;
  }
  &__item {
    padding: 0 10px;
    border-right: 2px solid #444;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &:last-of-type {
      border-right: none;
    }
  }
}
</style>../stores/weather
