<template>
  <Card class="air-conditions">
    AIR CONDITIONS
    <div v-if="airConditions.length > 0" class="air-conditions__wrapper">
      <div v-for="item in airConditions" :key="item.name" class="air-conditions__item">
        <Component :is="item.icon" class="icon" />
        <div>
          <p>{{ item.name }}</p>
          <h2>{{ item.value }}</h2>
        </div>
      </div>
    </div>
    <div v-else class="no-data">
      <h2>NO DATA...</h2>
    </div>
  </Card>
</template>

<script setup>
import { reactive, defineAsyncComponent } from 'vue';
import Card from './CardComponent.vue';
import useWeather from '../stores/weatherStore';

const weather = useWeather();
const airConditions = reactive([]);

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


const populateAirData = (airData) => {
  if (!airData.windSpeed && !airData.visibility) return
  Object.entries(airData).forEach(([key, value]) => {
    airConditions.push({
      value,
      name: mapAirDataNames[key],
      icon: getAirDataImages[key]
    });
  });
};

weather.$subscribe((_, state) => {
  populateAirData(state.currentAirData);
})

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
    margin-top: 10px;
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

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>
