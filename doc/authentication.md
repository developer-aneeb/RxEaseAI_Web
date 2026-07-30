# Authentication Flow & Session Management

RxEaseAI incorporates a complete, secure authentication flow designed with privacy, HIPAA guidelines, and client-side validation in mind. The UI handles complex validation rules instantly via **React Hook Form** and **Zod**, providing immediate feedback before network requests are dispatched to the Node.js backend.

---

## Auth Pages Overview

All authentication pages are located in `src/pages/auth/`:

1. **`SignIn.jsx`**: Authenticates returning users via email/password credentials or OAuth providers.
2. **`SignUp.jsx`**: Registers new accounts, enforcing strict password complexity rules and mandatory Terms of Service acceptance.
3. **`ForgotPassword.jsx`**: Initiates account recovery by requesting a password reset email.
4. **`ResetPassword.jsx`**: Completes account recovery using a token, enforcing identical validation rules as SignUp.
5. **`VerifyEmail.jsx`**: Landing page instructing newly registered users to complete email verification.

---

## Global Session State: `useAuthStore`

Session state and credential persistence are managed centrally in `src/store/useAuthStore.js`:
- Uses Zustand with native `persist` middleware (`rxease-auth-storage`).
- Manages `user` profile objects, `token` (JWT access token), `refreshToken`, and an `isAuthenticated` boolean indicator.
- Exposes `login(userData, accessToken, refreshToken)` to hydrate state and `logout()` to clear session storage and redirect the browser to `/#signin`.
- Interacts cleanly with `src/services/apiClient.js` to automatically attach the `Authorization: Bearer <JWT_ACCESS_TOKEN>` header to outbound HTTP requests.

---

## Route Guards

Access control across application views is governed by higher-order components:
1. **`ProtectedRoute.jsx`**: Wraps protected clinical views (`/#home`, `/#upload`, `/#history`, `/#settings`, etc.). If `isAuthenticated` is false, it bounces the user to `/#signin`.
2. **`PublicRoute.jsx`**: Wraps Auth pages. If an authenticated user attempts to visit Sign In or Sign Up, they are redirected back to their workspace (`/#home`). Unverified users are directed to `/#verify-email`.

---

## Password Security: `PasswordStrengthPanel`

For `SignUp` and `ResetPassword`, the `PasswordStrengthPanel.jsx` component evaluates security criteria in real-time:
- Displays a 4-level visual strength indicator (Red -> Orange -> Yellow -> Green).
- Enforces key password rules:
  - Minimum 8 characters
  - At least one uppercase & lowercase letter
  - At least one numeric digit
  - At least one special symbol (`!@#$%^&*`)

> **Security Reminder**: All client-side validations are duplicated on the server side in the Node.js backend to prevent API bypass or automated script attacks.
