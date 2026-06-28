# Backend Integration Guide

This document provides a roadmap for integrating the static RxEaseAI frontend with a live backend API (e.g., Node.js/Express, Python/Django, Go).

## General Integration Principles

### 1. API Client Setup
The project already includes a centralized API client powered by `axios`.
- **Location**: `src/services/apiClient.js`
- **Features**: Automatically attaches the JWT `Bearer` token to outbound requests and handles global `401 Unauthorized` responses by clearing local storage and redirecting to the sign-in page.

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

All authentication forms (`SignIn`, `SignUp`, `ForgotPassword`, `ResetPassword`) currently simulate a network delay using `setTimeout`. You must replace these with real API calls.

### Example: Sign In Integration

**Current Stub (`SignIn.jsx`):**
```javascript
const onSubmit = (data) => {
  // data contains { email, password } provided by React Hook Form
  setTimeout(() => {
    setIsSuccess(true);
    setTimeout(() => {
      login(); // AuthContext method sets mock token
    }, 2000);
  }, 1500);
};
```

**Required Update (`SignIn.jsx`):**
```javascript
import api from '../utils/apiClient';
import { useAuth } from '../contexts/AuthContext';

// Assuming you add setToken() to your AuthContext
const { login } = useAuth(); 

const onSubmit = async (data) => {
  try {
    const response = await api.post('/auth/login', { 
      email: data.email, 
      password: data.password 
    });
    
    // 1. Store Token via Context
    login(response.data.token);
    
    // 2. Redirect User (handled by login() or Route Guards)
  } catch (error) {
    // 3. Handle Server Errors
    setApiError(error.response?.data?.message || 'Login failed.');
  }
};
```

### Expected Backend Payloads

For the frontend to work seamlessly, the backend should expose the following REST endpoints and accept the corresponding JSON bodies:

- **POST `/auth/register`**
  - Body: `{ "fullName": "John Doe", "email": "john@hospital.com", "password": "Secure123!" }`
  - Response: `201 Created`
- **POST `/auth/login`**
  - Body: `{ "email": "john@hospital.com", "password": "Secure123!" }`
  - Response: `200 OK`, `{ "token": "jwt_string", "user": { ... } }`
- **POST `/auth/forgot-password`**
  - Body: `{ "email": "john@hospital.com" }`
  - Response: `200 OK`
- **POST `/auth/reset-password`**
  - Body: `{ "token": "url_param_token", "password": "NewSecure123!" }`
  - Response: `200 OK`

---

## Future Feature: Integrating the AI Core

When integrating the actual Vision OCR logic, the workflow will likely involve File Uploads. 

1. Ensure the backend endpoint handles `multipart/form-data`.
2. Provide a polling mechanism, Server-Sent Events (SSE), or WebSockets to stream the OCR progress back to the frontend to power the "Laser Scanning" animations in real-time.
3. The expected output to the frontend should be structured FHIR/HL7 JSON that populates the dashboard tables.
