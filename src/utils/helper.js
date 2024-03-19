/* eslint-disable-next-line */
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";

// Configs
export const openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5';
export const openWeatherApiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

export const getWeatherIcon =
  (icon, size = '2x') => `https://openweathermap.org/img/wn/${icon}@${size}.png`;

export const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
export const temperatureSymbol = (tempUnit) => tempUnit?.symbol + tempUnit?.name?.slice(0, 1);

export const mapAndAddHourly = (data, state) => {
  state.hourlyWeather.splice(0);

  state.hourlyWeather = data.map((item) => ({
    time: dayjs(item.dt_txt).format('hh:mm A'),
    temp: item.main.temp.toFixed(0),
    minTemp: item.main.temp_min.toFixed(0),
    maxTemp: item.main.temp_max.toFixed(0),
    icon: getWeatherIcon(item.weather[0].icon, '4x'),
    weather: item.weather[0].main
  }));
}

export const assignCurrentData = (data, state) => {
  state.currentAirData.realFeel = data.main.feels_like;
  state.currentAirData.visibility = data.visibility;
  state.currentAirData.windSpeed = data.wind.speed;
  state.currentAirData.humidity = data.main.humidity;

  state.currentWeather.temperature = data.main.temp;
  state.currentWeather.pressure = data.main.pressure;
  state.currentWeather.date = dayjs(1710852178).format('hh:mm A');
  state.currentWeather.icon = getWeatherIcon(data.weather[0].icon, '4x');
  state.currentWeather.description = data.weather[0].description;
};
