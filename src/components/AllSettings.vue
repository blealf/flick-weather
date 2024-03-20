<template>
  <div class="settings">
    <h1>Settings</h1>
    <div class="settings-wrapper">
      <CardComponent>
        <div v-for="unit in allUnits" :key="unit.name" class="unit">
          <p>{{ capitalize(unit.name) }}</p>
          <div class="value" >
            <p
              v-for="value in unit.values" :key="value"
              :class="{active: units[unit.name].name === value}"
              @click="setUnit(unit.name, value)
            ">{{ value }}</p>
          </div>
        </div>
        <div class="unit">
          <p>Theme</p>
          <div class="value" >
            <p
              v-for="value in themes" :key="value"
              :class="{ active: appData.getTheme === value}"
              @click="appData.toggleTheme"
            >{{ value }}</p>
          </div>
        </div>
      </CardComponent>
      <DetailedHourlyForecast></DetailedHourlyForecast>
    </div>
  </div>
</template>

<script setup>
import { shallowRef, ref } from 'vue';
import useWeather from '../stores/weatherStore';
import useData from '../stores/dataStore';
import CardComponent from './CardComponent.vue';
import DetailedHourlyForecast from './DetailedHourlyForecast.vue';

const weather = useWeather();
const units = weather.unitSettings;
const allUnits = ref([
  {
    name: 'temperature',
    values: ['Celsius', 'Fahrenheit'],
  },
]);

const appData = useData();
const themes = shallowRef(['light', 'dark']);

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const setUnit = async (unit, value) => {
  if (value !== units[unit].name) {
    weather.setUnit(unit, value);
    weather.fetchAllWeather({ unit });
  }
};

</script>

<style lang="scss" scoped>
.settings {
  width: 100%;
  @include md {
    width: calc(100vw - 40px);
    padding: 0;
    flex-direction: column;
    transition: width 0.3s;
  }
  .settings-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    @include md {
      flex-direction: column;
    }
  }

  .value {
    margin-top: 10px;
    border-radius: 10px;
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 1fr;
    justify-content: space-evenly;
    align-items: center;
    background: var(--main-bg);
    padding: 5px;
    p {
      text-align: center;
      cursor: pointer;
      transition: background 0.5s;
    }
    .active {
      background: var(--card-bg);
      border-radius: 8px;
    }
  }
}
</style>
