# API & Services Layer Reference

RxEaseAI organizes network communication and external backend interaction into a structured, decoupled Service Layer located under `src/services/`. This architecture isolates HTTP networking concerns, authentication headers, and error translation from React UI components.

---

## 1. Centralized HTTP Client (`apiClient.js`)

All outbound network requests pass through our configured Axios instance exported from `src/services/apiClient.js`.

### Key Capabilities:
- **Base URL Configuration**: Automatically defaults to `import.meta.env.VITE_API_URL` or fallback `http://localhost:3000/api/v1`.
- **Dynamic JWT Injection (Request Interceptor)**:
  Before any request is transmitted, the interceptor checks `localStorage` for authentication state. It reads from Zustand's persisted storage (`rxease-auth-storage`) or plain fallback tokens (`rxease_token`), automatically injecting the `Authorization: Bearer <JWT_ACCESS_TOKEN>` header.
- **Global Unauthorized Interceptor (Response Interceptor)**:
  If a backend API returns an HTTP `401 Unauthorized` status code, the interceptor automatically:
  1. Purges local token storage (`localStorage.removeItem('rxease_token')`).
  2. Invokes `useAuthStore.getState().logout()` to reset application session state.
  3. Redirects the browser window to `/#signin`.

---

## 2. Domain Service Modules (`src/services/`)

RxEaseAI encapsulates all HTTP communications within specialized domain services. Each service consumes `apiClient` and automatically maps API exceptions into user-friendly messages via `getFriendlyErrorMessage`.

### Authentication & Profile Services
- **`authService.js`**:
  - `login(email, password)`: Authenticates credentials at `/auth/login` and initializes session state.
  - `signup(userData)`: Registers a new user account at `/auth/register`.
  - `forgotPassword(email)`: Requests password reset email at `/auth/forgot-password`.
  - `resetPassword(token, newPassword)`: Completes password reset at `/auth/reset-password`.
- **`profileService.js`**:
  - `getProfile()`: Retrieves user profile details (`/users/profile`).
  - `updateProfile(profileData)`: Updates account preferences and clinical profile attributes.
  - **Emergency Contacts**:
    - `addEmergencyContact(data)`: Creates new emergency contact (`/users/emergency-contacts`)
    - `updateEmergencyContact(id, data)`: Updates existing contact (`/users/emergency-contacts/:id`)
    - `deleteEmergencyContact(id)`: Soft-deletes contact (`/users/emergency-contacts/:id`)
  - **Allergies**:
    - `addAllergy(data)`: Creates new allergy record (`/users/allergies`)
    - `updateAllergy(id, data)`: Updates existing allergy (`/users/allergies/:id`)
    - `deleteAllergy(id)`: Soft-deletes allergy (`/users/allergies/:id`)

### Prescription Ingestion, History & Export (`prescriptionService.js`)
- `uploadAndAnalyze(file, options)`: Sends multipart image payload to `/ai/analyze` for full vision OCR analysis.
- `validateImage(file)`: Runs gate check validation on prescription images (`/ai/validate-image`).
- `listPrescriptions(params)`: Retrieves paginated list of ingested prescriptions (`/prescriptions`).
- `getHistory()`: Retrieves comprehensive audit log history for prescription events (`/prescriptions/history`).
- `exportPDF(id)`: Requests server-rendered PDF audit report (`/prescriptions/:id/export`). Returns a Blob.
- `exportMultiplePDF(ids)`: Bulk exports multiple prescriptions combined into a single PDF document (`/prescriptions/export-multiple`).
- `deletePrescription(id)`: Deletes a prescription record from history (`/prescriptions/:id`).

### Secure Prescription Sharing (`shareService.js`)
- `createShareLink(prescriptionId, options)`: Generates a secure access token and shareable URL (`/share/token`).
- `shareViaEmail(prescriptionId, email, options)`: Directly sends a prescription audit link to a clinical recipient (`/share/email`).
- `getSharedPrescription(token)`: Retrieves shared prescription details using a valid access token (`/share/view/:token`).

### Medication Adherence & Follow-ups
- **`reminderService.js`**:
  - `listReminders(params)`: Retrieves active medication schedules and dosage timings (`/reminders`).
  - `createReminder(data)`: Schedules a new medication reminder alert (`/reminders`).
  - `updateReminder(id, data)` / `deleteReminder(id)`: Manages existing reminders.
- **`followUpService.js`**:
  - `getFollowUps()`: Retrieves scheduled follow-up appointments (`/followups`).
  - `scheduleFollowUp(data)`: Creates a new clinical follow-up task.

### Clinical Analytics & Intelligence
- **`analyticsService.js`**:
  - `getUserAnalytics()`: Fetches real-time adherence rates, ingestion counts, and verification speeds.
- **`recommendationService.js`**:
  - `getRecommendations(prescriptionId)`: Retrieves AI-powered smart alternatives, generic substitutions, and cost savings.
- **`searchService.js`**:
  - `searchInteractions(query)`: Searches drug interaction database and clinical safety guidelines.
- **`feedbackService.js`**:
  - `submitFeedback(payload)`: Transmits user feedback or support tickets to backend support queues.

---

## 3. Human-Readable Error Translation (`errorMessages.js`)

All network catches pass through our error mapping utility (`src/utils/errorMessages.js`) via `getFriendlyErrorMessage(error)` to prevent raw stack traces from reaching the user.

### Mapping Rules:
| Error Condition | Raw / Axios Status | Translated Friendly Copy |
| :--- | :--- | :--- |
| **Network Unreachable** | `ERR_NETWORK` | *"Unable to connect to RxEase AI servers. Please check your internet connection."* |
| **Session Expired** | `401 Unauthorized` | *"Your session has expired. Please sign in again."* |
| **Forbidden** | `403 Forbidden` | *"You do not have permission to perform this action."* |
| **Duplicate Account** | `409 Conflict` | *"An account with this email already exists."* |
| **Rate Limited** | `429 Too Many Requests`| *"Too many requests. Please wait a few moments before trying again."* |
| **Unprocessable Content** | `422 Unprocessable` | *"The uploaded image does not appear to be a handwritten prescription. Please provide a clear, handwritten prescription image."* |
| **Service Unavailable** | `503 Unavailable` | *"We are having trouble analyzing the image. Please ensure it is a clear handwritten prescription and try again."* |
| **Server Error** | `500+ Internal Error` | *"RxEase AI cloud service encountered an error. Our clinical team has been notified."* |

---

## 4. Best Practices for Service Module Extensions

When creating new domain service files under `src/services/`, adhere to this standardized pattern:

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
