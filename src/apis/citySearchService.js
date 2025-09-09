export const searchCities = async (query) => {
  if (!query) return [];

  const apiKey = process.env.REACT_APP_GEOAPIFY_KEY;
  
  if (!apiKey) {
    console.error('REACT_APP_GEOAPIFY_KEY is not defined in environment variables');
    return [];
  }

  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=city&limit=5&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`Geoapify API Error: ${res.status} ${res.statusText}`, errorData);
      return [];
    }
    
    const data = await res.json();

    if (!data.features || !Array.isArray(data.features)) {
      console.error('Invalid response structure from Geoapify API:', data);
      return [];
    }

    return data.features.map(f => ({
      city: f.properties.city || f.properties.name,
      country: f.properties.country,
      lat: f.properties.lat,
      lon: f.properties.lon
    })).filter(city => city.city && city.country); // Filter out invalid entries
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
};
