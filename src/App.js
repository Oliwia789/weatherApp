import './App.scss';
import React, { useState, useEffect } from 'react';
import { getCoordinates } from './services/geoService';
import { fetchWeatherData } from './services/weatherService';
import WeatherInfoCard from './components/WeatherInfoCard/WeatherInfoCard';
import AsideInfoSection from './components/AsideInfoSection/AsideInfoSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime, formatSunTimes } from './utils/dateUtils';

function App() {

  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [sunTimes, setSunTimes] = useState({ sunriseTime: '', sunsetTime: '' });

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          error => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  };
  
  const test = async () => {
    try {
      //const zip = 'Perreux sur marne'; 
      //const { lat, lon } = await getCoordinates(zip);
      const { lat, lon } = await getUserLocation();
      const weatherData = await fetchWeatherData(lat, lon);
      setWeatherData(weatherData);
      const { sunrise, sunset } = weatherData.sys;
      const sunTimes = formatSunTimes(sunrise, sunset);
      setSunTimes(sunTimes);
      console.log(weatherData)
    } catch (error) {
      console.error('Error getting coordinates by zip:', error);
    }
  };

  const [fullDate, setFullDate] = useState('');

  useEffect(() => {
    const { fullDate } = formatDateTime();
    setFullDate(fullDate);
  }, []);
  
  useEffect(() => {
    test();
  }, []);
  
  const sunContent = (
    <div className='sunContent'>
      <div><FontAwesomeIcon icon={faArrowUp} /> <p>{sunTimes.sunriseTime}</p></div>
      <div><FontAwesomeIcon icon={faArrowDown} /> <p>{sunTimes.sunsetTime}</p></div>
    </div>
  );

  const formatTemperature = (temp) => Math.floor(temp);

  const formatVisibility = (visibility) => {
    return Math.floor((visibility / 1000).toFixed(1)); 
  };
  
  const weatherInfoData = [
    { title: 'Température maximale', value: weatherData ? formatTemperature(weatherData.main.temp_max) : 'N/A', unit: '°C', specialClass: "singleElement" },
    { title: 'Température minimale', value: weatherData ? formatTemperature(weatherData.main.temp_min) : 'N/A', unit: '°C', specialClass: "singleElement" },
    { title: 'Lever & Coucher du soleil', extraContent: sunContent },
    { title: 'Humidité', value: weatherData?.main?.humidity || 'N/A', unit: '%', extraContent: <><div className='jauge'><span></span></div><div>😐 Normal</div></> },
    { title: 'Vent', value: weatherData?.wind?.speed || 'N/A', unit: 'km/h', extraContent: <div className='compass'><FontAwesomeIcon icon={faLocationArrow} /> WSW</div> },
    { title: 'Visibilité', value: weatherData ? formatVisibility(weatherData.visibility) : 'N/A', unit: 'km', extraContent: <span>🙂 Parfaite</span> },
  
  ];


  return (
    <div className="App">
      {weatherData ? (
        <>
        <AsideInfoSection place={weatherData.name} degree={formatTemperature(weatherData.main.temp)} perception={formatTemperature(weatherData.main.feels_like)} weather={weatherData.weather[0].main}/>
        <div className='mainSection'>
          <header>
            <p>{fullDate}</p>
            <div>
              <button className='active'>°C</button>
              <button>°F</button>
            </div>
          </header>
          <h1>Conditions Météo</h1>
          <div className='weatherContainer'>
          {weatherInfoData.map((info, index) => (
              <WeatherInfoCard key={index} title={info.title} value={info.value} unit={info.unit} specialClass={info.specialClass}>
                {info.extraContent}
              </WeatherInfoCard>
            ))}
          </div>
  
        </div>
        </>
      )
      :
      (
        <p>Chargement des données météo...</p>
      )

      }
    </div>
  );
}

export default App;
