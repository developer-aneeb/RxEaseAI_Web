# Backend Integration Guide

This document provides a roadmap for integrating the static RxEaseAI frontend with a live backend API (e.g., Node.js/Express, Python/Django, Go).

## General Integration Principles

### 1. API Client Setup
Do not use raw `fetch()` calls scattered across components. Instead, create a centralized `src/utils/apiClient.js` (using a library like `axios` or standard `fetch`) that automatically attaches authorization headers and handles global errors.

```javascript
// src/utils/apiClient.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Automatically attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### 2. Environment Variables
API Base URLs should be managed via Vite environment variables. Create a `.env` file at the root of the frontend folder:
```
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Integrating Authentication

All authentication forms (`SignIn`, `SignUp`, `ForgotPassword`, `ResetPassword`) currently simulate a network delay using `setTimeout`. You must replace these with real API calls.

### Example: Sign In Integration

**Current Stub (`SignIn.jsx`):**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  // ... validation logic ...
  
  setIsSubmitting(true);
  
  // TO DO: Replace with API Call
  setTimeout(() => {
    setIsSubmitting(false);
    window.location.hash = '#dashboard';
  }, 1500);
};
```

**Required Update (`SignIn.jsx`):**
```javascript
import api from '../utils/apiClient';

const handleSubmit = async (e) => {
  e.preventDefault();
  // ... validation logic ...
  
  setIsSubmitting(true);
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // 1. Store Token (Consider HttpOnly cookies for better security)
    localStorage.setItem('token', response.data.token);
    
    // 2. Redirect User
    window.location.hash = '#dashboard';
  } catch (error) {
    // 3. Handle Server Errors (e.g., Invalid Credentials)
    setErrors({ server: error.response?.data?.message || 'Login failed.' });
  } finally {
    setIsSubmitting(false);
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
