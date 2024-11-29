import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { MapView } from './components/MapView';
import { SearchList } from './components/RecentSearches';
import { Location } from './services/geocoding';
import { WeatherData, getWeather } from './services/weather';

function App() {
  const [recentSearches, setRecentSearches] = useState<string[]>(['London']);
  const [popularPlaces] = useState(['London']);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const handleSearch = async (location: Location) => {
    setSelectedLocation(location);
    
    // Update recent searches
    setRecentSearches(prev => {
      const newSearches = [location.name, ...prev.filter(s => s !== location.name)];
      return newSearches.slice(0, 5);
    });

    // Fetch weather data
    try {
      const weatherData = await getWeather(location.latitude, location.longitude);
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#4287f5] p-6">
      <SearchBar onSearch={handleSearch} />
      
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-[1fr,1.5fr,1fr] gap-6">
        <div className="space-y-6">
          <WeatherCard
            title={selectedLocation?.name || "Select a location"}
            temperature={weather ? `${weather.current.temperature}°C` : '--'}
            windSpeed={weather ? `${weather.current.windSpeed} km/h` : '--'}
            humidity={weather ? `${weather.current.humidity}%` : '--'}
            uvIndex={weather ? `${weather.current.uvIndex}` : '--'}
          />
        </div>

        <MapView 
          center={selectedLocation ? [selectedLocation.longitude, selectedLocation.latitude] : undefined}
        />

        <div className="space-y-6">
          <SearchList title="Recent Searches" locations={recentSearches} />
          <SearchList title="Most Searched Places" locations={popularPlaces} />
        </div>
      </div>
    </div>
  );
}

export default App;