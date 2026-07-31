# Backend Integration & REST API Architecture

This document details the backend integration specifications and REST API contracts connecting the RxEaseAI React Frontend with the Node.js Express Gateway and Python AI Microservice.

---

## 1. Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│    (Zustand Stores, Axios Client, React Hook Form)     │
└───────────────────────────┬────────────────────────────┘
                            │  HTTP / REST (JWT Bearer)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Node.js Express API Gateway               │
│      (Port 3000 — Auth, Persistence, Middleware)       │
└───────────────────────────┬────────────────────────────┘
                            │  Internal HTTP / Multipart
                            ▼
┌────────────────────────────────────────────────────────┐
│               Python AI Microservice                   │
│    (FastAPI — Nemotron Gate, Roboflow, Qwen OCR)       │
└────────────────────────────────────────────────────────┘
```

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
## API Client Setup & Token Persistence

Network requests originate from the centralized Axios client exported from `src/services/apiClient.js`.

### Client Configuration
- **Base URL**: Dynamically configured via `import.meta.env.VITE_API_URL` (defaults to `http://localhost:3000/api/v1`).
- **Request Interceptor**: Reads authentication state from Zustand's persistent storage (`rxease-auth-storage` or `rxease_token`) and injects the `Authorization: Bearer <JWT_ACCESS_TOKEN>` header.
- **Response Interceptor**: Intercepts `401 Unauthorized` responses globally, purges local session tokens, invokes `useAuthStore.getState().logout()`, and redirects the user to `/#signin`.

---

## 3. Environment Setup

Create a `.env` file at the root of the `frontend/` workspace:

```env
# Node.js API Gateway URL
VITE_API_URL=http://localhost:3000/api/v1
```

> **Security Note**: Never commit actual API keys, database secrets, or private tokens into the frontend repository or environment templates.

---

## 4. API Endpoint Contracts

Below are the primary REST endpoints consumed by the frontend service layer (`src/services/`):

### Authentication & Profile (`authService.js`, `profileService.js`)

#### **POST `/auth/register`**
- **Body**: `{ "fullName": "John Doe", "email": "user@example.com", "password": "<USER_PASSWORD>" }`
- **Response (`201 Created`)**: `{ "message": "User registered successfully", "user": { "id": "uuid", "email": "user@example.com" } }`

#### **POST `/auth/login`**
- **Body**: `{ "email": "user@example.com", "password": "<USER_PASSWORD>" }`
- **Response (`200 OK`)**: `{ "token": "<JWT_ACCESS_TOKEN>", "refreshToken": "<JWT_REFRESH_TOKEN>", "user": { "id": "uuid", "email": "user@example.com", "fullName": "John Doe" } }`

#### **POST `/auth/forgot-password`**
- **Body**: `{ "email": "user@example.com" }`
- **Response (`200 OK`)**: `{ "message": "Password reset email sent." }`

#### **POST `/auth/reset-password`**
- **Body**: `{ "token": "<RESET_TOKEN>", "password": "<NEW_PASSWORD>" }`
- **Response (`200 OK`)**: `{ "message": "Password has been successfully reset." }`

#### **PUT `/users/profile`**
- **Body**: `{ "fullName": "Dr. Sarah Jenkins", "phone": "+92 300 1234567", "specialty": "Cardiology" }`
- **Response (`200 OK`)**: `{ "success": true, "user": { ... } }`

---

### AI Prescription Processing (`prescriptionService.js`)

#### **POST `/ai/analyze?persist=true`**
- **Format**: `multipart/form-data` with `file` containing prescription image.
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "allowed": true,
    "ocr": { "full_text": "Augmentin 625mg tab 1x3", "total_segments": 3 },
    "structured": { "items": [ { "text": "Augmentin", "entity_type": "medicine_candidate" } ] },
    "validated": { "items": [ { "input": "Augmentin", "matched": true, "matched_name": "Augmentin 625mg" } ] }
  }
  ```
- **Error Response (`422 Unprocessable Content`)**: Triggered when image gate validation fails (e.g., non-prescription image).
  ```json
  {
    "success": false,
    "allowed": false,
    "message": "The uploaded image does not appear to be a handwritten prescription. Please provide a clear, handwritten prescription image."
  }
  ```
- **Error Response (`503 Service Unavailable`)**: Triggered when AI inference capacity is temporarily exceeded.
  ```json
  {
    "success": false,
    "message": "We are having trouble analyzing the image. Please ensure it is a clear handwritten prescription and try again."
  }
  ```

---

### Prescription Sharing (`shareService.js`)

#### **POST `/share/token`**
- **Body**: `{ "prescriptionId": "RX1001", "expiryDays": 7 }`
- **Response (`200 OK`)**: `{ "token": "<SHARE_TOKEN>", "shareUrl": "https://rx-ease-ai-web.vercel.app/#share/view/<SHARE_TOKEN>" }`

#### **POST `/share/email`**
- **Body**: `{ "prescriptionId": "RX1001", "recipientEmail": "doctor@example.com", "notes": "Please review prescription." }`
- **Response (`200 OK`)**: `{ "status": "sent" }`

---

### Reminders & Analytics (`reminderService.js`, `analyticsService.js`)

#### **POST `/reminders`**
- **Body**: `{ "medicineName": "Augmentin", "dosage": "625mg", "frequency": "Daily", "time": "08:00" }`
- **Response (`201 Created`)**: `{ "id": "rem_101", "status": "scheduled" }`

#### **GET `/analytics/user`**
- **Response (`200 OK`)**: `{ "totalPrescriptions": 12, "accuracyRate": 98.4, "savingsTotalPKR": 4500 }`
