import React from 'react';
import "./AsideInfoSection.scss";
import sunny from "../../assets/weather/sunny.svg"
import city from "../../assets/city.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPerson } from '@fortawesome/free-solid-svg-icons'

const AsideInfoSection = () => {
  return (
    <aside className='asideSection'>
        <div>
          <div className='asideSection--search'>
            <input placeholder='Rechercher'></input>
            <div>
                <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
            </div>
          </div>
          <span className='asideSection--search--error'>Erreur</span>
        </div>
        <div className='asideSection--img'>
          <img src={sunny}/>
        </div>
        <div className='asideSection--info'>
          <p className='asideSection--info--degree'>12°C</p>
          <p className='asideSection--info--day'>Lundi, <span>11:23</span></p>
          <hr/>
          <span className='asideSection--info--perceived'><FontAwesomeIcon icon={faPerson} /> Ressenti - 11°C</span>
        </div>
        <div className='asideSection--city'>
            <img src={city}/>
            <div className='asideSection--city--overlay'></div>
          <p>Montmorency</p>
        </div>
    </aside>
  );
};


export default AsideInfoSection;