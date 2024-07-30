import './App.scss';
import { getCoordinates } from './services/geoService';
import { fetchWeatherData } from './services/weatherService';
import WeatherInfoCard from './components/WeatherInfoCard/WeatherInfoCard';
import AsideInfoSection from './components/AsideInfoSection/AsideInfoSection';

const test = async () => {
  try {
    const zip = 'Perreux sur marne'; 
    const { lat, lon } = await getCoordinates(zip);
    const weatherData = await fetchWeatherData(lat, lon);
    console.log('Weather Data:', weatherData);

  } catch (error) {
    console.error('Error getting coordinates by zip:', error);
  }
};

test()

function App() {
  return (
    <div className="App">
      <AsideInfoSection/>
      <div className='mainSection'>
        <header>
          <p>30 Juillet 2024</p>
          <div>
            <button>C</button>
            <button>F</button>
          </div>
        </header>
        <div>
          <WeatherInfoCard title="un titre" value="12" unit="%">
            <span>Je test</span>
            bonjour
          </WeatherInfoCard>
        </div>

      </div>
    </div>
  );
}

export default App;
