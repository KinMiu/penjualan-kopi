import axios from 'axios';

const API_URL = '/api/v1/interactions/';
const API_BASE_URL = '/api/v1/recommendations';

const InteractionService = {
  logInteraction: async (data) => {
    try {
      await axios.post(API_URL, data);
    } catch (error) {
      console.error('Failed to log interaction:', error.message);
    }
  }
};

const getRecommendations = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/${userId}`);
  return response.data.recommendations; // Array of product IDs
};

export default { 
  InteractionService,
  getRecommendations
}
