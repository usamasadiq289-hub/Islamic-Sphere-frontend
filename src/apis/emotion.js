import axios from 'axios';

const API_URL = 'https://islamic-sphere-backend-two.vercel.app/duas';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const EmotionService = {
  // Get random duas based on emotion and count
  getRandomDuas: async (emotion, quranCount = 1, hadithCount = 1) => {
    try {
      const response = await api.get('/random', {
        params: {
          emotion: emotion.toLowerCase(),
          noOfQuranicDua: quranCount,
          noOfHadeesDua: hadithCount
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching duas:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch duas'
      };
    }
  },

  // Helper method to format response data
  formatDuaResponse: (responseData) => {
    if (!responseData) return { quranicDuas: [], hadithDuas: [] };

    return {
      quranicDuas: responseData.quranicDua.map(dua => ({
        arabic: dua.arabic,
        urduTranslation: dua.urduTranslation,
        reference: dua.reference
      })),
      hadithDuas: responseData.hadeesDua.map(dua => ({
        arabic: dua.arabic,
        urduTranslation: dua.urduTranslation,
        reference: dua.reference
      }))
    };
  }
};

export default EmotionService;
