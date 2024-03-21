<template>
  <Card class="seven-day">
    <h2>DAILY FORECAST</h2>
    <div v-if="dailyForecast.length > 1" class="seven-day__wrapper">
      <div v-for="item in dailyForecast" :key="item.name" class="seven-day__item">
        <p>{{ item.time }}</p>
        <div class="weather">
          <p>{{ item.weather }}</p>
          <img :src="item.icon" alt="Icon" width="60"  class="weather-icon" />
        </div>
        <p>{{ item.minTemp + symbol }}/{{ item.maxTemp+ symbol }}</p>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import Card from './base/CardComponent.vue';
import useWeather from '../stores/weatherStore';
import { temperatureSymbol } from '../utils/helper';

const weather = useWeather();

const dailyForecast = ref(weather.dailyWeather);
const symbol = shallowRef(temperatureSymbol(weather.unitSettings.temperature));

weather.$subscribe((_, state) => {
  dailyForecast.value = state.dailyWeather;
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
    padding: 25px 10px;

    @include xs {
      padding: 10px;
    }

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
