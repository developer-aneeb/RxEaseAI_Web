# State Management Architecture

RxEaseAI uses **Zustand 5** as its primary global state management solution. State is organized into domain-specific stores under `src/store/` to ensure predictable data flow, type safety, and automatic session persistence across page refreshes.

---

## Store Overview

| Store Name | Path | Storage Key | Responsibility |
| :--- | :--- | :--- | :--- |
| **Auth Store** | `src/store/useAuthStore.js` | `rxease-auth-storage` | Session tokens, user profile, login, logout, session restoration |
| **Prescription Store** | `src/store/usePrescriptionStore.js` | `rxease-prescription-storage` | Ingestion cycles, active OCR scans, clinical history |
| **App Store** | `src/store/useAppStore.js` | `rxease-app-storage` | Sidebar states, toast notifications queue, user settings |
| **Theme Store** | `src/store/useThemeStore.js` | Direct DOM / localStorage | Light/Dark theme mode management |

---

## Domain Store Breakdown

### 1. Auth Store (`useAuthStore`)
Manages authentication credentials and persists session state via Zustand's `persist` middleware.

#### **State Properties:**
- `user`: Object containing `{ id, email, fullName }` (or `null` if unauthenticated).
- `token`: JWT Access token string.
- `refreshToken`: Refresh token string.
- `isAuthenticated`: Boolean status flag.

#### **Actions:**
- `login(userData, accessToken, refreshToken)`: Hydrates user credentials and JWT tokens into Zustand state.
- `logout()`: Terminates the session, purges cached tokens, and redirects the browser to `/#signin`.
- `updateUser(partialData)`: Updates user profile attributes in state.

---

### 2. Prescription Store (`usePrescriptionStore`)
Manages AI vision ingestion cycles, OCR results, and prescription history.

#### **State Properties:**
- `history`: Array of ingested prescription entries.
- `currentScan`: Active OCR scan result object.
- `isAnalyzing`: Boolean loading state flag for ingestion pipelines.

#### **Actions:**
- `setHistory(items)`: Replaces history entries with fresh data from the server.
- `addHistoryEntry(entry)`: Appends a newly scanned prescription to history.
- `setCurrentScan(scanData)`: Sets active scan data for the result dashboard view.
- `deleteHistoryEntry(id)`: Removes a prescription from local state history.

---

### 3. App Store (`useAppStore`)
Manages global UI concerns, notifications, and toast messaging queues.

#### **Actions & Properties:**
- `sidebarOpen`: Boolean toggle state for mobile navigation drawer.
- `toasts`: Array of floating toast alert objects.
- `addToast(message, type)`: Enqueues a new toast notification.
- `removeToast(id)`: Removes a toast from the queue.

---

### 4. Theme Store (`useThemeStore`)
Synchronizes theme preferences with the DOM root element (`<html class="dark">`).

#### **Actions & Properties:**
- `theme`: Current theme string (`'light'` | `'dark'`).
- `toggleTheme()`: Swaps between Light and Dark mode, updating localStorage and DOM classes immediately.

---

## Access Pattern Best Practices

Always use atomic selector functions when accessing Zustand stores to prevent unnecessary component re-renders:

```javascript
// ✅ GOOD: Component re-renders ONLY when `user` changes
import { useAuthStore } from '../store/useAuthStore';

const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);

// ❌ BAD: Component re-renders on ANY store update
const { user, login } = useAuthStore(); 
```
