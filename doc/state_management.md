# Global State Management with Zustand

RxEaseAI uses **Zustand** as its centralized global state management solution. Unlike React Context, Zustand avoids deep component tree wrapping and enables granular, reactive updates through state selectors, preventing unnecessary re-renders.

---

## 1. Store Overview

The application state is divided into four domain-driven stores located under `src/store/`:

| Store | File Path | Responsibility |
| :--- | :--- | :--- |
| **Auth Store** | `src/store/useAuthStore.js` | User session, JWT tokens, login, logout, and session restoration. Persisted via `persist` middleware (`rxease-auth-storage`). |
| **Theme Store** | `src/store/useThemeStore.js` | Dark/Light mode selection, root HTML class manipulation, and local persistence. |
| **Prescription Store** | `src/store/usePrescriptionStore.js` | Prescription lists, OCR processing steps, YOLO scan progress, and AI diagnosis results. History persisted via `persist` middleware (`rxease-prescription-storage`). |
| **App Store** | `src/store/useAppStore.js` | App shell states (Sidebar toggles), user preferences, and global toast notifications. Preferences and sidebar state persisted via `persist` middleware (`rxease-app-storage`). |

---

## 2. Store Definitions & API

### Auth Store (`useAuthStore`)
Manages authentication credentials and automatically persists session state via Zustand's `persist` middleware (`rxease-auth-storage`).

* **State**:
  - `user`: Object containing `id`, `email`, `fullName` (or `null` if unauthenticated).
  - `token`: Access token string.
  - `refreshToken`: Refresh token string.
  - `isAuthenticated`: Boolean status indicating if a valid session exists.
  - `isLoading`: Boolean loading indicator for initialization.
* **Actions**:
  - `initializeAuth()`: Reads tokens from persistent storage and validates/restores the user session on startup. Includes fallback absorption for plain `localStorage` tokens set during OAuth redirects.
  - `login(userData, accessToken, refreshToken)`: Hydrates user credentials and JWT tokens into Zustand state.
  - `logout()`: Terminates the session, clears cached tokens, and redirects the browser to `#signin`.

### Theme Store (`useThemeStore`)
Controls dark mode and automatically syncs the DOM element classes.

* **State**:
  - `theme`: `'light'` or `'dark'`.
* **Actions**:
  - `toggleTheme()`: Inverts the theme and updates the `<html>` element class list.

### Prescription Store (`usePrescriptionStore`)
Tracks active prescription ingestion cycles, YOLO line segmentation progress, and clinical audits. Patient prescription history is persisted across browser reloads via `persist` middleware (`rxease-prescription-storage`).

* **State**:
  - `currentPrescription`: Active prescription object under review.
  - `history`: Array of historical prescription records (persisted).
  - `uploadProgress`: Ingestion percentage `0` to `100`.
  - `ocrState`: Ingestion stages (`'idle'`, `'uploading'`, `'segmenting'`, `'transcribing'`, `'done'`).
  - `aiResult`: Normalized FHIR/HL7 clinical check data.
* **Actions**:
  - `setCurrentPrescription(prescription)`: Sets active prescription.
  - `addHistoryEntry(entry)`: Prepends a new prescription verification record to the persisted history array.
  - `clearPrescription()`: Resets active scan state.

### App Store (`useAppStore`)
Handles notification alerts and sidebar workspace controls. Uses `persist` middleware (`rxease-app-storage`) partialized to retain user settings, notifications, and sidebar collapse state while omitting transient toasts.

* **State**:
  - `isSidebarOpen`: Sidebar collapse boolean (persisted).
  - `settings`: Pharmacist preferences (`notificationsEnabled`, `autoAnalyze`, `mfaEnabled`) (persisted).
  - `notifications`: Array of user notifications (persisted).
  - `toasts`: Array of active global toast alerts (transient).
* **Actions**:
  - `toggleSidebar()`: Opens or closes the sidebar menu.
  - `updateSettings(newSettings)`: Merges new user settings into state.
  - `showToast(message, type)`: Queues a new alert (`'success'`, `'error'`, `'warning'`, `'info'`) which auto-expires after 5 seconds.
  - `removeToast(id)`: Removes a specific toast from the rendering stack.

---

## 3. Best Practices: Selecting State

To optimize performance and avoid re-renders, **always select specific properties** rather than pulling the entire store:

### 👍 Correct Pattern (Granular Selection)
```javascript
import { useAuthStore } from '../../store/useAuthStore';

// Only re-renders if the `user` property changes
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
```

### 👎 Incorrect Pattern (Full Object Destruction)
```javascript
// Re-renders the component when ANY property inside the auth store changes
const { user, login } = useAuthStore(); 
```
