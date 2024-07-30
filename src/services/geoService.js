import axios from 'axios';

const BASE_URL = 'https://api-adresse.data.gouv.fr/search/';

export const getCoordinates = async (search) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: search,
        limit: 1, 
      }
    });
    const data = response.data.features;
    if (data.length > 0) {
        const coordinates = data[0].geometry.coordinates;
        return {
          lat: coordinates[1],
          lon: coordinates[0],
        };
    } else {
        throw new Error('No results found');
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des coordonnées par ville", error);
    throw error;
  }
};