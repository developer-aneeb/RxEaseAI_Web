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

## 2. Domain Service Modules (`src/services/`)

RxEaseAI encapsulates all HTTP communications within specialized domain services. Each service consumes `apiClient` and automatically maps API exceptions into friendly user copy via `getFriendlyErrorMessage`.

### Authentication & Profile Services
- **`authService.js`**:
  - `login(email, password)`: Authenticates credentials at `/auth/login` and initializes session state.
  - `signup(userData)`: Registers a new user account at `/auth/register`.
  - `forgotPassword(email)`: Requests password reset email at `/auth/forgot-password`.
  - `resetPassword(token, newPassword)`: Completes password reset at `/auth/reset-password`.
- **`profileService.js`**:
  - `getProfile()`: Retrieves user profile details (`/users/profile`).
  - `updateProfile(profileData)`: Updates account preferences and clinical profile attributes.

### Prescription Ingestion, History & Export (`prescriptionService.js`)
- `listPrescriptions(params)`: Retrieves paginated list of ingested prescriptions (`/prescriptions`).
- `getHistory()`: Retrieves comprehensive audit log history for prescription events (`/prescriptions/history`).
- `exportPDF(id)`: Requests server-rendered PDF audit report (`/prescriptions/:id/export`). Returns a Blob.
- `exportMultiplePDF(ids)`: Bulk exports multiple prescriptions combined into a single PDF document (`/prescriptions/export-multiple`).
- `deletePrescription(id)`: Deletes a prescription record from history (`/prescriptions/:id`).

### Secure Prescription Sharing (`shareService.js`)
- `createShareLink(prescriptionId, options)`: Generates a secure access token and shareable URL (`/share/token`).
- `shareViaEmail(prescriptionId, email, options)`: Directly sends a prescription audit link to a clinical recipient or patient (`/share/email`).
- `getSharedPrescription(token)`: Retrieves shared prescription details using a valid access token (`/share/view/:token`).

### Medication Adherence & Follow-ups
- **`reminderService.js`**:
  - `listReminders(params)`: Retrieves active medication schedules and dosage timings.
  - `createReminder(data)`: Schedules a new medication reminder alert.
  - `updateReminder(id, data)` / `deleteReminder(id)`: Manages existing reminders.
- **`followUpService.js`**:
  - `getFollowUps()`: Retrieves scheduled follow-up appointments and doctor check-ins.
  - `scheduleFollowUp(data)`: Creates a new clinical follow-up task.

### Clinical Analytics & Intelligence
- **`analyticsService.js`**:
  - `getUserAnalytics()`: Fetches real-time adherence rates, ingestion counts, and verification speeds.
- **`recommendationService.js`**:
  - `getRecommendations(prescriptionId)`: Retrieves AI-powered smart alternatives, generic substitutions, and cost savings.
- **`searchService.js`**:
  - `searchInteractions(query)`: Searches drug interaction database and clinical safety guidelines.
- **`feedbackService.js`**:
  - `submitFeedback(payload)`: Transmits user feedback or bug reports to support services.

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

## 4. Best Practices for Service Module Extensions

When building new domain services, follow this standard pattern:

```javascript
import apiClient from './apiClient';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

export const exampleService = {
  fetchRecords: async () => {
    try {
      const response = await apiClient.get('/records');
      return response.data;
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error, 'Failed to fetch records.'));
    }
  }
};
```
