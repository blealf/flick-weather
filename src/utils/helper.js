/* eslint-disable-next-line */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Configs
export const openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5';
export const openWeatherApiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
export const appTitle = import.meta.env.VITE_APP_TITLE;

export const getWeatherIcon = (icon, size = '2x') => `https://openweathermap.org/img/wn/${icon}@${size}.png`;

export const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
export const temperatureSymbol = (tempUnit) => tempUnit.symbol + tempUnit.name.slice(0, 1);

const assignItem = (item, timeFormat) => ({
  time: dayjs(item.dt_txt).format(timeFormat),
  temp: item.main.temp.toFixed(0),
  minTemp: item.main.temp_min.toFixed(0),
  maxTemp: item.main.temp_max.toFixed(0),
  icon: getWeatherIcon(item.weather[0].icon, '4x'),
  weather: item.weather[0].main,
});

export const mapAndAddHourly = (data, state) => {
  state.hourlyWeather = data.map((item) => (assignItem(item, 'hh:mm A')));
};

export const mapAndAddDaily = async ({ dt, timezone }, data, state) => {
  const currentDate = dayjs(new Date((dt + timezone) * 1000)).format('hh mm A');
  const splitDate = currentDate.split(' ');
  const timeToTwelve = (12 - Number(splitDate[0])
   + (Math.floor(59 / splitDate[1]))
   + (splitDate[2] === 'AM' ? 12 : 0));

  const firstSplice = Math.floor((timeToTwelve) / 3) - 1;
  const nextSplice = firstSplice + 7;

  const dailyWeather = [...data.splice(0, 1), ...data.splice(firstSplice, 1)];
  for (let i = nextSplice - 1; i < data.length; i += (nextSplice - 1)) {
    dailyWeather.push(...data.splice(i, 1));
  }

  state.dailyWeather = await dailyWeather.map((item) => (assignItem(item, 'ddd - hh:mm A')));
};

export const assignCurrentData = (data, state) => {
  state.currentAirData.realFeel = data.main.feels_like.toFixed(0);
  state.currentAirData.visibility = data.visibility;
  state.currentAirData.windSpeed = data.wind.speed;
  state.currentAirData.humidity = data.main.humidity;

  const currentDate = dayjs(new Date((data.dt + data.timezone) * 1000)).format('hh:mm A');
  state.currentWeather.temperature = data.main.temp.toFixed(0);
  state.currentWeather.pressure = data.main.pressure;
  state.currentWeather.date = currentDate;
  state.currentWeather.icon = getWeatherIcon(data.weather[0].icon, '4x');
  state.currentWeather.description = data.weather[0].description;
};
