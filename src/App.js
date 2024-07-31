import './App.scss';
import React, { useState, useEffect } from 'react';
import { getCoordinates } from './services/geoService';
import { fetchWeatherData } from './services/weatherService';
import WeatherInfoCard from './components/WeatherInfoCard/WeatherInfoCard';
import AsideInfoSection from './components/AsideInfoSection/AsideInfoSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime, formatSunTimes } from './utils/dateUtils';
import { useUnit, UnitProvider } from './contexts/UnitContext';

function App() {

  const { unit, setUnit } = useUnit();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [sunTimes, setSunTimes] = useState({ sunriseTime: '', sunsetTime: '' });

  console.log(unit)

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

  const searchLocation = async (query) => {
    try {
      const { lat, lon } = await getCoordinates(query);
      await fetchWeather(lat, lon);
    } catch (error) {
      console.error('Error getting coordinates by city or postal code:', error);
      setError('Erreur lors de la recherche. Veuillez vérifier le nom de la ville ou le code postal.');
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const weatherData = await fetchWeatherData(lat, lon, unit);
      setWeatherData(weatherData);
      const { sunrise, sunset } = weatherData.sys;
      const sunTimes = formatSunTimes(sunrise, sunset);
      setSunTimes(sunTimes);
      console.log(weatherData)
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleSearchGeoLocation = async () => {
    try {
      const { lat, lon } = await getUserLocation();
      console.log(lat, lon)
      await fetchWeather(lat, lon);
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  const [fullDate, setFullDate] = useState('');

  useEffect(() => {
    const { fullDate } = formatDateTime();
    setFullDate(fullDate);
  }, []);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { lat, lon } = await getUserLocation();
        await fetchWeather(lat, lon);
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };
    fetchInitialData();
  }, [unit]);
  
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

  const renderHumidity = (humidity) => {
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
        <div className='jauge'>
          <span style={{ bottom: `${position}%` }}></span>
        </div>
        <div>{emoji} {description}</div>
      </>
    );
  };
  
  const renderWind = (deg) => {
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
  
  const renderVisibility = (visibility) => {
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
    <div className="App">
      {weatherData ? (
        <>
        <AsideInfoSection place={weatherData.name} degree={formatTemperature(weatherData.main.temp)} perception={formatTemperature(weatherData.main.feels_like)} weather={weatherData.weather[0].main} weatherDescr={weatherData.weather[0].description} sunset={weatherData.sys.sunset} unit={unit} onSearchGeoLocation={handleSearchGeoLocation} onSearchLocation={searchLocation}/>
        <div className='mainSection'>
          <header>
            <p>{fullDate}</p>
            <div>
              <button className={unit === 'metric' ? 'active' : ''} onClick={() => setUnit('metric')}>°C</button>
              <button className={unit === 'imperial' ? 'active' : ''} onClick={() => setUnit('imperial')}>°F</button>
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

const AppWrapper = () => (
  <UnitProvider>
    <App />
  </UnitProvider>
);

export default AppWrapper;
