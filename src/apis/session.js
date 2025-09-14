import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/sessions`;  // Adjust this URL based on your backend API endpoint

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const SessionService = {
  // Get all sessions
  getSessions: async () => {
    try {
      const response = await api.get('/');
      return {
        success: response.data.success,
        data: response.data.data, // Only the array of sessions
        message: response.data.message || 'Sessions fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch sessions'
      };
    }
  },
  // Get a session by ID
  getSessionById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Session fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching session:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch session'
      };
    }
  },
  // Create a new session
  createSession: async (sessionData) => {
    try {
      const response = await api.post('/', sessionData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Session created successfully'
      };
    } catch (error) {
      console.error('Error creating session:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create session'
      };
    }
  },
  // Update a session
  updateSession: async (id, sessionData) => {
    try {
      const response = await api.put(`/${id}`, sessionData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Session updated successfully'
      };
    } catch (error) {
      console.error('Error updating session:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update session'
      };
    }
  },
  // Delete a session
  deleteSession: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return {
        success: response.data.success,
        message: response.data.message || 'Session deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting session:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete session'
      };
    }
  },
  // Fetch session count
  getSessionCount: async () => {
    const response = await api.get('/count');
    return response.data.count;
  },
};
export default SessionService;