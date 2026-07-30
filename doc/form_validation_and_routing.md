# Form Validation & Routing Architecture

This document describes the form validation strategy and route management system powering the RxEaseAI frontend application.

---

## 1. Form Validation Strategy (React Hook Form + Zod)

To ensure high performance, prevent unnecessary re-renders, and enforce strict type safety, all forms utilize **React Hook Form** coupled with **Zod** schema validation via `@hookform/resolvers/zod`.

### Validation Schemas (`src/utils/validation/zodSchemas.js`)

Centralizing validation schemas ensures consistent validation logic across the entire application:

- **`signInSchema`**: Validates email format and non-empty password strings.
- **`signUpSchema`**: Enforces strict password requirements (min 8 chars, uppercase, lowercase, numbers, special symbols) and mandatory Terms of Service acceptance.
- **`forgotPasswordSchema`**: Validates email input format.
- **`resetPasswordSchema`**: Enforces password strength rules and matches password confirmation fields.
- **`reminderSchema`**: Validates medicine names, dosage formats, and future date/time constraints (`validateReminderDateTime`).

### Integration Example (`SignIn.jsx`)

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '../../utils/validation/zodSchemas';
import { Input } from '../../components/ui/Input';

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(signInSchema)
  });

  const onSubmit = async (data) => {
    // Submits validated data to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email Address"
        error={errors.email?.message}
        {...register('email')}
      />
    </form>
  );
}
```

---

## 2. Friendly Error Translation (`getFriendlyErrorMessage`)

To prevent raw network status strings or backend stack traces from confusing end users, all form error catches pass through `getFriendlyErrorMessage(error)` in `src/utils/errorMessages.js`:

- Intercepts network disconnections (`ERR_NETWORK`).
- Maps HTTP status codes (`401`, `403`, `409`, `422`, `429`, `503`, `500+`).
- Returns human-readable instructional messages.

---

## 3. Client-Side Hash Routing & Route Guards

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
