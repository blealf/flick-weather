<template>
  <Card class="seven-day">
    <h2>7-DAY FORECAST</h2>
    <div class="seven-day__wrapper">
      <div v-for="item in 7" :key="item.name" class="seven-day__item">
        <p>Today</p>
        <div>
          <img src="../assets/sun.svg" alt="" width="20">
          Sunny
        </div>
        <p>36/24</p>
      </div>
    </div>
  </Card>
</template>

<script setup>
import useWeather from '../stores/useWeatherStore';
import Card from './CardComponent.vue';

const weather = useWeather();

/* eslint-disable-next-line */
const sevenDayWeather = weather.sevenDayWeather;

console.log(sevenDayWeather);
</script>

<style lang="scss" scoped>
.seven-day {
  width: 100%;
  &__wrapper {
    padding: 10px;
  }
  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-bottom: 2px solid #444;
    padding: 10px;

    &:last-of-type {
      border-bottom: none;
    }
    p:first-of-type {
      margin-right: auto;
    }
    p:last-of-type {
      margin-left: auto;
    }
  }
}
</style>
