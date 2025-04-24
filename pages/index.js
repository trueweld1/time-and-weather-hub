// pages/index.js
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [city, setCity] = useState('');
  const [time, setTime] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);

    try {
      // Get coordinates from OpenCage
      const geoRes = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=YOUR_OPENCAGE_API_KEY`);
      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        throw new Error('Location not found');
      }
      const { lat, lng } = geoRes.data.results[0].geometry;

      // Get timezone and time from TimeAPI
      const timeRes = await axios.get(`https://www.timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lng}`);
      setTime(timeRes.data);

      // Get weather from OpenWeatherMap
      const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=YOUR_OPENWEATHER_API_KEY&units=imperial`);
      setWeather(weatherRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch time or weather. Please check the city name and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Time & Weather Hub</h1>
      <input
        type="text"
        placeholder="Enter a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="px-4 py-2 border border-gray-400 rounded mb-2 w-full max-w-md"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mb-4"
      >
        {loading ? 'Loading...' : 'Search'}
      </button>

      {time && (
        <div className="bg-white p-4 rounded shadow-md w-full max-w-md mb-4">
          <h2 className="text-lg font-semibold">Current Time in {city}</h2>
          <p>{time.dateTime}</p>
        </div>
      )}

      {weather && (
        <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
          <h2 className="text-lg font-semibold">Weather in {city}</h2>
          <p>{weather.weather[0].description}, {Math.round(weather.main.temp)}°F</p>
        </div>
      )}
    </div>
  );
}
