import { defineStore } from 'pinia';
import axios from 'axios';
import { openWeatherApiKey, ninjaApiKey } from '../utils/helper';

console.log({ openWeatherApiKey })
const useWeather = defineStore('weather', {
  state: () => ({
    geoLocation: {
      lat: null,
      lon: null,
    },
    cities: [{ name: 'London', country: 'GB' }],
    currentAirData: {
      realFeel: '',
      windSpeed: '',
      rain: '',
      visibility: '',
    },
    currentWeather: {
      temperature: '',
      humidity: '',
      pressure: '',
      date: '',
      icon: '',
      description: '',
      uv: '',
    },
    hourlyWeather: [{
      time: '',
      temperature: '',
      icon: '',
    }],
    sevenDayWeather: [{
      date: '',
      temperature: '',
      overcast: '',
    }],
    unitSettings: {
      temperature: { name: 'Celsius', symbol: '°' },
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
      await this.setCurrentWeather({ city: this.getCurrentCity, geoLocate: null });
    },
    async setCurrentCity(value, isHome = false) {
      const newCities = await this.cities.filter(
        (city) => JSON.stringify(city) !== JSON.stringify(value));
      this.cities.splice(0);
      if (isHome) {
        this.cities.push(value, ...newCities);
      }
      else {
        this.cities.push(...newCities, value);
      }
    },
    async getPositionFromCity() {
      try {
        const url = 'https://api.api-ninjas.com/v1/city?name='
        const response = await axios.get(url + this.getCurrentCity, {
          'X-Api-Key': ninjaApiKey,
          mode: 'no-cors'
        });
        console.log(response);
      } catch (error) {
        
      }
    },
    setPosition(position) {
      const { longitude, latitude } = position;
      this.geoLocation.lon = longitude;
      this.geoLocation.lat = latitude;
    },
    async setCurrentWeather({ city, position }) {
      console.log({ position });
      try {
        const openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
        const fetchURL =
          `${openWeatherBaseUrl}?q=${this.getCurrentCity}&appid=${openWeatherApiKey}&units=${this.getUnit}`;
        const fetchWithCoordinates =
          `${openWeatherBaseUrl}?lat=${this.geoLocation.lat}&lon=${this.geoLocation.lon}&appid=${openWeatherApiKey}&units=${this.getUnit}`
        
        const { data } = await axios.get(
          position ? fetchWithCoordinates : fetchURL,
          {
            mode: 'no-cors',
            contentType: 'application/json',
          },
        );
        
        console.log(data);
        this.setCurrentCity({ name: data.name, country: data.sys.country });
        this.currentWeather.temperature = data.main.temp;
        this.currentWeather.humidity = data.main.humidity;
        this.currentWeather.pressure = data.main.pressure;
        this.currentWeather.date = data.dt;
        this.currentWeather.icon = data.weather[0].icon;
        this.currentWeather.description = data.weather[0].description;
        this.currentAirData.realFeel = data.main.feels_like;
        this.currentAirData.visibility = data.visibility;
        this.currentAirData.windSpeed = data.wind.speed;
        this.currentAirData.rain = data.rain['1h'] || 'N/A';
        await this.setHourlyForecast(data.coord);
        await this.setDailyForecast(data.coord);
      } catch (error) {
        
      }
    },
    async setHourlyForecast({ lat, lon }) {
      console.log({ position });
      try {
        const openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast/hourly';
        const fetchWithCoordinates =
          `${openWeatherBaseUrl}?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=${this.getUnit}`;
        
        const { data } = await axios.get(
          fetchWithCoordinates,
          {
            mode: 'no-cors',
            contentType: 'application/json',
          },
        );
        console.log({ hourly: data});
      } catch (error) {
        console.log(error)
      }
    },
    /* The `setDailyForecast` function is responsible for fetching the daily weather forecast
    data either based on the selected city or the user's current geolocation. Here's a
    breakdown of what the function does: */
    async setDailyForecast({ lat, lon }) {
      try {
        const openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily';
        const fetchWithCoordinates =
          `${openWeatherBaseUrl}?lat=${lat}&lon=${lon}&cnt=7&appid=${openWeatherApiKey}&units=${this.getUnit}`;
        const { data } = await axios.get(
          fetchWithCoordinates,
          {
            mode: 'no-cors',
            contentType: 'application/json',
          },
        );
        console.log({ daily: data });
      } catch (error) {
        console.log(error)
      }
    }
  },
});

export default useWeather;
