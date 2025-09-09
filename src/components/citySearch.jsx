import React, { useState, useEffect, useCallback, useRef } from 'react';
import { searchCities } from '../apis/citySearchService';
import { getPrayerTimesByCity } from '../apis/prayerService';

export default function CityPrayerSearch({ onShowPrayerTimes }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  // Effect to handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (searchQuery) => {
      if (searchQuery.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const cities = await searchCities(searchQuery);
        setResults(cities);
        if (cities.length === 0 && searchQuery.length >= 2) {
          setError('No cities found. Try a different search term.');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search cities. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounce effect - wait 500ms after user stops typing
  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setError('');
      setLoading(false);
      return;
    }

    if (query.length < 2) {
      setResults([]);
      setError('');
      setLoading(false);
      return;
    }

    setLoading(true); // Show loading immediately
    const timeoutId = setTimeout(() => {
      debouncedSearch(query);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [query, debouncedSearch]);

  const handleInputChange = (value) => {
    setQuery(value);
    setError(''); // Clear previous errors immediately
  };

  const handleCitySelect = async (city) => {
    try {
      setLoading(true);
      setError('');
      const times = await getPrayerTimesByCity(city.city, city.country);
      onShowPrayerTimes(city.city, city.country, times);
      setResults([]);
      setQuery(`${city.city}, ${city.country}`);
    } catch (error) {
      setError('Could not fetch prayer times for this city.');
      console.error('Error fetching prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search city for prayer times..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#055160] focus:border-transparent"
      />

      {loading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 p-2 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#055160]"></div>
            Searching cities...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-full left-0 right-0 bg-red-50 border border-red-200 rounded-lg mt-1 p-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {results.length > 0 && !loading && (
        <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto z-50 shadow-lg">
          {results.map((city, idx) => (
            <li 
              key={idx} 
              onClick={() => handleCitySelect(city)}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors text-[#055160]"
            >
              <div className="font-medium">{city.city}</div>
              <div className="text-sm text-gray-500">{city.country}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
