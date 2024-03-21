import { defineStore } from 'pinia';
import axios from 'axios';
import {
  mapAndAddHourly,
  mapAndAddDaily,
  assignCurrentData,
  openWeatherBaseUrl,
  openWeatherApiKey,
} from '../utils/helper';

const useWeather = defineStore('weather', {
  state: () => ({
    loading: false,
    error: {
      current: null,
      hourly: null,
    },
    geoLocation: {
      lat: null,
      lon: null,
    },
    cities: [],
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
    dailyWeather: [{
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
      return this.unitSettings.temperature.name === 'Celsius' ? 'metric' : 'imperial';
    },
  },

  actions: {
    async setUnit(unit, value) {
      this.unitSettings[unit].name = value;
      localStorage.setItem('unit', this.getUnit);
    },
    async setCurrentCity(value, isHome = false) {
      const filterCities = await this.cities.filter(
        (city) => JSON.stringify(city) !== JSON.stringify(value),
      );
      this.cities.splice(0);
      if (isHome) {
        this.cities.push(value, ...filterCities);
      } else {
        this.cities.push(...filterCities, value);
      }
      localStorage.setItem('city', JSON.stringify(value));
    },
    setPosition(position) {
      const { longitude, latitude } = position;
      this.geoLocation.lon = longitude;
      this.geoLocation.lat = latitude;
    },
    async fetchAllWeather({ position, city, unit }) {
      await this.setCurrentWeather({
        city: city || this.getCurrentCity,
        position: position || null,
        unit: unit || this.getUnit,
      })
        .then(async ({ coord, dt, timezone }) => {
          await this.setHourlyForecast(coord, { dt, timezone });
        }).catch((error) => {
          this.error.current = error;
        });
    },
    async setCurrentWeather({ city, position, unit }) {
      return new Promise((resolve, reject) => {
        this.loading = true;

        const localCity = localStorage.getItem('city') ? JSON.parse(localStorage.getItem('city')) : null;
        const useCity = city || localCity;
        const cityName = useCity?.name || this.getCurrentCity?.name;
        const countryCode = useCity?.country || this.getCurrentCity?.country;
        const useUnit = unit || this.getUnit;

        try {
          const fetchURL = `${openWeatherBaseUrl}/weather?q=${cityName},${countryCode}&appid=${openWeatherApiKey}&units=${useUnit}`;
          const fetchWithCoordinates = `${openWeatherBaseUrl}/weather?lat=${this.geoLocation.lat}&lon=${this.geoLocation.lon}&appid=${openWeatherApiKey}&units=${useUnit}`;

          axios.get(
            position ? fetchWithCoordinates : fetchURL,
            {
              mode: 'no-cors',
              contentType: 'application/json',
            },
          ).then(async ({ data }) => {
            this.cities.unshift({ name: data.name, country: data.sys.country });
            localStorage.setItem('city', JSON.stringify(this.cities[0]));
            assignCurrentData(data, this);
            this.geoLocation.lat = data.coord.lat;
            this.geoLocation.lat = data.coord.lon;
            resolve({ coord: data.coord, dt: data.dt, timezone: data.timezone });
          }).catch((error) => {
            reject(error);
            this.error.current = error;
          });
        } catch (error) {
          reject(error);
          this.error.current = error;
        }
        this.loading = false;
      });
    },
    async setHourlyForecast({ lat, lon }, { dt, timezone }) {
      this.loading = true;
      try {
        const fetchWithCoordinates = `${openWeatherBaseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=${this.getUnit}`;

        const { data } = await axios.get(
          fetchWithCoordinates,
          {
            mode: 'no-cors',
            contentType: 'application/json',
          },
        );
        mapAndAddHourly(data.list, this);
        mapAndAddDaily({ dt, timezone }, data.list, this);
      } catch (error) {
        this.error.hourly = error;
      }
      this.loading = false;
    },
  },
});

export default useWeather;
