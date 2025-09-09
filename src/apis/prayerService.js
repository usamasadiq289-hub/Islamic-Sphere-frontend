// export const getPrayerTimes = async (lat, lng) => {
//     const res = await fetch(`http://localhost:3000/api/prayer/times?lat=${lat}&lng=${lng}`);
//     if (!res.ok) throw new Error('Failed to fetch prayer times');
//     const data = await res.json();
//     return data.data.timings;
//   };

// prayerService.js
const API_BASE_URL = 'https://islamic-sphere-backend-two.vercel.app/api/prayer';

export const getPrayerTimes = async (lat, lng) => {
  try {
    // Get token from local storage
    const token = localStorage.getItem('token');

    // Set up headers with the token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await fetch(`${API_BASE_URL}/times?lat=${lat}&lng=${lng}`, config);
    const data = await response.json();
    if (data.data && data.data.timings) {
      return data.data.timings;
    }
    throw new Error('Invalid prayer times data');
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};











// Get prayer times by city & country
// export const getPrayerTimesByCity = async (city, country) => {
//   try {
//     const token = localStorage.getItem('token');
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     };

//     const response = await fetch(
//       `${API_BASE_URL}/timesByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,
//       config
//     );
//     const data = await response.json();

//     if (data.data && data.data.timings) {
//       return data.data.timings;
//     }
//     throw new Error('Invalid prayer times data');
//   } catch (error) {
//     console.error('Error fetching prayer times by city:', error);
//     throw error;
//   }
// };




export const getPrayerTimesByCity = async (city, country) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${API_BASE_URL}/timesByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (data.data && data.data.timings) {
      return data.data.timings;
    }
    throw new Error('Invalid prayer times data');
  } catch (error) {
    console.error('Error fetching prayer times by city:', error);
    throw error;
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    // Get token from local storage
    const token = localStorage.getItem('token');

    // Set up headers with the token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await fetch(`${API_BASE_URL}/reverse-geocode?lat=${lat}&lng=${lng}`, config);
    const data = await response.json();
    
    if (response.ok) {
      return data;
    }
    throw new Error(data.error || 'Failed to reverse geocode');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};
