/* eslint-disable-next-line */
export const getWeatherIcon =
  (icon, size = '2x') => `https://openweathermap.org/img/wn/${icon}@${size}.png`;

export const openWeatherApiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
export const ninjaApiKey = import.meta.env.VITE_NINJA_API_KEY;
