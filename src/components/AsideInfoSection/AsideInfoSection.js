import React, { useState, useEffect } from 'react';
import "./AsideInfoSection.scss";
import sunny from "../../assets/weather/sunny.svg"
import city from "../../assets/city.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPerson, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { formatDateTime } from '../../utils/dateUtils';

const AsideInfoSection = ({degree, perception,place, weather}) => {


  const [day, setDay] = useState('');
  const [time, setTime] = useState('');

  console.log(weather)

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


  return (
    <aside className='asideSection'>
        <div>
          <div className='asideSection--search'>
            <input placeholder='Rechercher'></input>
            <div>
                <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                <button><FontAwesomeIcon icon={faLocationCrosshairs} /></button>
            </div>
          </div>
          <span className='asideSection--search--error'>Erreur</span>
        </div>
        <div className='asideSection--img'>
          <img src={sunny}/>
        </div>
        <div className='asideSection--info'>
          <p className='asideSection--info--degree'>{degree}°C</p>
          <p className='asideSection--info--day'>{day}, <span>{time}</span></p>
          <hr/>
          <span className='asideSection--info--perceived'><FontAwesomeIcon icon={faPerson} /> Ressenti - {perception}°C</span>
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