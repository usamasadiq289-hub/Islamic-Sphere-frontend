import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/contacts`;

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

const ContactService = {
  // Search users
  searchUsers: async (searchQuery) => {
    try {
      const response = await api.get('/users', {
        params: { search: searchQuery }
      });
      return {
        success: true,
        data: response.data,
        message: 'Users fetched successfully'
      };
    } catch (error) {
      console.error('Error searching users:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to search users'
      };
    }
  },

  // Add contacts
  addContacts: async (contactIds) => {
    try {
      const response = await api.post('/', { contactIds });
      return {
        success: true,
        data: response.data,
        message: 'Contacts added successfully'
      };
    } catch (error) {
      console.error('Error adding contacts:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to add contacts'
      };
    }
  },

  // Get user's contacts
  getContacts: async () => {
    try {
      const response = await api.get('/');
      return {
        success: true,
        data: response.data,
        message: 'Contacts fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch contacts'
      };
    }
  },

  // Remove contact
  // removeContact: async (contactId) => {
  //   try {
  //     const response = await api.delete(`/contacts`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`
  //       }
  //     });

  //     return {
  //       success: true,
  //       data: response.data,
  //       message: 'Contact removed successfully!'
  //     };
  //   } catch (error) {
  //     console.error('Error removing contact:', error);
  //     return {
  //       success: false,
  //       message: error.response?.data?.message || 'Failed to remove contact'
  //     };
  //   }
  // },


  removeContact: async (contactId) => {
    try {
      // Change to use query parameters correctly
      const response = await api.delete(`/`, {
        params: { contactId }
      });

      return {
        success: true,
        data: response.data,
        message: 'Contact removed successfully!'
      };
    } catch (error) {
      console.error('Error removing contact:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove contact'
      };
    }
  },

  // Approve or reject contact request
  approveUserRequest: async (requestsUserId, IsApproved) => {
    try {
      const response = await api.post('/approve', {
        requestsUserId,
        IsApproved
      });
      return {
        success: true,
        data: response.data,
        message: 'Contact request processed successfully'
      };
    } catch (error) {
      console.error('Error processing contact request:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to process contact request'
      };
    }
  },

  // Get contact requests
  getContactRequests: async () => {
    try {
      const response = await api.get('/requests');
      return {
        success: true,
        data: response.data,
        message: 'Contact requests fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch contact requests'
      };
    }
  },


  cancelContactRequest: async (requestedUserId) => {
    try {
      const response = await api.delete('/cancel-request', {
        params: { requestedUserId }
      });
      return {
        success: true,
        data: response.data,
        message: 'Contact request cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling contact request:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to cancel contact request'
      };
    }
  },

};

export default ContactService;
