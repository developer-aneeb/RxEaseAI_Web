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
