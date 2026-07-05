import apiClient from './apiClient';

export const prescriptionService = {
  /**
   * Upload image and run full AI pipeline (gate → OCR → validate → persist)
   * POST /ai/analyze — multipart/form-data
   */
  async uploadAndAnalyze(file, { persist = true } = {}) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/ai/analyze?persist=${persist}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 min for AI processing
    });
    return response.data;
  },

  /**
   * Validate image only (gate check — is it a prescription?)
   * POST /ai/validate-image — multipart/form-data
   */
  async validateImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/ai/validate-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return response.data;
  },

  /**
   * Get processing status for an image
   * GET /ai/status/:imageId
   */
  async getStatus(imageId) {
    const response = await apiClient.get(`/ai/status/${imageId}`);
    return response.data;
  },

  /**
   * Get full processing result for an image
   * GET /ai/result/:imageId
   */
  async getResult(imageId) {
    const response = await apiClient.get(`/ai/result/${imageId}`);
    return response.data;
  },

  /**
   * List all prescriptions for the current user
   * GET /prescriptions
   */
  async listPrescriptions() {
    const response = await apiClient.get('/prescriptions');
    return response.data;
  },

  /**
   * Get details of a single prescription (with items + recommendations)
   * GET /prescriptions/:id
   */
  async getPrescriptionDetails(id) {
    const response = await apiClient.get(`/prescriptions/${id}`);
    return response.data;
  },

  /**
   * Delete a prescription
   * DELETE /prescriptions/:id
   */
  async deletePrescription(id) {
    const response = await apiClient.delete(`/prescriptions/${id}`);
    return response.data;
  },

  /**
   * Get prescription history
   * GET /prescriptions/history
   */
  async getHistory() {
    const response = await apiClient.get('/prescriptions/history');
    return response.data;
  },

  /**
   * Export a single prescription as PDF
   * POST /prescriptions/:id/export — returns blob
   */
  async exportPDF(id) {
    const response = await apiClient.post(`/prescriptions/${id}/export`, {}, {
      responseType: 'blob',
      timeout: 60000,
    });
    return response.data;
  },

  /**
   * Export multiple prescriptions as a combined PDF
   * POST /prescriptions/export-multiple — returns blob
   */
  async exportMultiplePDF(ids) {
    const response = await apiClient.post('/prescriptions/export-multiple', { ids }, {
      responseType: 'blob',
      timeout: 120000,
    });
    return response.data;
  },

  /**
   * AI health check
   * GET /ai/health
   */
  async checkAIHealth() {
    const response = await apiClient.get('/ai/health');
    return response.data;
  },
};
