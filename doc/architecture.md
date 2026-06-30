# Architecture Overview

This document outlines the high-level architecture of the RxEaseAI frontend application. The project is built using modern web standards to ensure high performance, maintainability, and a seamless developer experience.

## Core Technologies
- **React 19**: The core UI library used for building interactive components.
- **Vite 8**: The extremely fast build tool and development server.
- **Tailwind CSS v4**: A utility-first CSS framework for rapid UI styling, customized heavily via CSS-first directives (`@theme`).
- **Framer Motion**: Used across the application for smooth, physics-based animations, page transitions, and micro-interactions.
- **Lucide & Material Symbols**: Scalable vector icons used consistently across UI components.

## Folder Structure

The application's source code is contained within the `src/` directory. The structure is domain-driven and separated by architectural concerns:

```
src/
├── animations/        # Reusable Framer Motion variants (staggerContainer, fadeInUp, etc.)
├── components/        # Reusable React components
│   ├── auth/          # Authentication-specific components and route guards
│   ├── layout/        # Macro-level layout components (Navbar, Footer)
│   ├── sections/      # Large page sections (Hero, Features, Analytics)
│   └── ui/            # Micro-level primitives (Button, Card, Badge, MaterialIcon)
├── contexts/          # Context providers (ToastContext)
├── store/             # Zustand global state stores (useAuthStore, useThemeStore, etc.)
├── pages/             # Top-level route components (LandingPage, auth/)
├── services/          # API layer (apiClient.js, authService.js)
├── styles/            # Shared style utilities or specific complex CSS modules
├── utils/             # Helpers (errorMessages.js, zodSchemas.js)
├── App.jsx            # Main router and state container
├── index.css          # Tailwind entry point and global styles
└── main.jsx           # React mount point
```

### Routing Strategy
Currently, the application employs a **Hash-based Routing System** managed inside `App.jsx`. Access to specific routes is enforced using Higher-Order Components (Guards) which query the auth store directly:

- **`ProtectedRoute`**: Ensures the user is authenticated via `useAuthStore`. If not, they are redirected to `/#signin`.
- **`PublicRoute`**: Ensures logged-in users cannot access auth pages. They are redirected to `/#dashboard`.

```javascript
// App.jsx snippet
const [currentHash, setCurrentHash] = useState(window.location.hash);

// Example Guarded Route
if (currentHash === '#dashboard') {
    return <ProtectedRoute><DashboardPlaceholder /></ProtectedRoute>;
}
```

### Supported Routes:
- `/` (or no hash): `LandingPage`
- `#signin`: `SignIn`
- `#signup`: `SignUp`
- `#forgot-password`: `ForgotPassword`
- `#reset-password`: `ResetPassword`
- `#verify-email`: `VerifyEmail`

> **Note for Future Scaling**: As the application grows to include protected dashboard routes, it is recommended to replace this hash-based system with `react-router-dom` to support nested routing, layout wrappers, and robust route guarding.

## State Management
- **Local State**: Managed via React's `useState` for UI toggles, while form states are handled efficiently by **React Hook Form**.
- **Global State (Zustand)**: 
  - All shared state is managed via Zustand stores under `src/store/` (`useAuthStore`, `useThemeStore`, `usePrescriptionStore`, `useAppStore`). See the [State Management Guide](file:///d:/projects/RxEaseAI_Web/frontend/doc/state_management.md) for details.
  - **Notifications**: Toast queues are populated inside `useAppStore` and consumed by the `ToastContext` wrapper to display floating alerts across the page.
- **Future Backend State**: When integrated with a real backend, consider introducing a data-fetching library like `React Query` or `RTK Query` to handle API caching and loading states rather than manual `useEffect` chains.
