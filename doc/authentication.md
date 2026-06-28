# Authentication Flow & Session Management

RxEaseAI incorporates a complete, secure authentication flow designed with HIPAA compliance and rigorous client-side validation in mind. The UI handles complex validation rules instantly via **React Hook Form** and **Zod**, providing immediate feedback before any backend request is triggered.

## Auth Pages Overview

All authentication pages are located in `src/pages/auth/` and include:

1. **`SignIn.jsx`**: Handles returning users with email/password and OAuth (Google/Apple) stubs.
2. **`SignUp.jsx`**: Captures new user registrations, including robust password creation rules and a mandatory Terms of Service checkbox.
3. **`ForgotPassword.jsx`**: Initiates the account recovery flow via email.
4. **`ResetPassword.jsx`**: Handles the final step of recovery, enforcing the same rigorous password rules as the SignUp flow.
5. **`VerifyEmail.jsx`**: A dedicated landing page instructing the user to check their inbox, complete with a resend timer.

## Global Session State: AuthContext

To manage authentication persistence without a real backend, the application utilizes a centralized Context Provider:
- **`src/contexts/AuthContext.jsx`**
- Manages an `isAuthenticated` boolean state.
- Stores a mock token (`rxease_token`) in `localStorage` to simulate session persistence across browser refreshes.
- Exposes `login()` and `logout()` functions that seamlessly update the global state and trigger route redirects.

## Route Guards

The application enforces access control using wrapper components:
1. **`ProtectedRoute.jsx`**: Wraps secure views (like the Dashboard). If `isAuthenticated` is false, it instantly bounces the user to `/#signin`.
2. **`PublicRoute.jsx`**: Wraps the Auth pages. If an already authenticated user tries to visit Sign In or Sign Up, they are instantly redirected back to their workspace (`/#dashboard`).

## Security Visuals: `PasswordStrengthPanel`

For both `SignUp` and `ResetPassword`, the `PasswordStrengthPanel.jsx` component is utilized.

### Functionality
- Evaluates the current `password` string in real-time.
- Displays a 4-bar colored strength indicator (Red -> Orange -> Yellow -> Green).
- Enforces strict rules:
  - 8+ characters
  - Lowercase & Uppercase letters
  - Numbers
  - Special symbols
- Returns a UI block highlighting exactly which criteria the user has met.

> **Security Note**: While client-side validation provides a great UX, these exact same validations **must** be duplicated on the backend server before creating or updating any user credentials to prevent API abuse.
