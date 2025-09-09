import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://islamic-sphere-backend-two.vercel.app';
const API_URL = `${API_BASE}/api/stream`;

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

const StreamService = {
  // Get Stream token and user info
  getStreamToken: async () => {
    try {
      const response = await api.post('/token');
      return response.data;
    } catch (error) {
      console.error('Get stream token error:', error);
      throw error.response?.data || { message: 'Failed to get stream token' };
    }
  },

  // Create group channel
  createGroupChannel: async (groupId, groupName, memberIds) => {
    try {
      const response = await api.post('/channel', {
        groupId,
        groupName,
        memberIds
      });
      return response.data;
    } catch (error) {
      console.error('Create channel error:', error);
      throw error.response?.data || { message: 'Failed to create channel' };
    }
  },
};

export default StreamService;
