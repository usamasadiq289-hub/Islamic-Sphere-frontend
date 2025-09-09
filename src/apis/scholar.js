import axios from 'axios';

const API_URL = 'http://localhost:3000/scholars'; // Adjust if your backend runs on a different port

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const ScholarService = {
  // Get all scholars
  getScholars: async () => {
    try {
      const response = await api.get('/');
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Scholars fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching scholars:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch scholars'
      };
    }
  },
  // Get a scholar by ID
  getScholarById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Scholar fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching scholar:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch scholar'
      };
    }
  },
  // Create a new scholar
  createScholar: async (scholarData) => {
    try {
      const response = await api.post('/', scholarData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Scholar created successfully'
      };
    } catch (error) {
      console.error('Error creating scholar:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create scholar'
      };
    }
  },
  // Update a scholar
  updateScholar: async (id, scholarData) => {
    try {
      const response = await api.put(`/${id}`, scholarData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Scholar updated successfully'
      };
    } catch (error) {
      console.error('Error updating scholar:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update scholar'
      };
    }
  },
  // Delete a scholar
  deleteScholar: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return {
        success: response.data.success,
        message: response.data.message || 'Scholar deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting scholar:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete scholar'
      };
    }
  },
  // Fetch scholar count
  getScholarCount: async () => {
    const response = await api.get('/count');
    return response.data.count;
  },
};

export default ScholarService;
