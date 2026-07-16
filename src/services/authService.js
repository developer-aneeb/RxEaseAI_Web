import apiClient from './apiClient';

export const authService = {
  /**
   * Register a new user
   * POST /auth/register → 201
   */
  async signup(email, password, name, role = 'user', invitationToken = '') {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name,
      role,
      invitation_token: invitationToken,
    });
    return response.data;
  },

  /**
   * Login
   * POST /auth/login → 200
   * Returns { data: { user, session: { access_token, refresh_token, expires_at } } }
   * OR { require2FA: true, challengeId } when MFA is needed
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Logout
   * POST /auth/logout → 200
   */
  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  /**
   * Request password reset email
   * POST /auth/request-password-reset → 200
   */
  async requestPasswordReset(email) {
    const response = await apiClient.post('/auth/request-password-reset', { email });
    return response.data;
  },

  /**
   * Reset password using the token from the reset email link
   * POST /auth/reset-password → 200
   */
  async resetPassword({ access_token, refresh_token, new_password }) {
    const response = await apiClient.post('/auth/reset-password', {
      access_token,
      refresh_token,
      new_password,
    });
    return response.data;
  },

  /**
   * Resend email verification
   * POST /auth/resend-verification → 200
   */
  async resendVerification(email) {
    const response = await apiClient.post('/auth/resend-verification', { email });
    return response.data;
  },

  /**
   * Refresh token
   * POST /auth/refresh-token → 200
   */
  async refreshToken(refreshToken) {
    const response = await apiClient.post('/auth/refresh-token', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Get current user profile (auth context)
   * GET /auth/profile → 200
   */
  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  /**
   * Initiate Google OAuth — redirects browser to Google
   * GET /auth/oauth/google → 200 with { data: { url } }
   */
  async initiateGoogleOAuth() {
    const response = await apiClient.get('/auth/oauth/google');
    if (response.data?.data?.url) {
      window.location.href = response.data.data.url;
    } else {
      throw new Error('Google OAuth redirect URL not returned by server');
    }
  },

  /**
   * Get linked OAuth providers
   * GET /auth/oauth/linked → 200
   */
  async getLinkedProviders() {
    const response = await apiClient.get('/auth/oauth/linked');
    return response.data;
  },

  /**
   * Deactivate account
   * POST /auth/deactivate → 200
   */
  async deactivateAccount() {
    const response = await apiClient.post('/auth/deactivate');
    return response.data;
  },

  /**
   * Reactivate account
   * POST /auth/reactivate → 200
   */
  async reactivateAccount(email, password) {
    const response = await apiClient.post('/auth/reactivate', { email, password });
    return response.data;
  },
};
