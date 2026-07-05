import apiClient from './apiClient';

export const recommendationService = {
  /**
   * Get saved recommendations for a prescription
   * GET /prescriptions/:prescriptionId/recommendations
   */
  async getSaved(prescriptionId) {
    const response = await apiClient.get(`/prescriptions/${prescriptionId}/recommendations`);
    return response.data;
  },

  /**
   * Generate recommendations for all validated items in a prescription
   * POST /prescriptions/:prescriptionId/recommendations/all
   */
  async generateAll(prescriptionId, topK = 3, persist = true) {
    const response = await apiClient.post(
      `/prescriptions/${prescriptionId}/recommendations/all`,
      { top_k: topK, persist },
      { timeout: 60000 }
    );
    return response.data;
  },

  /**
   * Generate recommendations for a single prescription item
   * POST /prescriptions/:prescriptionId/recommendations
   */
  async generateForItem(prescriptionId, itemId, topK = 3, persist = true) {
    const response = await apiClient.post(
      `/prescriptions/${prescriptionId}/recommendations`,
      { prescription_item_id: itemId, top_k: topK, persist },
      { timeout: 60000 }
    );
    return response.data;
  },
};
