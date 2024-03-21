<template>
  <Card>
    <h2>HOURLY FORECAST</h2>

    <div v-if="todaysForecast.length > 1" class="forecast__wrapper">
      <div
        v-for="item in (isMobile ? todaysForecast.slice(1, 5) : todaysForecast.slice(1, 7))"
        :key="item.time"
        class="forecast__item"
      >
        <p>{{ item.time }}</p>
        <img :src="item.icon" alt="3-hr" class="weather-icon" />
        <h3>{{ item.temp }} {{ symbol }}</h3>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Card from './base/CardComponent.vue';
import useWeather from '../stores/weatherStore';
import { temperatureSymbol } from '../utils/helper';

const weather = useWeather();
const todaysForecast = ref(weather.hourlyWeather);
const symbol = temperatureSymbol(weather.unitSettings.temperature);

const isMobile = ref(false);
const getWindowMatch = async () => window.matchMedia('(max-width: 599px)').matches;
const updateIsMobile = async () => {
  isMobile.value = await getWindowMatch();
};

onMounted(async () => {
  await updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
});

onUnmounted(async () => {
  window.removeEventListener('resize', updateIsMobile);
});

weather.$subscribe((_, state) => {
  todaysForecast.value = state.hourlyWeather;
});
</script>

<style lang="scss" scoped>
.forecast {
  &__wrapper {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    @include xs {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  &__item {
    padding: 0 5px;
    border-right: 2px solid #444;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &:last-of-type {
      border-right: none;
    }

    p {
      font-size: 16px;

      @include xs {
        font-size: 14px;
      }
    }

    img {
      width: 40px;
    }
  }
}
</style>./base/CardComponent.vue
