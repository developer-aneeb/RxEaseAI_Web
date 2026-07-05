# Comprehensive Project Structure

This document provides a detailed breakdown of the RxEaseAI frontend codebase as it currently stands.

## Root Directory
- `.env`: Environment variables (e.g. VITE_API_URL).
- `eslint.config.js`: ESLint configuration for code quality.
- `index.html`: The HTML template where the React app mounts and where the FOUC-prevention script lives.
- `vite.config.js`: Configuration for the Vite bundler and dev server.
- `package.json`: Project metadata, scripts, and dependencies (React, Tailwind v4, Zod, React Hook Form, etc.).

## `doc/`
Contains all architectural, thematic, and integration documentation.

## `src/` (Source Code)
The entire application logic resides here.

### `animations/`
- `variants.js`: Centralized Framer Motion variants for consistent UI animations.

### `components/`
- `auth/`: Authentication-specific components like `PasswordStrengthPanel.jsx`, and route guarding wrappers (`ProtectedRoute.jsx`, `PublicRoute.jsx`).
- `layout/`: Macro components like `Navbar.jsx`, `SideNavbar.jsx` (standardized responsive workspace sidebar), and `Footer.jsx`.
- `sections/`: High-level page segments used to compose the Landing Page (e.g., `Hero.jsx`, `Analytics.jsx`).
- `ui/`: Reusable, atomic design primitives (`Button.jsx`, `Card.jsx`, `MaterialIcon.jsx`, `Badge.jsx`, `SectionHeader.jsx`, `Spinner.jsx`, `Toast.jsx`, `Input.jsx`, `Modal.jsx`).

### `contexts/`
- `ToastContext.jsx`: Global context provider wrapping the app and rendering the active toasts queue populated by `useAppStore`.

### `store/` (Zustand Global State Stores with Persistence)
- `useAuthStore.js`: Global store for auth credentials, JWT keys, and user profiles. Uses `persist` middleware (`rxease-auth-storage`).
- `useThemeStore.js`: Global store for dark/light state and DOM node class updates. Persists directly to `localStorage`.
- `usePrescriptionStore.js`: Global store tracking prescription uploads, AI progress, and clinical history. Uses `persist` middleware (`rxease-prescription-storage`).
- `useAppStore.js`: Global store for sidebar, layout settings, and notification toasts. Uses `persist` middleware (`rxease-app-storage`).

### `hooks/` (Deprecated)
- `useAuth.js` & `useTheme.js`: Emptied and deprecated facade hooks. Direct Zustand store imports should be used instead.

### `pages/`
- `LandingPage.jsx`: The primary marketing and feature demonstration view.
- `HomePage.jsx`: The central protected clinical workspace dashboard.
- `auth/`: Directory containing all authentication flows (`SignIn.jsx`, `SignUp.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `VerifyEmail.jsx`).
- `prescription/`: Clinical prescription workflows (`UploadPage.jsx`, `HistoryPage.jsx`, `HistoryDashboardPage.jsx`, `RecommendationPage.jsx`, `ResultPage.jsx`, `RemindersPage.jsx`).
- `analytics/`: Clinical intelligence summaries and charts (`AnalyticsPage.jsx`).
- `search/`: Drug interaction search engine (`SearchPage.jsx`).
- `notifications/`: System alert center (`NotificationsPage.jsx`).
- `billing/`: Localized Pakistan subscription and billing OS (`BillingPage.jsx`).
- `settings/`: Profile configuration, clinical feedback, and support ticket system (`SettingsPage.jsx`).

### `styles/`
- Contains any complex, highly specific CSS outside of standard Tailwind utilities.

### `services/`
- `apiClient.js`: Centralized Axios instance with request/response interceptors to attach tokens from `rxease-auth-storage` and handle 401s.
- `authService.js`: Pre-built API endpoints for all authentication actions (login, signup, reset, etc.).

### `utils/`
- `errorMessages.js`: A dictionary utility mapping raw backend error strings into friendly UI copy.
- `validation/`:
  - `zodSchemas.js`: The single source of truth for all form validation schemas (`signInSchema`, `signUpSchema`, `reminderSchema`, `profileSchema`, `feedbackSchema`, `supportTicketSchema`).
  - `authValidation.js`: Helper validation functions including `validateReminderDateTime` for enforcing future date/time constraints.

### Core Entry Files
- `App.jsx`: The main React Router (Hash-based) orchestrating all pages and route guards.
- `main.jsx`: The absolute entry point that renders the `App` into the DOM.
- `index.css`: Imports Tailwind CSS and defines custom CSS variables.
