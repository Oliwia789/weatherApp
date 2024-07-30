import React from 'react';
import './WeatherInfoCard.scss';

const WeatherInfoCard = ({ title, specialClass, value, unit, children }) => {
  return (
    <div className="infoCard">
      <h2>{title}</h2>
      {value &&
      <div className={`infoCard--value ${specialClass ? specialClass : ''}`}>
      <p>{value} {unit}</p>
      </div>}
      {children}
    </div>
  );
};


export default WeatherInfoCard;