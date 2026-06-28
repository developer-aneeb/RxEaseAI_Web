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
├── hooks/             # Custom React hooks (e.g., useTheme, useAuth)
├── pages/             # Top-level route components (LandingPage, auth/)
├── styles/            # Shared style utilities or specific complex CSS modules
├── App.jsx            # Main router and state container
├── index.css          # Tailwind entry point and global styles
└── main.jsx           # React mount point
```

### Routing Strategy
Currently, the application employs a **Hash-based Routing System** managed inside `App.jsx`. Access to specific routes is enforced using Higher-Order Components (Guards):

- **`ProtectedRoute`**: Ensures the user is authenticated via `AuthContext`. If not, they are redirected to `/#signin`.
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
- **Global State**: 
  - **Authentication**: Managed via `AuthContext.jsx`, which stores mock session data and exposes `login()`/`logout()` functions globally.
  - **Theming**: Managed via the `useTheme` custom hook.
- **Future Backend State**: When integrated with a real backend, consider introducing a data-fetching library like `React Query` or `RTK Query` to handle API caching and loading states rather than manual `useEffect` chains.
