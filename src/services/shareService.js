import apiClient from './apiClient';

export const shareService = {
  /**
   * Share a prescription via email
   * POST /share/prescriptions/:id/share
   * Body: { recipientEmail }
   */
  async sharePrescription(prescriptionId, recipientEmail) {
    const response = await apiClient.post(`/share/prescriptions/${prescriptionId}/share`, {
      recipientEmail,
    });
    return response.data;
  },

  /**
   * Access a shared prescription via token (public)
   * GET /share/share/:token
   */
  async getSharedPrescription(token) {
    const response = await apiClient.get(`/share/share/${token}`);
    return response.data;
  },
};
