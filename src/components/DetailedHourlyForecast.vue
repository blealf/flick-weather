<template>
  <Card class="seven-day">
    <h2>7-DAY FORECAST</h2>
    <div class="seven-day__wrapper">
      <div v-for="item in todaysForecast" :key="item.name" class="seven-day__item">
        <p>{{ item.time }}</p>
        <div class="weather">
          <p>{{ item.weather }}</p>
          <img :src="item.icon" alt="" width="60">
        </div>
        <p>{{ item.minTemp }}/{{ item.maxTemp }}</p>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import Card from './CardComponent.vue';
import useWeather from '../stores/weatherStore';
import { getWeatherIcon } from '../utils/helper';

const weather = useWeather();

const todaysForecast = ref(weather.hourlyWeather);
const symbol = weather.unitSettings.temperature.symbol + weather.unitSettings.temperature.name.charAt(0).toUpperCase();

weather.$subscribe((_, state) => {
  todaysForecast.value = state.hourlyWeather;
});
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

    .weather {
      display: flex;
      align-items: center;
      gap: 10px;

      p {
        font-size: 18px;
      }
    }
  }
}
</style>
