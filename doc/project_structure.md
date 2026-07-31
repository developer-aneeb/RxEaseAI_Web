# Project Structure Reference

This document provides a comprehensive mapping of the RxEaseAI frontend workspace directory layout.

```
frontend/
├── doc/                        # Architectural & Integration Guides
│   ├── api_services.md         # API client & domain service specifications
│   ├── architecture.md         # Core React 19 architecture overview
│   ├── authentication.md       # Auth flows & route guard documentation
│   ├── backend_integration_guide.md # REST API endpoint contracts
│   ├── components.md           # Reusable UI component props & primitives
│   ├── form_validation_and_routing.md # React Hook Form & Zod validation
│   ├── new_features_guide.md   # Step-by-step developer playbook
│   ├── project_structure.md    # Workspace directory mapping (this file)
│   ├── state_management.md     # Zustand store architectures
│   └── theming.md              # Tailwind v4 theme engine & FOUC prevention
├── public/                     # Static assets (logos, branding, favicons)
├── src/
│   ├── animations/             # Reusable Framer Motion animation variants
│   ├── components/             # React Component Architecture
│   │   ├── auth/               # Auth components & Route guards (ProtectedRoute, PublicRoute)
│   │   ├── layout/             # Macro layouts (Navbar, Footer, Sidebar, Topbar)
│   │   ├── sections/           # Large landing/home page sections
│   │   └── ui/                 # Atomic primitives (Button, Card, Badge, MaterialIcon, Input, Modal)
│   ├── contexts/               # React Context Providers (ToastContext)
│   ├── pages/                  # Top-level Page Views & Workspaces
│   │   ├── LandingPage.jsx     # Marketing page (`/`)
│   │   ├── HomePage.jsx        # Protected Workspace Dashboard (`#home`)
│   │   ├── auth/               # SignIn, SignUp, ForgotPassword, ResetPassword, VerifyEmail
│   │   ├── prescription/       # Ingestion & Results (UploadPage, ResultPage, HistoryPage, etc.)
│   │   ├── reminder/           # Medication Reminders (RemindersPage)
│   │   ├── analytics/          # Clinical Analytics (AnalyticsPage)
│   │   ├── search/             # Interaction Search (SearchPage)
│   │   ├── notifications/      # Alert Center (NotificationsPage)
│   │   ├── billing/            # Subscriptions OS (BillingPage)
│   │   └── settings/           # Profile & Preferences (SettingsPage)
│   ├── services/               # API Networking Layer
│   │   ├── apiClient.js        # Configured Axios instance with JWT interceptors
│   │   ├── authService.js      # Auth REST endpoints
│   │   ├── prescriptionService.js # AI Vision & OCR endpoints
│   │   ├── shareService.js     # Secure prescription link sharing
│   │   └── ...                 # Domain services (reminder, analytics, search, feedback)
│   ├── store/                  # Zustand Global State
│   │   ├── useAuthStore.js     # User session & JWT tokens (`rxease-auth-storage`)
│   │   ├── useThemeStore.js    # Theme mode management (Light/Dark)
│   │   ├── usePrescriptionStore.js # Prescription OCR & scan history (`rxease-prescription-storage`)
│   │   └── useAppStore.js      # UI state, Toast queue (`rxease-app-storage`)
│   ├── styles/                 # Shared CSS modules and utility classes
│   ├── utils/                  # Validation & Helper Utilities
│   │   ├── errorMessages.js    # Friendly API error string translator
│   │   ├── authValidation.js   # Date/time & auth validation helpers
│   │   └── validation/         # Zod schemas (zodSchemas.js)
│   ├── App.jsx                 # Routing Container & Hash Navigator
│   ├── index.css               # Tailwind CSS v4 directives
│   └── main.jsx                # React app entry point
├── .env                        # Local environment variables (VITE_API_URL)
├── index.html                  # HTML entry point with inline FOUC prevention script
├── package.json                # Dependencies & npm scripts
└── vite.config.js              # Vite configuration
```

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
- `LandingPage.jsx`: The primary marketing and feature demonstration view (`/`).
- `HomePage.jsx`: The central protected clinical workspace dashboard (`#home`).
- `auth/`: Directory containing all authentication flows (`SignIn.jsx`, `SignUp.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `VerifyEmail.jsx`).
- `prescription/`: Clinical prescription workflows:
  - `UploadPage.jsx`: OCR upload and live scanning (`#upload`).
  - `ResultPage.jsx`: Clinical intelligence dashboard (`#result`).
  - `HistoryPage.jsx`: Comprehensive prescription audit archive with bulk export and secure sharing (`#history`).
  - `HistoryDashboardPage.jsx`: Analytics dashboard (`#history-dashboard`).
  - `RecommendationPage.jsx`: Smart alternatives & cost savings (`#recommendations`).
- `reminder/`: Medication reminders center (`RemindersPage.jsx` at `#reminders`).
- `analytics/`: Clinical intelligence summaries and charts (`AnalyticsPage.jsx` at `#analytics`).
- `search/`: Drug interaction search engine (`SearchPage.jsx` at `#search`).
- `notifications/`: System alert center with Unread & High Priority filtering (`NotificationsPage.jsx` at `#notifications`).
- `billing/`: Localized Pakistan subscription and billing OS (`BillingPage.jsx` at `#billing`).
- `settings/`: Profile configuration, clinical feedback, and support ticket system (`SettingsPage.jsx` at `#settings`).

### `styles/`
- Contains any complex, highly specific CSS outside of standard Tailwind utilities.

### `services/`
- `apiClient.js`: Centralized Axios instance with request/response interceptors to attach tokens from `rxease-auth-storage` and handle 401s.
- `authService.js`: Pre-built API endpoints for user authentication actions (login, signup, reset, etc.).
- `prescriptionService.js`: Endpoints for listing prescriptions, retrieving history logs, single/bulk PDF report exports, and deletions.
- `shareService.js`: Functions for generating secure share links (`createShareLink`), email sharing (`shareViaEmail`), and viewing shared records.
- `reminderService.js` & `followUpService.js`: API endpoints for scheduling medication reminders and doctor follow-up check-ins.
- `analyticsService.js` & `recommendationService.js`: Endpoints for fetching real-time operational metrics and AI alternative recommendations.
- `searchService.js`, `profileService.js`, & `feedbackService.js`: Specialized services for drug interaction queries, account profile updates, and support feedback.

### `utils/`
- `errorMessages.js`: A dictionary utility mapping raw backend error strings into friendly UI copy.
- `validation/`:
  - `zodSchemas.js`: The single source of truth for all form validation schemas (`signInSchema`, `signUpSchema`, `reminderSchema`, `profileSchema`, `feedbackSchema`, `supportTicketSchema`).
  - `authValidation.js`: Helper validation functions including `validateReminderDateTime` for enforcing future date/time constraints.

### Core Entry Files
- `App.jsx`: The main React Router (Hash-based) orchestrating all pages and route guards.
- `main.jsx`: The absolute entry point that renders the `App` into the DOM.
- `index.css`: Imports Tailwind CSS and defines custom CSS variables.
