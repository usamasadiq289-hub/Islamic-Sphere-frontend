import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/chat`;

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

const ChatService = {
  // Send message and get AI response
  sendMessage: async (message) => {
    try {
      const response = await api.post('/message', { message });
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error.response?.data || { message: 'Failed to send message' };
    }
  },

  // Get chat history for the user
  getChatHistory: async () => {
    try {
      const response = await api.get('/history');
      return response.data;
    } catch (error) {
      console.error('Get chat history error:', error);
      throw error.response?.data || { message: 'Failed to retrieve chat history' };
    }
  },
};

export default ChatService;
