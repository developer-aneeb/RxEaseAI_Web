# Architecture Overview

This document outlines the high-level architecture of the RxEaseAI frontend application. The project is built using modern web standards to ensure high performance, maintainability, security, and a seamless developer experience.

---

## Core Technologies

- **React 19**: The core UI library used for building interactive, component-driven clinical interfaces.
- **Vite 8**: The lightning-fast build tool and local development server.
- **Tailwind CSS v4**: A utility-first CSS framework for rapid UI styling, customized heavily via CSS-first directives (`@theme`).
- **Zustand 5**: Fast, scalable state management with native `persist` middleware.
- **Axios**: Centralized HTTP client configured with JWT interceptors, automatic error handling, and timeout controls.
- **Framer Motion**: Used across the application for smooth, physics-based animations, page transitions, and micro-interactions.
- **Lucide & Material Symbols**: Scalable vector icons used consistently across UI components.

---

## Folder Structure

The application's source code is contained within the `src/` directory. The structure is domain-driven and separated by architectural concerns:

```
src/
├── animations/        # Reusable Framer Motion variants (staggerContainer, fadeInUp, etc.)
├── components/        # Reusable React components
│   ├── auth/          # Authentication-specific components and route guards
│   ├── layout/        # Macro-level layout components (Navbar, Footer, Sidebar, Topbar)
│   ├── sections/      # Large page sections (Hero, Features, Analytics)
│   └── ui/            # Micro-level primitives (Button, Card, Badge, MaterialIcon, Modal, Input)
├── contexts/          # Context providers (ToastContext)
├── store/             # Zustand global state stores (useAuthStore, useThemeStore, usePrescriptionStore, useAppStore)
├── pages/             # Top-level route components (LandingPage, auth/, prescription/, etc.)
├── services/          # API Service layer (apiClient.js, authService.js, prescriptionService.js, etc.)
├── styles/            # Shared style utilities or specific complex CSS modules
├── utils/             # Helpers (errorMessages.js, zodSchemas.js, authValidation.js)
├── App.jsx            # Main router and state container
├── index.css          # Tailwind entry point and global styles
└── main.jsx           # React mount point
```

---

## Routing & Access Control

The application utilizes a **Hash-based Routing System** managed inside `App.jsx`. Access to secure clinical workflows is enforced using higher-order Route Guard components:

- **`ProtectedRoute`**: Queries `isAuthenticated` from `useAuthStore`. If false, it redirects unauthenticated users to `/#signin`.
- **`PublicRoute`**: Prevents logged-in users from accessing Sign-In/Sign-Up pages by redirecting them to `/#home`. Also ensures unverified users are directed to `/#verify-email`.

```javascript
// App.jsx Guard Example
if (currentHash === '#home') {
    return <ProtectedRoute><HomePage /></ProtectedRoute>;
}
```

### Supported Routes

- `/` (or no hash): `LandingPage` (Public Marketing View)
- `#signin`: `SignIn` (Authentication)
- `#signup`: `SignUp` (Account Registration)
- `#forgot-password`: `ForgotPassword` (Password Recovery Request)
- `#reset-password`: `ResetPassword` (Password Reset Confirmation)
- `#verify-email`: `VerifyEmail` (Email Verification Instructions)
- `#home`: `HomePage` (Protected Application Dashboard)
- `#upload`: `UploadPage` (Prescription Upload & AI Scan)
- `#result`: `ResultPage` (AI OCR & Clinical Extraction View)
- `#history`: `HistoryPage` (Prescription Archive & PDF Reports)
- `#history-dashboard`: `HistoryDashboardPage` (Analytics & Verification Summary)
- `#recommendations`: `RecommendationPage` (AI Smart Alternatives & Savings)
- `#search`: `SearchPage` (Drug Interaction & Clinical Search Engine)
- `#analytics`: `AnalyticsPage` (Clinical Trends & Intelligence Summary)
- `#reminders`: `RemindersPage` (Medication Reminder Center)
- `#notifications`: `NotificationsPage` (System & Clinical Alert Center)
- `#billing`: `BillingPage` (Localized Subscriptions & Payment OS)
- `#settings`: `SettingsPage` (Profile, Preferences & Support)

---

## State & API Integration Architecture

- **Local State**: Managed via React's `useState` for transient UI toggles; form input states are handled by **React Hook Form**.
- **Global State (Zustand with Persistence)**:
  - Domain state is segmented into dedicated stores: `useAuthStore` (`rxease-auth-storage`), `usePrescriptionStore` (`rxease-prescription-storage`), `useThemeStore`, and `useAppStore` (`rxease-app-storage`).
  - Native `persist` middleware ensures user sessions, theme settings, and prescription history survive browser reloads.
- **REST API Integration**:
  - Outbound requests flow through `src/services/apiClient.js`, configured with automatic Bearer token injection and global `401 Unauthorized` session cleanup.
  - Communicates directly with the Node.js Express Gateway (`/api/v1`), which orchestrates requests to the Python AI Microservice for image classification and OCR extraction.
