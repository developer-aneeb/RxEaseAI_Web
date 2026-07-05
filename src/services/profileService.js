import apiClient from './apiClient';

export const profileService = {
  // ── Profile ──

  /** GET /profile */
  async getProfile() {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  /**
   * PUT /profile
   * Body: { name?, phone?, date_of_birth?, gender?, blood_group?, height?, weight?, address?, city?, province?, country? }
   */
  async updateProfile(data) {
    const response = await apiClient.put('/profile', data);
    return response.data;
  },

  /**
   * PUT /profile/email
   * Body: { email, current_password }
   */
  async updateEmail(data) {
    const response = await apiClient.put('/profile/email', data);
    return response.data;
  },

  // ── Profile Image ──

  /**
   * POST /profile/image — multipart/form-data, field: profile_image
   * Limits: 500KB, JPEG/JPG/PNG/GIF
   */
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('profile_image', file);

    const response = await apiClient.post('/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });
    return response.data;
  },

  /** DELETE /profile/image */
  async deleteImage() {
    const response = await apiClient.delete('/profile/image');
    return response.data;
  },

  // ── Notification Preferences ──

  /** GET /profile/notifications */
  async getNotificationPreferences() {
    const response = await apiClient.get('/profile/notifications');
    return response.data;
  },

  /**
   * PUT /profile/notifications
   * Body: { email_notifications, security_alerts }
   */
  async updateNotificationPreferences(data) {
    const response = await apiClient.put('/profile/notifications', data);
    return response.data;
  },

  // ── Medical Info ──

  /**
   * PUT /profile/medical
   * Body: { condition_name, chronic_diseases?, status?, family_medical_history?, consent_to_share_data? }
   */
  async updateMedicalInfo(data) {
    const response = await apiClient.put('/profile/medical', data);
    return response.data;
  },

  // ── Allergies ──

  /** GET /profile/allergies */
  async getAllergies() {
    const response = await apiClient.get('/profile/allergies');
    return response.data;
  },

  /**
   * POST /profile/allergies
   * Body: { allergy_type: "Food"|"Drug"|"Other", allergen, reaction? }
   */
  async addAllergy(data) {
    const response = await apiClient.post('/profile/allergies', data);
    return response.data;
  },

  /**
   * PUT /profile/allergies/:id
   * Body: { id, allergy_type, allergen, reaction? }
   */
  async updateAllergy(id, data) {
    const response = await apiClient.put(`/profile/allergies/${id}`, { ...data, id });
    return response.data;
  },

  // ── Emergency Contacts ──

  /** GET /profile/emergency-contacts */
  async getEmergencyContacts() {
    const response = await apiClient.get('/profile/emergency-contacts');
    return response.data;
  },

  /**
   * POST /profile/emergency-contacts
   * Body: { contact_name, relationship?, phone, address? }
   */
  async addEmergencyContact(data) {
    const response = await apiClient.post('/profile/emergency-contacts', data);
    return response.data;
  },

  /**
   * PUT /profile/emergency-contacts/:id
   * Body: { id, contact_name, relationship?, phone, address? }
   */
  async updateEmergencyContact(id, data) {
    const response = await apiClient.put(`/profile/emergency-contacts/${id}`, { ...data, id });
    return response.data;
  },
};
