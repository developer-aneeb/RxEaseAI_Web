const ERROR_MAP = {
  "User with this email already exists": "An account with this email already exists. Try signing in instead.",
  "Invalid email or password": "The email or password you entered is incorrect. Please try again.",
  "Please verify your email address": "Please check your inbox and verify your email before signing in.",
  "Account has been deactivated": "Your account has been deactivated. Contact support for assistance.",
  "Too many authentication attempts": "Too many attempts. Please wait a few minutes and try again.",
  "Password reset failed. Missing:": "Your reset link has expired. Please request a new one.",
  "Invalid or expired reset token": "Your reset link is invalid or has expired. Please request a new password reset.",
  "Validation error": "Please check your inputs and try again.",
  "Rate limit exceeded": "Too many requests. Please wait a few minutes and try again.",
  "AUTH_REQUIRED": "Authentication required. Please sign in again.",
  "INVALID_TOKEN": "Your session has expired. Please sign in again.",
  "INSUFFICIENT_PERMISSIONS": "You do not have permission to access this resource.",
  "CONFLICT": "This record already exists.",
  "INTERNAL_ERROR": "Internal server error. Please try again later."
};

/**
 * Translate backend errors into user-friendly messages
 * @param {Object} error - Axios error object or backend message string
 * @param {string} defaultMessage - Default message if no match found
 * @returns {string} User-friendly message
 */
export const getFriendlyErrorMessage = (error, defaultMessage = 'An unexpected error occurred. Please try again.') => {
  if (!error) return defaultMessage;

  // If it's a string, match it directly
  if (typeof error === 'string') {
    const matched = Object.entries(ERROR_MAP).find(([key]) => 
      error.toLowerCase().includes(key.toLowerCase())
    );
    return matched ? matched[1] : error;
  }

  // If it's a network error (no response)
  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  // Extract backend message or error code
  const responseData = error.response?.data;
  
  // Look in typical places for backend error message
  const backendMessage = responseData?.message || responseData?.error || error.message;

  if (backendMessage && typeof backendMessage === 'string') {
    // Check substring matches
    const matched = Object.entries(ERROR_MAP).find(([key]) => 
      backendMessage.toLowerCase().includes(key.toLowerCase())
    );
    if (matched) {
      return matched[1];
    }
    return backendMessage; // Fallback to raw message if we can't map it
  }

  return defaultMessage;
};
