# Form Validation & Routing Architecture
This document describes the form validation strategy and route management system powering the RxEaseAI frontend application. To ensure a highly performant and scalable architecture, RxEaseAI leverages industry-standard tools for form state management, schema validation, and access control.

---
**How it works:**
1. A Zod schema defines the exact types, requirements, and custom error messages for every field.
2. The schema is passed to React Hook Form via the `@hookform/resolvers/zod` package.
3. If the user violates a rule (e.g., setting a reminder in the past, leaving a required field empty), Zod instantly blocks submission and returns the exact error string directly to the UI layer (rendered cleanly under `<Input />`).


## 1. Form Validation Strategy (React Hook Form + Zod)

To ensure high performance, prevent unnecessary re-renders, and enforce strict type safety, all forms utilize **React Hook Form** coupled with **Zod** schema validation via `@hookform/resolvers/zod`.
Instead of managing form state manually with dozens of `useState` hooks, all authentication and user-input forms utilize **React Hook Form**.
  
**Benefits:**
- Reduces re-renders by adopting an uncontrolled component architecture.
- Simplifies submission logic and loading states.
- Cleanly integrates with validation schemas.


### Validation Schemas (`src/utils/validation/zodSchemas.js`)

Centralizing validation schemas ensures consistent validation logic across the entire application:

- **`signInSchema`**: Validates email format and non-empty password strings.
- **`signUpSchema`**: Enforces strict password requirements (min 8 chars, uppercase, lowercase, numbers, special symbols) and mandatory Terms of Service acceptance.
- **`forgotPasswordSchema`**: Validates email input format.
- **`resetPasswordSchema`**: Enforces password strength rules and matches password confirmation fields.
- **`reminderSchema`**: Validates medicine names, dosage formats, and future date/time constraints (`validateReminderDateTime`).

---

## 2. Friendly Error Translation (`getFriendlyErrorMessage`)

To prevent raw network status strings or backend stack traces from confusing end users, all form error catches pass through `getFriendlyErrorMessage(error)` in `src/utils/errorMessages.js`:

- Intercepts network disconnections (`ERR_NETWORK`).
- Maps HTTP status codes (`401`, `403`, `409`, `422`, `429`, `503`, `500+`).
- Returns human-readable instructional messages.

---

## 3. Error Message Mapping (`errorMessages.js`)
To prevent exposing raw database errors or technical HTTP status strings to healthcare professionals, all API catches pass through `getFriendlyErrorMessage(error)`.
- **Location:** `src/utils/errorMessages.js`
- **Functionality:** Intercepts Axios network exceptions (`ERR_NETWORK`), OAuth errors, and standard HTTP error codes (`401`, `409 Conflict`, `429 Rate Limit`), mapping them to clean, human-readable instructions in English.

## 4. Client-Side Hash Routing & Route Guards

Routing is driven by a lightweight **Hash Navigator** in `App.jsx`, providing SPA behavior without server-side rewrite dependencies.

### Route Guard Components (`src/components/auth/`)

- **`ProtectedRoute.jsx`**: Listens to `useAuthStore`. If `isAuthenticated` is false, it redirects unauthenticated requests to `/#signin`.
- **`PublicRoute.jsx`**: Prevents logged-in users from returning to Auth pages by redirecting them back to their workspace (`/#home`). Unverified users are directed to `/#verify-email`.

```jsx
// App.jsx snippet
{currentHash === '#home' && (
  <ProtectedRoute>
    <HomePage />
  </ProtectedRoute>
)}
```