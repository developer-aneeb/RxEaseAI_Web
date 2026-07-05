import apiClient from './apiClient';

export const followUpService = {
  /** GET /followups */
  async list() {
    const response = await apiClient.get('/followups');
    return response.data;
  },

  /** GET /followups/:id */
  async get(id) {
    const response = await apiClient.get(`/followups/${id}`);
    return response.data;
  },

  /**
   * POST /followups
   * Body: { reminder_type: "doctor_visit"|"lab_test"|"prescription_refill"|"other", title, scheduled_at }
   */
  async create(data) {
    const response = await apiClient.post('/followups', data);
    return response.data;
  },

  /** PUT /followups/:id */
  async update(id, data) {
    const response = await apiClient.put(`/followups/${id}`, data);
    return response.data;
  },

  /** DELETE /followups/:id */
  async remove(id) {
    const response = await apiClient.delete(`/followups/${id}`);
    return response.data;
  },
};
