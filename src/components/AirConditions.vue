<template>
  <Card class="air-conditions">
    AIR CONDITIONS
    <AirConditionsSkeleton v-if="weather.loading" />
    <div v-else-if="airConditions.length > 0" class="air-conditions__wrapper">
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
import { shallowRef, defineAsyncComponent } from 'vue';
import { temperatureSymbol } from '../utils/helper';
import Card from './base/CardComponent.vue';
import useWeather from '../stores/weatherStore';
import AirConditionsSkeleton from './skeletons/AirConditionsSkeleton.vue';

const weather = useWeather();
const airConditions = shallowRef([]);
const unit = weather.getUnit;
const currentStandard = weather.unitStandards[unit];

const fetchSvg = (icon) => defineAsyncComponent(() => import(`../assets/images/${icon}.svg`));

const mapAirDataNames = {
  realFeel: 'Real Feel',
  windSpeed: 'Wind',
  humidity: 'Humidity',
  visibility: 'Visibility',
};
const getAirDataUnit = {
  realFeel: temperatureSymbol(weather.unitSettings.temperature),
  windSpeed: currentStandard.windSpeed,
  humidity: currentStandard.humidity,
  visibility: '',
};

const getAirDataImages = {
  realFeel: fetchSvg('thermometer'),
  windSpeed: fetchSvg('wind'),
  humidity: fetchSvg('rain'),
  visibility: fetchSvg('sun'),
};

const populateAirData = (airData) => {
  if (!airData.windSpeed && !airData.visibility) return;
  airConditions.value = Object.entries(airData)
    .map(([key, value]) => ({
      value: `${value} ${getAirDataUnit[key]}`,
      name: mapAirDataNames[key],
      icon: getAirDataImages[key],
    }));
};

weather.$subscribe((_, state) => {
  populateAirData(state.currentAirData);
});
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
    margin-top: 20px;
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
