import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';

import { getCoordinates } from '../../services/geoService';
import { fetchWeatherData } from '../../services/weatherService';
import { formatDateTime, formatSunTimes } from '../../utils/dateUtils';
import { formatTemperature } from '../../utils/weatherUtils';
import { useUnit, UnitProvider } from '../../contexts/UnitContext';

import WeatherSection from '../WeatherSection/WeatherSection';
import AsideInfoSection from '../AsideInfoSection/AsideInfoSection';
import DateTimeHeader from '../Header/Header';

function App() {

  const { unit, setUnit } = useUnit();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [sunTimes, setSunTimes] = useState({ sunriseTime: '', sunsetTime: '' });
  const [fullDate, setFullDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchedCity, setSearchedCity] = useState('');

  const fetchWeather = useCallback(async (lat, lon) => {
    try {
      const data = await fetchWeatherData(lat, lon, unit);
      setWeatherData(data);
      const { sunrise, sunset } = data.sys;
      setSunTimes(formatSunTimes(sunrise, sunset));
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Erreur lors du chargement des données météo.');
    } 
  }, [unit]);

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

  const fetchWeatherForParis = useCallback(async () => {
    try {
      const parisCoordinates = { lat: 48.8566, lon: 2.3522 }; 
      await fetchWeather(parisCoordinates.lat, parisCoordinates.lon);
    } catch (error) {
      console.error('Error fetching weather data for Paris:', error);
      setError('Erreur lors du chargement des données météo.'); 
    }
  }, [fetchWeather]);

  const getWeatherByLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { lat, lon } = await getUserLocation();
      await fetchWeather(lat, lon);
      setSearchError('')
    } catch (error) {
      console.error('Error getting user location:', error);
      setSearchError('Erreur lors de la géolocalisation.');
      fetchWeatherForParis();
    }
  };

  const getWeatherByTown = async (query) => {
    setSearchedCity(query);
    try {
      const { lat, lon } = await getCoordinates(query);
      await fetchWeather(lat, lon);
      setSearchError('')
    } catch (error) {
      console.error('Error getting coordinates by city or postal code :', error);
      setSearchError('Erreur lors de la recherche. Veuillez vérifier le nom de la ville ou le code postal.');
    }
  };

  useEffect(() => {
    const { fullDate } = formatDateTime();
    setFullDate(fullDate);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        if (searchedCity) {
          const { lat, lon } = await getCoordinates(searchedCity);
          await fetchWeather(lat, lon);
        } else {
          const { lat, lon } = await getUserLocation();
          await fetchWeather(lat, lon);
        }
      } catch (error) {
        console.error('Error getting user location:', error);
        fetchWeatherForParis()
      }
    };
    fetchInitialData();
  }, [unit, searchedCity, fetchWeather, fetchWeatherForParis]);

  return (
    <div className={`App ${loading ? 'loading' : ''}`}>
      {loading && <div className="loader"><div></div></div>}
      {error && <p className="error-message">{error}</p>}
      <AsideInfoSection
        place={weatherData && weatherData.name}
        degree={weatherData ? formatTemperature(weatherData.main.temp) : ''}
        perception={weatherData ? formatTemperature(weatherData.main.feels_like) : ''}
        weather={weatherData?.weather[0]?.main}
        weatherDescr={weatherData?.weather[0]?.description}
        sunset={weatherData?.sys?.sunset}
        unit={unit}
        onSearchGeoLocation={getWeatherByLocation}
        onSearchLocation={getWeatherByTown}
        searchError={searchError} 
      />
      <div className='mainSection'>
        <DateTimeHeader fullDate={fullDate} unit={unit} setUnit={setUnit} />
        <WeatherSection weatherData={weatherData && weatherData} unit={unit} sunTimes={sunTimes} />
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <UnitProvider>
    <App />
  </UnitProvider>
);

export default AppWrapper;
