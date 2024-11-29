export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(`http://localhost:5000/weather`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ location: query })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    // Convert Flask response to Location interface format
    return [{
      name: data.location,
      latitude: data.data.latitude,
      longitude: data.data.longitude,
      country: '', // Flask API doesn't provide this info
      admin1: undefined
    }];
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}