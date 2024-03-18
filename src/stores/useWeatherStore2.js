import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';

const useWeather = defineStore('weather', () => {
  const cities = reactive(['Lagos']);
  const currentCity = computed(() => cities[0]);

  const currentWeather = reactive({
    temperature: '',
    windSpeed: '',
    humidity: '',
    overcast: '',
    uv: '',
  });
  const hourlyWeather = reactive([{
    time: '',
    temperature: '',
    overcast: '',
  }]);
  const sevenDayWeather = reactive([{
    date: '',
    temperature: '',
    overcast: '',
  }]);
  const unitSettings = reactive({
    temperature: 'Celsius',
    wind: '',
    pressure: '',
    precipitation: '',
    distance: '',
  });
  const generalSettings = reactive({
    timeFormat: '',
    shouldGetLocation: '',
    theme: '',
  });

  function getWetherIcon(icon, size = '2x') {
    return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
  }

  function setUnit(unit, value) {
    unitSettings[unit] = value;
  }

  function setCurrentCity(value) {
    console.log({ value });
    cities.push(...[value, ...cities.filter((city) => city !== value)]);
  }

  return {
    cities,
    currentCity,
    currentWeather,
    hourlyWeather,
    sevenDayWeather,
    unitSettings,
    generalSettings,
    getWetherIcon,
    setUnit,
    setCurrentCity,
  };
});

export default useWeather;
