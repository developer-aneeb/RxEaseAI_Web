/**
 * Maps backend error codes/messages → user-friendly frontend messages.
 * Covers all error codes from the backend errorHandler.js
 */
const ERROR_MAP = {
  // ── Auth errors ──
  "User with this email already exists": "An account with this email already exists. Try signing in instead.",
  "An account with this email address already exists": "An account with this email already exists. Try signing in instead.",
  "Invalid email or password": "The email or password you entered is incorrect. Please try again.",
  "Please verify your email address": "Please check your inbox and verify your email before signing in.",
  "email not confirmed": "Please check your inbox and verify your email before signing in.",
  "email not verified": "Please check your inbox and verify your email before signing in.",
  "Account has been deactivated": "Your account has been deactivated. Contact support for assistance.",
  "Admin accounts cannot access": "Admin accounts cannot access the user application.",
  "User accounts cannot access the admin": "This account doesn't have admin access.",
  "User role is not configured": "Your account setup is incomplete. Contact support.",
  "Reactivation period expired": "Your reactivation window has expired. Please contact support.",
  "Account is already active": "Your account is already active. You can sign in normally.",

  // ── Token/session errors ──
  "Invalid or expired reset token": "Your reset link is invalid or has expired. Please request a new password reset.",
  "Password reset failed. Missing:": "Your reset link has expired or is incomplete. Please request a new one.",
  "Refresh token is required": "Your session has expired. Please sign in again.",
  "Failed to refresh session": "Your session has expired. Please sign in again.",
  "No access token provided": "Please sign in to continue.",
  "Token verification failed": "Your session has expired. Please sign in again.",

  // ── Validation errors ──
  "Validation error": "Please check your inputs and try again.",
  "Email is required": "Please enter your email address.",
  "Password is required": "Please enter your password.",
  "medicine_name is required": "Medicine name is required.",
  "condition_name is required": "Condition name is required.",
  "Recipient email is required": "Please enter the recipient's email address.",
  "Message, rating, and category are required": "Please fill in all feedback fields.",
  "Rating must be between 1 and 5": "Please select a rating between 1 and 5.",
  "Phone number must be in Pakistani format": "Please enter a valid Pakistani phone number (e.g., 03001234567).",
  "Invalid blood group": "Please select a valid blood group.",
  "Invalid gender": "Please select a valid gender option.",
  "Current password is required": "Please enter your current password.",
  "Current password is incorrect": "The current password you entered is incorrect.",
  "New email must be different": "The new email must be different from your current email.",
  "Email address is already in use": "This email address is already in use by another account.",

  // ── File/Upload errors ──
  "Image file is required": "Please select an image file to upload.",
  "File size must be less than": "The file is too large. Please choose a smaller file.",
  "Only JPEG, JPG, PNG": "Please upload a JPEG, JPG, PNG, or GIF image.",
  "Profile image file is required": "Please select a profile image to upload.",
  "Image size must be less than 500KB": "Profile image must be smaller than 500KB.",

  // ── AI/OCR errors ──
  "Unable to verify image": "This doesn't appear to be a valid prescription. Please upload a clear handwritten prescription.",
  "We could not verify this image right now": "The image verification service is temporarily unavailable. Please try again shortly.",
  "Valid handwritten prescription": "Image verified as a valid prescription.",

  // ── Resource errors ──
  "Prescription not found": "This prescription could not be found. It may have been deleted.",
  "Reminder not found": "This reminder could not be found.",
  "Follow-up not found": "This follow-up could not be found.",
  "Invalid or expired share link": "This share link is invalid or has expired.",

  // ── Rate limiting ──
  "Too many authentication attempts": "Too many attempts. Please wait a few minutes and try again.",
  "Rate limit exceeded": "Too many requests. Please wait a few minutes and try again.",
  "rate limit": "Too many requests. Please wait a few minutes and try again.",

  // ── Backend error codes (from errorHandler.js) ──
  "AUTH_REQUIRED": "Please sign in to continue.",
  "INVALID_TOKEN": "Your session has expired. Please sign in again.",
  "INSUFFICIENT_PERMISSIONS": "You don't have permission to access this feature.",
  "CONFLICT": "This record already exists.",
  "DUPLICATE_RESOURCE": "This record already exists.",
  "NOT_FOUND": "The requested resource was not found.",
  "VALIDATION_ERROR": "Please check your inputs and try again.",
  "RATE_LIMIT_EXCEEDED": "Too many requests. Please wait a moment and try again.",
  "INTERNAL_ERROR": "Something went wrong on our end. Please try again later.",
  "SERVICE_UNAVAILABLE": "This service is temporarily unavailable. Please try again shortly.",
  "GATE_VALIDATION_FAILED": "Image verification is temporarily unavailable. Please try again.",
  "PERSISTENCE_FAILED": "Failed to save data. Please try again.",
  "PDF_GENERATION_FAILED": "Failed to generate the PDF. Please try again.",
  "SUPABASE_API_ERROR": "A database error occurred. Please try again.",
  "PERMISSION_DENIED": "You don't have permission for this action.",
  "2FA_REQUIRED": "Two-factor authentication is required. Please set up 2FA first.",
  "VALIDATION_REQUIRED": "Medicine validation is required before generating recommendations.",
  "CONFIG_ERROR": "A configuration error occurred. Please contact support.",
  "FORBIDDEN": "Access denied.",

  // ── Account ──
  "Account deactivated": "Your account has been deactivated. Contact support for help.",
  "Email verification required": "Please verify your email address to access this feature.",
  "Profile required": "Please complete your account setup first.",
  "Cross-origin request blocked": "A connection error occurred. Please try again.",
};

/**
 * Translate backend errors into user-friendly messages
 * @param {Object|string} error - Axios error or string message
 * @param {string} defaultMessage - Fallback message
 * @returns {string} User-friendly message
 */
export const getFriendlyErrorMessage = (error, defaultMessage = 'An unexpected error occurred. Please try again.') => {
  if (!error) return defaultMessage;

  // Direct string matching
  if (typeof error === 'string') {
    const matched = Object.entries(ERROR_MAP).find(([key]) =>
      error.toLowerCase().includes(key.toLowerCase())
    );
    return matched ? matched[1] : error;
  }

  // Network error (no response from server)
  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // Timeout
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'The request timed out. Please check your connection and try again.';
  }

  // Extract from response
  const responseData = error.response?.data;
  const status = error.response?.status;

  // Try matching the error code first (more specific)
  const errorCode = responseData?.error || responseData?.code;
  if (errorCode && typeof errorCode === 'string' && ERROR_MAP[errorCode]) {
    return ERROR_MAP[errorCode];
  }

  // Then try matching the message
  const backendMessage = responseData?.message || responseData?.error || error.message;
  if (backendMessage && typeof backendMessage === 'string') {
    const matched = Object.entries(ERROR_MAP).find(([key]) =>
      backendMessage.toLowerCase().includes(key.toLowerCase())
    );
    if (matched) return matched[1];

    // If backend returned a readable message, use it directly
    if (backendMessage.length < 200 && !backendMessage.startsWith('[')) {
      return backendMessage;
    }
  }

  // Status-code-based fallbacks
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You don\'t have permission to perform this action.';
  if (status === 404) return 'The requested resource was not found.';
  if (status === 409) return 'This record already exists.';
  if (status === 422) return 'The data provided is invalid. Please check and try again.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status === 500) return 'Something went wrong on our end. Please try again later.';
  if (status === 503) return 'This service is temporarily unavailable. Please try again shortly.';

  return defaultMessage;
};
