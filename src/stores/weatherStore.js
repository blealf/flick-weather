import { defineStore } from 'pinia';
import axios from 'axios';
import {
  mapAndAddHourly,
  assignCurrentData,
  openWeatherBaseUrl,
  openWeatherApiKey,
} from '../utils/helper';

const useWeather = defineStore('weather', {
  state: () => ({
    loading: false,
    geoLocation: {
      lat: null,
      lon: null,
    },
    cities: [{ name: 'London', country: 'GB' }],
    currentAirData: {
      realFeel: '',
      windSpeed: '',
      humidity: '',
      visibility: '',
    },
    currentWeather: {
      temperature: '',
      pressure: '',
      date: '',
      icon: '',
      description: '',
      uv: '',
    },
    hourlyWeather: [{
      time: '',
      temp: '',
      icon: '',
    }],
    unitStandards: {
      metric: {
        temperature: 'Celsius',
        windSpeed: 'm/s',
        humidity: '%',
        pressure: 'hPa',
        rain: 'mm',
      },
      imperial: {
        temperature: 'Fahrenheit',
        windSpeed: 'mph',
        humidity: '%',
        pressure: 'hPa',
        rain: 'm',
      },
    },
    unitSettings: {
      temperature: { name: 'Celsius', symbol: '°' },
      windSpeed: { name: 'miles per second', symbol: 'm/s' },
      humidity: { name: 'percent', symbol: '%' },
      pressure: { name: 'atmospheric pressure', symbol: 'm/s' },
      rain: { name: 'millimeter', symbol: 'm/s' },
    },
    generalSettings: {
      timeFormat: '',
      shouldGetLocation: '',
      theme: '',
    },
  }),

  getters: {
    getCurrentCity() {
      return this.cities[0];
    },
    getUnit() {
      return this.unitSettings.temperature.name === "Celsius" ? 'metric' : 'imperial';
    }
  },

  actions: {
    async setUnit(unit, value) {
      this.unitSettings[unit].name = value;
    },
    async setCurrentCity(value, isHome = false) {
      const filterCities = await this.cities.filter(
        (city) => JSON.stringify(city) !== JSON.stringify(value));
      this.cities.splice(0);
      if (isHome) {
        this.cities.push(value, ...filterCities);
      }
      else {
        this.cities.push(...filterCities, value);
      }
    },
    setPosition(position) {
      const { longitude, latitude } = position;
      this.geoLocation.lon = longitude;
      this.geoLocation.lat = latitude;
    },
    async fetchAllWeather(position) {
      await this.setCurrentWeather({ city: this.getCurrentCity, position })
        .then(async (coord) => {
          await this.setHourlyForecast(coord);
        })
    },
    async setCurrentWeather({ city, position }) {
      return new Promise(async (resolve, reject) => {
        this.loading = true
        
        const cityName = city?.name || this.getCurrentCity.name;
        const countryCode = city?.country || this.getCurrentCity.country;
        
        try {
          const fetchURL =
            `${openWeatherBaseUrl}/weather?q=${cityName},${countryCode}&appid=${openWeatherApiKey}&units=${this.getUnit}`;
          const fetchWithCoordinates =
            `${openWeatherBaseUrl}/weather?lat=${this.geoLocation.lat}&lon=${this.geoLocation.lon}&appid=${openWeatherApiKey}&units=${this.getUnit}`
          
          const { data } = await axios.get(
            position ? fetchWithCoordinates : fetchURL,
            {
              mode: 'no-cors',
              contentType: 'application/json',
            },
          );
  
          this.cities.unshift({ name: data.name, country: data.sys.country });
          await assignCurrentData(data, this);
          this.geoLocation.lat = data.coord.lat;
          this.geoLocation.lat = data.coord.lon;
          resolve(data.coord);
        } catch (error) {}
        this.loading = false
      })
    },
    async setHourlyForecast({ lat, lon }) {
      this.loading = true
      try {
        const fetchWithCoordinates =
          `${openWeatherBaseUrl}/forecast?lat=${lat}&lon=${lon}&cnt=9&appid=${openWeatherApiKey}&units=${this.getUnit}`;
        
        const { data } = await axios.get(
          fetchWithCoordinates,
          {
            mode: 'no-cors',
            contentType: 'application/json',
          },
        );
        mapAndAddHourly(data.list, this);
      } catch (error) {}
      this.loading = false
    },
  },
});

export default useWeather;
