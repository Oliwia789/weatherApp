import React from 'react';
//import './WeatherInfoCard.scss';

const WeatherInfoCard = ({ title, value, unit, children }) => {
  return (
    <div className="weather-info-card">
      <h3 className="weather-info-card__title">{title}</h3>
      <div className="weather-info-card__content">
        {value && <span className="weather-info-card__value">{value}</span>}
        {unit && <span className="weather-info-card__unit">{unit}</span>}
      </div>
      {children}
    </div>
  );
};


export default WeatherInfoCard;