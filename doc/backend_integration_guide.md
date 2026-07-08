# Backend Integration Guide

This document provides a roadmap for integrating the static RxEaseAI frontend with a live backend API (e.g., Node.js/Express, Python/Django, Go).

## General Integration Principles

### 1. API Client Setup & Token Persistence
The project includes a centralized API client powered by `axios`.
- **Location**: `src/services/apiClient.js`
- **Zustand Persist Compatibility**: Because `useAuthStore` utilizes Zustand's `persist` middleware under the key `rxease-auth-storage`, `apiClient.js` includes custom request interceptor logic that parses `localStorage.getItem('rxease-auth-storage')` (JSON containing `{ state: { token, user, ... } }`) or fallbacks to plain `rxease_token` to attach the JWT `Bearer` token to outbound requests.
- **Error Interceptors**: Automatically handles global `401 Unauthorized` responses by clearing storage, invoking `useAuthStore.getState().logout()`, and redirecting to `#signin`.

### 2. The Service Layer
Rather than putting API calls directly into React components, the project uses the service pattern.
- **Location**: `src/services/authService.js`
- **Current State**: Contains fully pre-built asynchronous functions for `login`, `signup`, `resetPassword`, `getProfile`, etc.

### 3. Environment Variables
API Base URLs are managed via Vite environment variables. Create a `.env` file at the root of the frontend folder:
```
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Integrating Authentication

All authentication forms (`SignIn`, `SignUp`, `ForgotPassword`, `ResetPassword`) currently simulate a network delay using `setTimeout` or point to standard endpoint stubs. You must replace these with live backend services.

### Example: Sign In Integration

**Current Stub (`SignIn.jsx`):**
```javascript
const login = useAuthStore((state) => state.login);

const onSubmit = async (data) => {
  try {
    // login action in useAuthStore hydrates Zustand store & persisted storage
    await login(data, 'sample_jwt_token', 'sample_refresh_token');
    showToast('Welcome Back!', 'success');
  } catch (error) {
    showToast(getFriendlyErrorMessage(error), 'error');
  }
};
```

**Zustand Auth Store Action (`useAuthStore.js`):**
```javascript
// Inside useAuthStore creation block
login: (userData, accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('rxease_token', accessToken);
  }
  set({
    user: userData,
    token: accessToken || null,
    refreshToken: refreshToken || null,
    isAuthenticated: true
  });
  window.location.hash = '#home';
}
```

### Expected Backend Payloads

For the frontend to work seamlessly, the backend should expose the following REST endpoints and accept the corresponding JSON bodies:

#### Authentication & Profile
- **POST `/auth/register`**
  - Body: `{ "fullName": "John Doe", "email": "john@hospital.com", "password": "Secure123!" }`
  - Response: `201 Created`
- **POST `/auth/login`**
  - Body: `{ "email": "john@hospital.com", "password": "Secure123!" }`
  - Response: `200 OK`, `{ "token": "jwt_string", "refreshToken": "refresh_string", "user": { ... } }`
- **POST `/auth/forgot-password`**
  - Body: `{ "email": "john@hospital.com" }`
  - Response: `200 OK`
- **POST `/auth/reset-password`**
  - Body: `{ "token": "url_param_token", "password": "NewSecure123!" }`
  - Response: `200 OK`
- **PUT `/users/profile`**
  - Body: `{ "fullName": "Dr. Sarah Jenkins", "phone": "+92 300 1234567", "specialty": "Cardiology" }`
  - Response: `200 OK`

#### Prescription & Vision OCR
- **POST `/prescriptions/upload`** (`multipart/form-data`)
  - Body: Prescription image/PDF file
  - Response: `202 Accepted`, `{ "scanId": "scan_123", "status": "processing" }`
- **GET `/prescriptions/history`**
  - Response: `200 OK`, `{ "data": [ { "id": "h-1", "doctor": "Dr. Thorne", ... } ] }`
- **POST `/prescriptions/:id/export`**
  - Response: `200 OK` (`application/pdf` binary stream / Buffer)
- **POST `/prescriptions/export-multiple`**
  - Body: `{ "ids": ["RX001", "RX002"] }`
  - Response: `200 OK` (`application/pdf` combined report binary stream)

#### Prescription Sharing & Access Controls
- **POST `/share/token`**
  - Body: `{ "prescriptionId": "RX1766400474537VA1XA", "expiryDays": 7, "accessType": "view_only" }`
  - Response: `200 OK`, `{ "token": "share_token_abc123", "shareUrl": "https://rxease.ai/share/view/share_token_abc123" }`
- **POST `/share/email`**
  - Body: `{ "prescriptionId": "RX1766400474537VA1XA", "recipientEmail": "doctor@hospital.com", "notes": "Please review dosage." }`
  - Response: `200 OK`, `{ "status": "sent" }`

#### Medication Reminders
- **POST `/reminders`**
  - Body: `{ "medicineName": "Lisinopril", "dosage": "10mg", "frequency": "Daily", "time": "08:00", "date": "2026-07-10", "mealTiming": "after_meal" }`
  - Response: `201 Created`
- **GET `/reminders`**
  - Response: `200 OK`, `{ "reminders": [ ... ] }`

#### Billing & Subscriptions (Pakistan Localized OS)
- **GET `/billing/subscription`**
  - Response: `200 OK`, `{ "plan": "pro", "pricePKR": 2499, "status": "active", "renewalDate": "2026-08-01" }`
- **POST `/billing/subscription`**
  - Body: `{ "planId": "team", "billingCycle": "monthly" }`
  - Response: `200 OK`
- **POST `/billing/payment-methods`**
  - Body: `{ "type": "easypaisa", "accountNumber": "03001234567" }` (or `card`, `jazzcash`, `bank_transfer`)
  - Response: `201 Created`
- **PUT `/billing/ntn-profile`**
  - Body: `{ "companyName": "City Clinic", "ntnNumber": "1234567-8", "address": "Karachi, Pakistan" }`
  - Response: `200 OK`

---

## Integrating the AI Core & WebSockets

When integrating the actual Vision OCR logic:
1. Ensure the backend endpoint handles `multipart/form-data`.
2. Provide Server-Sent Events (SSE) or WebSockets (`/ws/ocr`) to stream line-by-line segmentation progress back to `usePrescriptionStore` to power the "Laser Scanning" animations in real-time.
3. The expected output to the frontend should be structured FHIR/HL7 JSON that automatically hydrates `usePrescriptionStore.getState().addHistoryEntry()`.
