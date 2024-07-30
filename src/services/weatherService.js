import axios from 'axios';

const API_KEY = 'bfb2520eea1316d617e6363687d72d8f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données météorologiques", error);
    throw error;
  }
};