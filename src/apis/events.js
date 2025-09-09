import axios from 'axios';

const API_URL = 'https://islamic-sphere-backend-two.vercel.app/events';

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








const EventService = {
  // Get all events
  getEvents: async () => {
    try {
      const response = await api.get('/');
      console.log('API Response:', response.data); // Debug log
      return {
        success: response.data.success,
        data: response.data.data.map(event => ({
          ...event,
          // Ensure date is in ISO format
          date: new Date(event.date).toISOString()
        })),
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch events'
      };
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch event'
      };
    }
  },

  // Create new event (admin only)
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/', eventData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating event:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create event'
      };
    }
  },

  // Update event (admin only)
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/${id}`, eventData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating event:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update event'
      };
    }
  },

  // Delete event (admin only)
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error deleting event:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete event'
      };
    }
  },
};

export default EventService;