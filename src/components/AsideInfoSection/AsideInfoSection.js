import React, { useState, useEffect } from 'react';
import "./AsideInfoSection.scss";
import clear from "../../assets/weather/clear.svg";
import clearNight from "../../assets/weather/clearNight.svg";
import clouds from "../../assets/weather/clouds.svg";
import cloudsNight from "../../assets/weather/cloudsNight.svg";
import drizzle from "../../assets/weather/drizzle.svg";
import rain from "../../assets/weather/rain.svg";
import snow from "../../assets/weather/snow.svg";
import thunderstorm from "../../assets/weather/thunderstorm.svg";

import city from "../../assets/city.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPerson, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { formatDateTime } from '../../utils/dateUtils';

const AsideInfoSection = ({degree, perception,place, weather, weatherDescr, sunset, unit, onSearchGeoLocation, onSearchLocation}) => {


  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearchGeoLocation = () => {
    console.log("click")
    onSearchGeoLocation();
  };

  useEffect(() => {
    const updateDateTime = () => {
      const { time: currentTime } = formatDateTime();
      const { day } = formatDateTime();
      setDay(day);
      setTime(currentTime);
    };
    
    updateDateTime(); // Initial update
    const intervalId = setInterval(updateDateTime, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  const isNight = () => {
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    return currentTime > sunset;
  };

  const getWeatherImage = (weather) => {
    const night = isNight();
    switch (weather) {
      case 'Thunderstorm':
        return thunderstorm;
      case 'Drizzle':
        return drizzle;
      case 'Rain':
        return rain;
      case 'Snow':
        return snow;
      case 'Clouds':
        return night ? cloudsNight : clouds;
      case 'Clear':
        return night ? clearNight : clear;
      default:
        return clear;
    }
  };

  const getWeatherEmoji = (weather) => {
    const night = isNight();
    switch (weather) {
      case 'Thunderstorm':
        return '⛈️';
      case 'Drizzle':
        return '🌦️';
      case 'Rain':
        return '🌧️';
      case 'Snow':
        return '❄️';
      case 'Clouds':
        return '☁️';
      case 'Clear':
        return night ? '🌕' : '☀️';
      default:
        return '☀️';
    }
  };

  const handleSearchInput = (e) => {
    console.log(e.target.value)
    setSearchQuery(e.target.value);
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) {
      setError('Veuillez entrer le nom de la ville ou le code postal.');
      return;
    }
    setError('');

    try {
      await onSearchLocation(searchQuery);
      setSearchQuery('');
    } catch (err) {
      setError('Erreur lors de la recherche. Veuillez vérifier le nom de la ville ou le code postal.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Empêche le défilement de la page lors de l'appui sur la touche "Espace"
      handleSearchLocation();
    }
  };


  return (
    <aside className='asideSection'>
        <div>
          <div className='asideSection--search'>
            <input placeholder='Rechercher' value={searchQuery}
            onChange={handleSearchInput} onKeyDown={handleKeyDown}></input>
            <div>
                <button onClick={handleSearchLocation}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                <button onClick={handleSearchGeoLocation}><FontAwesomeIcon icon={faLocationCrosshairs} /></button>
            </div>
          </div>
          <span className='asideSection--search--error'>Erreur</span>
        </div>
        <div className='asideSection--img'>
          <img src={getWeatherImage(weather)} alt="weather icon"/>
        </div>
        <div className='asideSection--info'>
          <p className='asideSection--info--degree'>{degree}{unit === 'metric' ? '°C' : '°F'}</p>
          <p className='asideSection--info--day'>{day}, <span>{time}</span></p>
          <hr/>
          <p className='asideSection--info--weather'><div>{getWeatherEmoji(weather)}</div> {weatherDescr}</p>
          <p className='asideSection--info--weather'><div><FontAwesomeIcon icon={faPerson} /></div> Ressenti : {perception}{unit === 'metric' ? '°C' : '°F'}</p>
        </div>
        <div className='asideSection--city'>
            <img src={city}/>
            <div className='asideSection--city--overlay'></div>
          <p>{place}</p>
        </div>
    </aside>
  );
};


export default AsideInfoSection;