import axios from 'axios';
import env from "react-dotenv";

const API_KEY = env.API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeatherData = async (lat, lon, unit = "metric") => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: unit,
        lang: "fr"
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données météorologiques", error);
    throw error;
  }
};