<template>
  <Card class="seven-day">
    <h2>DETAILED HOURLY FORECAST</h2>
    <div v-if="todaysForecast.length > 1" class="seven-day__wrapper">
      <div v-for="item in todaysForecast" :key="item.name" class="seven-day__item">
        <p>{{ item.time }}</p>
        <div class="weather">
          <p>{{ item.weather }}</p>
          <img :src="item.icon" alt="" width="60">
        </div>
        <p>{{ item.minTemp + symbol }}/{{ item.maxTemp+ symbol }}</p>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import Card from './CardComponent.vue';
import useWeather from '../stores/weatherStore';
import { temperatureSymbol } from '../utils/helper';

const weather = useWeather();

const todaysForecast = ref(weather.hourlyWeather);
const symbol = shallowRef(temperatureSymbol(weather.unitSettings.temperature));

weather.$subscribe((_, state) => {
  todaysForecast.value = state.hourlyWeather;
  symbol.value = temperatureSymbol(state.unitSettings.temperature);
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
