<template>
  <Card class="air-conditions">
    AIR CONDITIONS
    <div class="air-conditions__wrapper">
      <div v-for="item in airConditions" :key="item.name" class="air-conditions__item">
        <Component :is="item.icon" class="icon" />
        <div>
          <p>{{  item.name }}</p>
          <h2>{{  item.value }}</h2>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { reactive, defineAsyncComponent } from 'vue';
import Card from './CardComponent.vue';
import useWeather from '../stores/weatherStore';

const weather = useWeather();
const currentAirData = weather.currentAirData;

const fetchSvg = (icon) => defineAsyncComponent(() => import(`../assets/images/${icon}.svg`));

const mapAirDataNames = {
  realFeel: 'Real Feel',
  windSpeed: 'Wind',
  rain: 'Chance of Rain',
  visibility: 'Visibility'
};

const getAirDataImages = {
  realFeel: fetchSvg('thermometer'),
  windSpeed: fetchSvg('wind'),
  rain: fetchSvg('rain'),
  visibility: fetchSvg('sun')
};

const airConditions = reactive([]);

Object.entries(currentAirData).forEach(([key, value]) => {
  airConditions.push({
    value,
    name: mapAirDataNames[key],
    icon: getAirDataImages[key]
  });
});

// const airConditions2 = shallowRef([
//   {
//     name: 'Real Feel',
//     value: '30˚',
//     icon: fetchSvg('thermometer'),
//   },
//   {
//     name: 'Wind',
//     value: '0.2 Km/h',
//     icon: fetchSvg('wind'),
//   },
//   {
//     name: 'Chance of Rain',
//     value: '0%',
//     icon: fetchSvg('rain'),
//   },
//   {
//     name: 'UV Index',
//     value: '3',
//     icon: fetchSvg('sun'),
//   },
// ]);
</script>

<style lang="scss" scoped>
.air-conditions {
  display: flex;
  flex-direction: column;

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    justify-content: flex-start;
    align-items: flex-start;
  }

  &__item {
    display: flex;
    justify-content: start;
    align-items: flex-start;
    text-align: left;

    p {
      font-size: 18px;
    }

    .icon {
      height: 40px;
      margin-right: 10px;
      margin-top: 20px;
    }
  }
}
</style>
