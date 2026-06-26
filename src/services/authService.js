import apiClient from './apiClient';

export const authService = {
  /**
   * Sign up a new user
   */
  async signup(email, password, name, role = 'user', invitationToken = '') {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name,
      role,
      invitation_token: invitationToken
    });
    return response.data;
  },

  /**
   * Log in an existing user
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Log out the current user
   */
  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  /**
   * Send a password reset email
   */
  async requestPasswordReset(email) {
    const response = await apiClient.post('/auth/request-password-reset', {
      email
    });
    return response.data;
  },

  /**
   * Update user's password (called after clicking reset link)
   */
  async resetPassword(accessToken, newPassword) {
    const response = await apiClient.post('/auth/reset-password', {
      access_token: accessToken,
      new_password: newPassword
    });
    return response.data;
  },

  /**
   * Resend verification email
   */
  async resendVerification(email) {
    const response = await apiClient.post('/auth/resend-verification', {
      email
    });
    return response.data;
  },

  /**
   * Refresh token
   */
  async refreshToken(refreshToken) {
    const response = await apiClient.post('/auth/refresh-token', {
      refresh_token: refreshToken
    });
    return response.data;
  },

  /**
   * Get the current user profile
   */
  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  /**
   * Initiate Google OAuth flow by fetching the redirect URL
   */
  async initiateGoogleOAuth() {
    const response = await apiClient.get('/auth/oauth/google');
    if (response.data && response.data.data && response.data.data.url) {
      window.location.href = response.data.data.url;
    } else {
      throw new Error('Google OAuth redirect URL not returned by server');
    }
  }
};
