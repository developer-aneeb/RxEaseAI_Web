import apiClient from './apiClient';

export const feedbackService = {
  /**
   * Submit user feedback
   * POST /feedback → 201
   * Body: { message, rating (1-5), category }
   */
  async submit(message, rating, category) {
    const response = await apiClient.post('/feedback', {
      message,
      rating,
      category,
      timestamp: new Date().toISOString(),
    });
    return response.data;
  },
};
