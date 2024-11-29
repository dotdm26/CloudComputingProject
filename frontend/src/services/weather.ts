export interface WeatherData {
  current: {
    temperature: number;
    windSpeed: number;
    humidity: number;
    uvIndex: number;
  };
}

export async function getWeather(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    // Get latest weather data for this location
    const response = await fetch(`http://localhost:5000/weather`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location: `${latitude},${longitude}`
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    return {
      current: {
        temperature: Math.round(data.data.current.temperature_2m),
        windSpeed: Math.round(data.data.current.wind_speed_10m),
        humidity: Math.round(data.data.hourly.relative_humidity_2m[0]),
        uvIndex: 0 // API doesn't provide UV index
      }
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}