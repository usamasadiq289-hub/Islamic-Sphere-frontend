import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/prayer-section`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const PrayerSectionService = {
  // Mark prayer as completed
  markPrayerCompleted: async (date, prayerName, location = null) => {
    try {
      const response = await api.post('/mark-completed', {
        date,
        prayerName,
        location
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Unmark prayer (set as incomplete)
  unmarkPrayer: async (date, prayerName) => {
    try {
      const response = await api.post('/unmark', {
        date,
        prayerName
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get prayer records for a specific date
  getPrayerRecordsByDate: async (date) => {
    try {
      const response = await api.get(`/records/${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get prayer records for a date range
  getPrayerRecordsByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get('/records', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get prayer statistics
  getPrayerStats: async (month = null, year = null) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;

      const response = await api.get('/stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete prayer record for a specific date
  deletePrayerRecord: async (date) => {
    try {
      const response = await api.delete(`/records/${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Helper function to get prayer completion status for multiple dates
  getPrayerCalendarData: async (weekStartDate, weekEndDate) => {
    try {
      const response = await PrayerSectionService.getPrayerRecordsByDateRange(weekStartDate, weekEndDate);
      
      // Transform the data into a format suitable for calendar display
      const calendarData = {};
      
      if (response.data?.prayerRecords) {
        response.data.prayerRecords.forEach(record => {
          calendarData[record.date] = record.prayers;
        });
      }
      
      return calendarData;
    } catch (error) {
      console.error('Error getting prayer calendar data:', error);
      return {};
    }
  },

  // Toggle prayer completion status
  togglePrayerCompletion: async (date, prayerName, isCompleted, location = null) => {
    try {
      if (isCompleted) {
        return await PrayerSectionService.unmarkPrayer(date, prayerName);
      } else {
        return await PrayerSectionService.markPrayerCompleted(date, prayerName, location);
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default PrayerSectionService;