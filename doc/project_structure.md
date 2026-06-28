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
- `layout/`: Macro components like `Navbar.jsx` and `Footer.jsx`.
- `sections/`: High-level page segments used to compose the Landing Page (e.g., `Hero.jsx`, `Analytics.jsx`).
- `ui/`: Reusable, atomic design primitives (`Button.jsx`, `Card.jsx`, `MaterialIcon.jsx`, etc.).

### `contexts/`
- `AuthContext.jsx`: Global state provider managing the user's session (currently using a mock localStorage token).

### `hooks/`
- `useTheme.js`: Custom hook controlling the light/dark mode state.

### `pages/`
- `LandingPage.jsx`: The primary marketing and feature demonstration view.
- `auth/`: Directory containing all authentication flows.
  - `SignIn.jsx`, `SignUp.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`: Forms powered by React Hook Form.
  - `VerifyEmail.jsx`: Post-registration instructional page.

### `styles/`
- Contains any complex, highly specific CSS outside of standard Tailwind utilities.

### `utils/validation/`
- `zodSchemas.js`: The single source of truth for all form validation rules and error messages.

### Core Entry Files
- `App.jsx`: The main React Router (Hash-based) orchestrating all pages and route guards.
- `main.jsx`: The absolute entry point that renders the `App` into the DOM.
- `index.css`: Imports Tailwind CSS and defines custom CSS variables.
