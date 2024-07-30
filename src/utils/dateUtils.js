export const formatDateTime = () => {
    const now = new Date();
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    const optionsFullDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const optionsDay = {weekday: 'long'}
  
    return {
      time: now.toLocaleTimeString('fr-FR', optionsTime),
      fullDate: now.toLocaleDateString('fr-FR', optionsFullDate),
      day: now.toLocaleDateString('fr-FR', optionsDay)
    };
  };

  export const formatSunTimes = (sunrise, sunset) => {
    const formatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
  
    const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString('fr-FR', formatOptions);
    const sunsetTime = new Date(sunset * 1000).toLocaleTimeString('fr-FR', formatOptions);
  
    return {
      sunriseTime,
      sunsetTime
    };
  };