import React from 'react';
import './Header.scss';

const DateTimeHeader = ({ fullDate, unit, setUnit }) => (
  <header>
    <p>{fullDate}</p>
    <div>
      <button className={unit === 'metric' ? 'active' : ''} onClick={() => setUnit('metric')}>°C</button>
      <button className={unit === 'imperial' ? 'active' : ''} onClick={() => setUnit('imperial')}>°F</button>
    </div>
  </header>
);

export default DateTimeHeader;