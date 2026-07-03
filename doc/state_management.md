# Global State Management with Zustand

RxEaseAI uses **Zustand** as its centralized global state management solution. Unlike React Context, Zustand avoids deep component tree wrapping and enables granular, reactive updates through state selectors, preventing unnecessary re-renders.

---

## 1. Store Overview

The application state is divided into four domain-driven stores located under `src/store/`:

| Store | File Path | Responsibility |
| :--- | :--- | :--- |
| **Auth Store** | `src/store/useAuthStore.js` | User session, login, logout, registration status, session restoration from `localStorage`. |
| **Theme Store** | `src/store/useThemeStore.js` | Dark/Light mode selection, root HTML class manipulation, and local persistence. |
| **Prescription Store** | `src/store/usePrescriptionStore.js` | Prescription lists, OCR processing steps, YOLO scan progress, and AI diagnosis results. |
| **App Store** | `src/store/useAppStore.js` | App shell states (Sidebar toggles), pharmacist configuration settings, and global toast notifications. |

---

## 2. Store Definitions & API

### Auth Store (`useAuthStore`)
Manages authentication credentials and persists access tokens via client side cookies or local storage.

* **State**:
  - `user`: Object containing `id`, `email`, `fullName` (or `null` if unauthenticated).
  - `isAuthenticated`: Boolean status indicating if a valid session exists.
  - `isLoading`: Boolean loading indicator for initialization.
* **Actions**:
  - `initializeAuth()`: Reads token from local storage and restores the user session on startup.
  - `login(email, password)`: Authenticates user credentials with the backend API.
  - `logout()`: Terminates the session, clears cached tokens, and redirects the browser.

### Theme Store (`useThemeStore`)
Controls dark mode and automatically syncs the DOM element classes.

* **State**:
  - `theme`: `'light'` or `'dark'`.
* **Actions**:
  - `toggleTheme()`: Inverts the theme and updates the `<html>` element class list.

### Prescription Store (`usePrescriptionStore`)
Tracks active prescription ingestion cycles, YOLO line segmentation progress, and clinical audits.

* **State**:
  - `prescriptions`: Array of historical and active prescription objects.
  - `uploadProgress`: Ingestion percentage `0` to `100`.
  - `ocrState`: Ingestion stages (`'idle'`, `'uploading'`, `'segmenting'`, `'transcribing'`, `'done'`).
  - `aiResult`: Normalized FHIR/HL7 clinical check data.
* **Actions**:
  - `uploadPrescription(file)`: Streams prescription images to the API and tracks progress.
  - `runOCR(prescriptionId)`: Triggers YOLO line segmentation and OCR translation.

### App Store (`useAppStore`)
Handles notification alerts and sidebar workspace controls.

* **State**:
  - `sidebarOpen`: Sidebar collapse boolean.
  - `toasts`: Array of active global toast alerts.
* **Actions**:
  - `toggleSidebar()`: Opens or closes the sidebar menu.
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
