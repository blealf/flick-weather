import axios from 'axios';
import { openWeatherApiKey, openWeatherBaseUrl } from './helper';

export const useAxios = async ({ position, unit, city }) => {

  const state = {
    loading: false,
    error: null,
    data: {
      current: null,
      hourly: null,
      daily: null,
    },
  };

  const fetchHourly = async ({ lat, long}) => {
    const fetchHourly =
      `${openWeatherBaseUrl}/forecast/hourly?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=${unit}`;
    
    try {
      const { data } = await axios.get(fetchHourly, {
        mode: 'no-cors',
      });
      state.data.hourly = data;
    } catch (error) {
      state.error = error
    }
  }

  const fetchDaily = async ({ lat, long}) => {
    const fetchDaily =
      `${openWeatherBaseUrl}/forecast/daily?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=${unit}`;
    
    try {
      const { data } = await axios.get(fetchHourly, {
        mode: 'no-cors',
      });
      state.data.daily = data;
    } catch (error) {
      state.error = error;
    }
  }
  
  const fetchCurrentWithCity =
    `${openWeatherBaseUrl}/weather?q=${city}&appid=${openWeatherApiKey}&units=${unit}`;
  const fetchCurrentWithCoordinates =
    `${openWeatherBaseUrl}/weather?lat=${position.lat}&lon=${position.lon}&appid=${openWeatherApiKey}&units=${unit}`
  const fetchCurrent = position ? fetchCurrentWithCoordinates : fetchCurrentWithCity;
    
  try {
    state.loading = true;
    
    const { data } = await axios.get(fetchCurrent, {
      mode: 'no-cors',
    });
    
    const destructuredData = {
      name: city,
      dt: date,
      visibility,
      coord,
      weather,
      wind: { speed: windSpeed },
      sys: { country },
      main: { temp, humidity, pressure, feels_like: realFeel }
    };

    const currentData = {
      city,
      date,
      visibility,
      coord,
      weather,
      speed,
      country,
      temp,
      humidity,
      pressure,
      realFeel
      // rain: data?.rain && data?.rain['1h'] || 'N/A',
      // description: weather[0].description,
      // icon: weather[0].icon,
    }

    console.log(currentData);
    state.data.current = currentData;
    state.error = null;

    // await fetchHourly(coord);
    // await fetchDaily(coord);
  } catch (error) {
    state.error = error;
  }
  state.loading = false;

  return state;
}