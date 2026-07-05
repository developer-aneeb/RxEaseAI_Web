import apiClient from './apiClient';

export const analyticsService = {
  /** GET /analytics/adherence?days= */
  async getAdherence(days = 30) {
    const response = await apiClient.get(`/analytics/adherence?days=${days}`);
    return response.data;
  },

  /** GET /analytics/missed-doses?days= */
  async getMissedDoses(days = 30) {
    const response = await apiClient.get(`/analytics/missed-doses?days=${days}`);
    return response.data;
  },

  /** GET /analytics/medicine/:reminderId?days= */
  async getMedicineAnalytics(reminderId, days = 30) {
    const response = await apiClient.get(`/analytics/medicine/${reminderId}?days=${days}`);
    return response.data;
  },

  /** GET /analytics/prescriptions?months= */
  async getPrescriptionStats(months = 6) {
    const response = await apiClient.get(`/analytics/prescriptions?months=${months}`);
    return response.data;
  },

  /** GET /analytics/reminders-summary */
  async getRemindersSummary() {
    const response = await apiClient.get('/analytics/reminders-summary');
    return response.data;
  },

  /** GET /analytics/consistency?days= */
  async getConsistency(days = 90) {
    const response = await apiClient.get(`/analytics/consistency?days=${days}`);
    return response.data;
  },

  /** GET /analytics/weekly-patterns?weeks= */
  async getWeeklyPatterns(weeks = 8) {
    const response = await apiClient.get(`/analytics/weekly-patterns?weeks=${weeks}`);
    return response.data;
  },

  /** Mocked or aliased /analytics/report */
  async getReport(days = 30) {
    const response = await apiClient.get(`/analytics/adherence?days=${days}`);
    return response.data;
  },

  /** Mocked or aliased optimization options */
  async getOptimizationOptions() {
    return [];
  }
};
