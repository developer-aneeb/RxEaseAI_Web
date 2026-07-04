# Form Validation & Routing Architecture

To ensure a highly performant and scalable architecture, RxEaseAI leverages industry-standard tools for form state management, schema validation, and access control.

## 1. Form Management (React Hook Form)
Instead of managing form state manually with dozens of `useState` hooks, all authentication and user-input forms utilize **React Hook Form**.

**Benefits:**
- Reduces re-renders by adopting an uncontrolled component architecture.
- Simplifies submission logic and loading states.
- Cleanly integrates with validation schemas.

## 2. Schema Validation (Zod)
All validation logic is decoupled from the UI components and centralized into strict schemas.
- **Location:** `src/utils/validation/zodSchemas.js`

**How it works:**
1. A Zod schema (e.g., `signInSchema`, `signUpSchema`) defines the exact types, requirements, and custom error messages for every field.
2. The schema is passed to React Hook Form via the `@hookform/resolvers/zod` package.
3. If the user violates a rule (e.g., leaving a required field empty, mismatched passwords), Zod instantly blocks submission and returns the exact error string defined in the schema directly to the UI layer.

## 3. Route Guarding Strategy
Because RxEaseAI uses a custom Hash Router (`App.jsx`), routing is protected via higher-order components.

- **`ProtectedRoute`**: Listens to `useAuthStore`. If `isAuthenticated` is false, it redirects to the Sign-In page. Used for the Home, Analytics, and Upload screens.
- **`PublicRoute`**: The inverse of ProtectedRoute. It prevents authenticated users from accidentally returning to the Sign-In or Sign-Up pages by redirecting them back to their secure workspace. It also contains logic to enforce that unverified authenticated users are correctly bound to the email verification page.

These guards ensure that the client-side routing behaves exactly like a production SPA, cleanly separating public marketing/auth flows from the secure application interior.
