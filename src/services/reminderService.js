import apiClient from './apiClient';

export const reminderService = {
  // ── Reminder CRUD ──

  /** GET /reminders */
  async list() {
    const response = await apiClient.get('/reminders');
    return response.data;
  },

  /** GET /reminders/:id */
  async get(id) {
    const response = await apiClient.get(`/reminders/${id}`);
    return response.data;
  },

  /**
   * POST /reminders
   * Body: { medicine_name, schedule_type, start_at, weekdays?, remind_count?, remind_interval_minutes? }
   */
  async create(data) {
    const response = await apiClient.post('/reminders', data);
    return response.data;
  },

  /** PUT /reminders/:id */
  async update(id, data) {
    const response = await apiClient.put(`/reminders/${id}`, data);
    return response.data;
  },

  /** DELETE /reminders/:id */
  async remove(id) {
    const response = await apiClient.delete(`/reminders/${id}`);
    return response.data;
  },

  // ── Actions ──

  /** POST /reminders/:id/action — { action: "take" | "skip" } */
  async takeAction(id, action) {
    const response = await apiClient.post(`/reminders/${id}/action`, { action });
    return response.data;
  },

  /** POST /reminders/:id/snooze — { minutes } */
  async snooze(id, minutes = 15) {
    const response = await apiClient.post(`/reminders/${id}/snooze`, { minutes });
    return response.data;
  },

  // ── Notifications ──

  /** GET /reminders/notifications/list?limit= */
  async getNotifications(limit = 50) {
    const response = await apiClient.get(`/reminders/notifications/list?limit=${limit}`);
    return response.data;
  },

  /** PUT /reminders/notifications/:notificationId/read */
  async markNotificationRead(notificationId) {
    const response = await apiClient.put(`/reminders/notifications/${notificationId}/read`);
    return response.data;
  },

  /** PUT /reminders/notifications/read-all */
  async markAllNotificationsRead() {
    const response = await apiClient.put('/reminders/notifications/read-all');
    return response.data;
  },

  /** DELETE /reminders/notifications/:notificationId */
  async deleteNotification(notificationId) {
    const response = await apiClient.delete(`/reminders/notifications/${notificationId}`);
    return response.data;
  },

  /** DELETE /reminders/notifications/clear-all */
  async clearAllNotifications() {
    const response = await apiClient.delete('/reminders/notifications/clear-all');
    return response.data;
  },
};
