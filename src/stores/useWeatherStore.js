import { defineStore } from 'pinia';

const useWeather = defineStore('weather', {
  state: () => ({
    cities: ['Lagos'],
    currentCity: '',
    currentWeather: {
      temperature: '',
      windSpeed: '',
      humidity: '',
      overcast: '',
      uv: '',
    },
    hourlyWeather: [{
      time: '',
      temperature: '',
      overcast: '',
    }],
    sevenDayWeather: [{
      date: '',
      temperature: '',
      overcast: '',
    }],
    unitSettings: {
      temperature: 'Celsius',
      wind: '',
      pressure: '',
      precipitation: '',
      distance: '',
    },
    generalSettings: {
      timeFormat: '',
      shouldGetLocation: '',
      theme: '',
    },
  }),

  getters: {
    getWetherIcon(icon, size = '2x') {
      return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
    },
  },

  actions: {
    setUnit(unit, value) {
      this.unitSettings[unit] = value;
    },
    setCurrentCity(value) {
      console.log({ value });
      this.cities.push(...[value, ...this.cities.filter((city) => city !== value)]);
    },
  },
});

export default useWeather;
