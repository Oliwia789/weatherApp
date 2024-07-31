import clear from "../assets/weather/clear.svg";
import clearNight from "../assets/weather/clearNight.svg";
import clouds from "../assets/weather/clouds.svg";
import cloudsNight from "../assets/weather/cloudsNight.svg";
import drizzle from "../assets/weather/drizzle.svg";
import rain from "../assets/weather/rain.svg";
import snow from "../assets/weather/snow.svg";
import thunderstorm from "../assets/weather/thunderstorm.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';

export const isNight = (sunset) => {
  const currentTime = Math.floor(Date.now() / 1000); 
  return currentTime > sunset;
};

export const getWeatherImage = (weather, sunset) => {
  const night = isNight(sunset);
  const weatherImages = {
    Thunderstorm: thunderstorm,
    Drizzle: drizzle,
    Rain: rain,
    Snow: snow,
    Clouds: night ? cloudsNight : clouds,
    Clear: night ? clearNight : clear,
  };
  return weatherImages[weather] || clear;
};

export const getWeatherEmoji = (weather, sunset) => {
  const night = isNight(sunset);
  const weatherEmojis = {
    Thunderstorm: '⛈️',
    Drizzle: '🌦️',
    Rain: '🌧️',
    Snow: '❄️',
    Clouds: '☁️',
    Clear: night ? '🌕' : '☀️',
  };
  return weatherEmojis[weather] || '☀️';
};

export const formatTemperature = (temp) => Math.floor(temp);

export const formatVisibility = (visibility) => {
    return Math.floor((visibility / 1000).toFixed(1)); 
};

export const renderHumidity = (humidity) => {
  if (humidity == null) return <>N/A</>;

  const position = Math.min((humidity / 100) * 75, 75);
  let description = 'Normal';
  let emoji = '🤙';

  if (humidity > 75) {
    description = 'Humide';
    emoji = '💧';
  } else if (humidity < 30) {
    description = 'Sec';
    emoji = '🌵';
  }

  return (
    <>
      <div className='metric'>
        <span style={{ bottom: `${position}%` }}></span>
      </div>
      <div>{emoji} {description}</div>
    </>
  );
};

export const renderWind = (deg) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  const direction = directions[index];

  return (
    <div className='compass'>
      <FontAwesomeIcon icon={faLocationArrow} style={{ transform: `rotate(${deg}deg)` }} />
      {direction}
    </div>
  );
};

export const renderVisibility = (visibility) => {
  if (visibility == null) return <>N/A</>;

  let description = 'Bonne';
  let emoji = '🙂';

  if (visibility < 1000) {
    description = 'Mauvaise';
    emoji = '☹️';
  } else if (visibility < 5000) {
    description = 'Moyenne';
    emoji = '😐';
  }

  return (
    <span>{emoji} {description}</span>
  );
};

