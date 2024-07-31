import React, { useState, useEffect } from 'react';
import "./AsideInfoSection.scss";
import city from "../../assets/city.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPerson, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { formatDateTime } from '../../utils/dateUtils';
import { getWeatherImage, getWeatherEmoji } from '../../utils/weatherUtils';

const AsideInfoSection = ({degree, perception,place, weather, weatherDescr, sunset, unit, onSearchGeoLocation, onSearchLocation, searchError}) => {

  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState();

  const handleSearchGeoLocation = () => {
    onSearchGeoLocation();
    setError('');
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const updateDateTime = () => {
      const { time: currentTime } = formatDateTime();
      const { day } = formatDateTime();
      setDay(day);
      setTime(currentTime);
    };
    
    updateDateTime(); 
    const intervalId = setInterval(updateDateTime, 30000); 
    return () => clearInterval(intervalId);
  }, []);

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
      e.preventDefault(); 
      handleSearchLocation();
    }
  };


  return (
    <aside className='asideSection'>
        <div>
          <div className='asideSection--search'>
            <input placeholder='Ville ou code postal' value={searchQuery} onChange={handleSearchInput} onKeyDown={handleKeyDown}></input>
            <div>
                <button onClick={handleSearchLocation} aria-label="Utiliser la localisation actuelle"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                <button onClick={handleSearchGeoLocation} aria-label="Rechercher une ville"><FontAwesomeIcon icon={faLocationCrosshairs} /></button>
            </div>
          </div>
          {(error || searchError) && <p className='asideSection--search--error'>{error || searchError}</p>}
        </div>
        <div className='asideSection--img'>
          <img src={getWeatherImage(weather, sunset)} alt={`Weather: ${weather}`}/>
        </div>
        <div className='asideSection--info'>
          <p className='asideSection--info--degree'>{degree}{unit === 'metric' ? '°C' : '°F'}</p>
          <p className='asideSection--info--day'>{day}, <span>{time}</span></p>
          <hr/>
          <div className='asideSection--info--weather'><div>{getWeatherEmoji(weather, sunset)}</div> {weatherDescr}</div>
          <div className='asideSection--info--weather'><div><FontAwesomeIcon icon={faPerson} /></div> Ressenti : {perception}{unit === 'metric' ? '°C' : '°F'}</div>
        </div>
        <div className='asideSection--city'>
            <img src={city} alt='City'/>
            <div className='asideSection--city--overlay'></div>
          <p>{place}</p>
        </div>
    </aside>
  );
};


export default AsideInfoSection;