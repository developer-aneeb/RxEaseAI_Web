# API & Services Layer Reference

RxEaseAI organizes network communication and external backend interaction into a structured, decoupled Service Layer located under `src/services/`. This architecture isolates HTTP networking concerns, authentication headers, and token refresh mechanisms from React components.

---

## 1. Centralized HTTP Client (`apiClient.js`)

All outbound network requests must pass through our configured Axios instance exported from `src/services/apiClient.js`.

### Key Capabilities:
- **Base URL Configuration**: Automatically defaults to `import.meta.env.VITE_API_URL` or fallback `http://localhost:8000/api/v1`.
- **Dynamic JWT Injection (Request Interceptor)**:
  Before any request is transmitted, the interceptor checks `localStorage` for authentication state. It reads from Zustand's persisted storage (`rxease-auth-storage`) or plain fallback tokens (`rxease_token`), automatically injecting the `Authorization: Bearer <token>` header.
- **Global Unauthorized Interceptor (Response Interceptor)**:
  If a backend API returns an HTTP `401 Unauthorized` status code, the interceptor automatically:
  1. Purges local token storage (`localStorage.removeItem('rxease_token')`).
  2. Invokes `useAuthStore.getState().logout()` to reset application session state.
  3. Redirects the browser window to `/#signin`.

---

## 2. Authentication Service (`authService.js`)

Located at `src/services/authService.js`, this module provides asynchronous wrappers for user authentication endpoints.

### Available Service Functions:
- `login(email, password)`: Transmits credentials to `/auth/login`. Resolves with JWT token payload and user profile object.
- `signup(userData)`: Posts registration details to `/auth/register`.
- `forgotPassword(email)`: Triggers password reset link generation at `/auth/forgot-password`.
- `resetPassword(token, newPassword)`: Submits new password payload to `/auth/reset-password`.
- `getProfile()`: Retrieves authenticated user profile data from `/users/profile`.
- `updateProfile(profileData)`: Transmits profile edits to `/users/profile`.

---

## 3. Human-Readable Error Translation (`errorMessages.js`)

Never display raw API exception strings or database stack traces to end users. All network catches must pass through our error mapping utility:
- **Location**: `src/utils/errorMessages.js`
- **Method**: `getFriendlyErrorMessage(error)`

### Mapping Rules:
| Error Condition | Raw / Axios Status | Translated Friendly Copy |
| :--- | :--- | :--- |
| **Network Unreachable** | `ERR_NETWORK` | *"Unable to connect to RxEase AI servers. Please check your internet connection."* |
| **Session Expired** | `401 Unauthorized` | *"Your session has expired. Please sign in again."* |
| **Forbidden** | `403 Forbidden` | *"You do not have permission to perform this action."* |
| **Duplicate Account** | `409 Conflict` | *"An account with this email already exists."* |
| **Rate Limited** | `429 Too Many Requests`| *"Too many requests. Please wait a few moments before trying again."* |
| **Server Error** | `500+ Internal Error` | *"RxEase AI cloud service encountered an error. Our clinical team is notified."* |

---

## 4. Best Practices for New Service Modules

When building new domain services (e.g., `src/services/prescriptionService.js` or `src/services/billingService.js`), follow this standard pattern:

```javascript
import apiClient from './apiClient';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

export const prescriptionService = {
  getHistory: async () => {
    try {
      const response = await apiClient.get('/prescriptions/history');
      return response.data;
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  uploadScan: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/prescriptions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) onProgress(percent);
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error));
    }
  }
};
```
