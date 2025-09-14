import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/support`;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const SupportService = {
    // Create a new support ticket
    createSupport: async (supportData) => {
        try {
            const response = await api.post('/', supportData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create support ticket'
            };
        }
    },

    // Get all support tickets (admin only)
    getAllSupports: async () => {
        try {
            const response = await api.get('/admin/all');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch support tickets'
            };
        }
    },

    // Get user's support tickets
    getUserSupports: async (email) => {
        try {
            const response = await api.get(`/user/${email}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch user support tickets'
            };
        }
    },

    // Update support ticket status (admin only)
    updateSupportStatus: async (id, status) => {
        try {
            const response = await api.patch(`/admin/${id}/status`, { status });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update support ticket status'
            };
        }
    }
};

export default SupportService;
