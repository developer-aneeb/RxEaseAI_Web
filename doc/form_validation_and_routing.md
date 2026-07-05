# Form Validation & Routing Architecture

To ensure a highly performant and scalable architecture, RxEaseAI leverages industry-standard tools for form state management, schema validation, and access control.

## 1. Form Management (React Hook Form)
Instead of managing form state manually with dozens of `useState` hooks, all authentication and user-input forms utilize **React Hook Form**.

**Benefits:**
- Reduces re-renders by adopting an uncontrolled component architecture.
- Simplifies submission logic and loading states.
- Cleanly integrates with validation schemas.

## 2. Schema Validation (Zod & Custom Helpers)
All validation logic is decoupled from the UI components and centralized into strict schemas and helper functions.
- **Location:** `src/utils/validation/zodSchemas.js` & `src/utils/validation/authValidation.js`

**Supported Schemas:**
1. **Authentication Schemas**: `signInSchema`, `signUpSchema` (with terms agreement and confirm password matching), `forgotPasswordSchema`, `resetPasswordSchema`.
2. **Clinical & Reminder Schemas**:
   - `reminderSchema`: Enforces medicine name, meal timing, and strict future date/time scheduling using `.superRefine()`.
   - **Future Date Validation (`validateReminderDateTime`)**: Evaluates the combined Date and Time inputs against `new Date()`. If a reminder is scheduled in the past or present, Zod immediately flags both inputs with custom error strings.
3. **Settings & Feedback Schemas**:
   - `profileSchema`: Enforces clinician full name, email, phone, and medical specialty.
   - `feedbackSchema`: Validates 1-5 star ratings and minimum 10-character clinical feedback notes.
   - `supportTicketSchema`: Enforces subject and description length for technical support requests.

**How it works:**
1. A Zod schema defines the exact types, requirements, and custom error messages for every field.
2. The schema is passed to React Hook Form via the `@hookform/resolvers/zod` package.
3. If the user violates a rule (e.g., setting a reminder in the past, leaving a required field empty), Zod instantly blocks submission and returns the exact error string directly to the UI layer (rendered cleanly under `<Input />`).

## 3. Error Message Mapping (`errorMessages.js`)
To prevent exposing raw database errors or technical HTTP status strings to healthcare professionals, all API catches pass through `getFriendlyErrorMessage(error)`.
- **Location:** `src/utils/errorMessages.js`
- **Functionality:** Intercepts Axios network exceptions (`ERR_NETWORK`), OAuth errors, and standard HTTP error codes (`401`, `409 Conflict`, `429 Rate Limit`), mapping them to clean, human-readable instructions in English.

## 4. Route Guarding Strategy
Because RxEaseAI uses a custom Hash Router (`App.jsx`), routing is protected via higher-order components.

- **`ProtectedRoute`**: Listens to `useAuthStore`. If `isAuthenticated` is false, it redirects to the Sign-In page (`/#signin`). Used for all clinical workspace views (`#home`, `#upload`, `#history`, `#history-dashboard`, `#billing`, `#reminders`, etc.).
- **`PublicRoute`**: The inverse of ProtectedRoute. It prevents authenticated users from accidentally returning to the Sign-In or Sign-Up pages by redirecting them back to their secure workspace (`/#home`). It also contains logic to enforce that unverified authenticated users are correctly redirected to the email verification page (`/#verify-email`).

These guards ensure that the client-side routing behaves exactly like a production SPA, cleanly separating public marketing/auth flows from the secure clinical workspace.
