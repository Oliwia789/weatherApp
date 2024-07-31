import React from 'react';
import './WeatherSection.scss';
import { formatTemperature, renderHumidity, renderWind, renderVisibility, formatVisibility } from '../../utils/weatherUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import WeatherInfoCard from '../WeatherInfoCard/WeatherInfoCard';

const WeatherSection = ({ weatherData, unit, sunTimes }) => {

  const sunContent = (
    <div className='sunContent'>
      <div><FontAwesomeIcon icon={faArrowUp} /> <p>{sunTimes.sunriseTime}</p></div>
      <div><FontAwesomeIcon icon={faArrowDown} /> <p>{sunTimes.sunsetTime}</p></div>
    </div>
  );

  const weatherInfoData = [
    { title: 'Température maximale', value: weatherData ? formatTemperature(weatherData.main.temp_max) : 'N/A', unit: unit === 'metric' ? '°C' : '°F', specialClass: "singleElement" },
    { title: 'Température minimale', value: weatherData ? formatTemperature(weatherData.main.temp_min) : 'N/A', unit: unit === 'metric' ? '°C' : '°F', specialClass: "singleElement" },
    { title: 'Lever & Coucher du soleil', extraContent: sunContent },
    { 
      title: 'Humidité', 
      value: weatherData?.main?.humidity || 'N/A', 
      unit: '%', 
      extraContent: renderHumidity(weatherData?.main?.humidity) 
    },
    { 
      title: 'Vent', 
      value: weatherData?.wind?.speed || 'N/A', 
      unit: unit === 'metric' ? 'km/h' : 'mph', 
      extraContent: renderWind(weatherData?.wind?.deg) 
    },
    { 
      title: 'Visibilité', 
      value: weatherData ? formatVisibility(weatherData.visibility) : 'N/A', 
      unit: 'km', 
      extraContent: renderVisibility(weatherData?.visibility) 
    },
  ];

  return (
    <>
      <h1>Conditions Météo</h1>
      <div className='weatherContainer'>
        {weatherInfoData.map((info, index) => (
          <WeatherInfoCard key={index} title={info.title} value={info.value} unit={info.unit} specialClass={info.specialClass}>
            {info.extraContent}
          </WeatherInfoCard>
        ))}
      </div>
    </>
  );
};

export default WeatherSection;