# New Feature Development & Contributing Guide

This guide provides a step-by-step architectural checklist for frontend engineers building new features, screens, or workflows in RxEaseAI. Adhering to this workflow guarantees consistency across reusable UI components, form validation, and Zustand global state persistence.

---

## Step 1: Define Form Schema & Validation Rules (Zod)

Never manage raw input validation inside UI components. Start by defining strict validation schemas in `src/utils/validation/zodSchemas.js` or helper functions in `src/utils/validation/authValidation.js`.

### Example Checklist:
1. Add your new schema export in `zodSchemas.js`:
```javascript
export const clinicalNoteSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  note: z.string().min(10, 'Clinical notes must be at least 10 characters'),
  category: z.enum(['routine', 'urgent', 'followup']),
  date: z.string().min(1, 'Please select a note date')
}).superRefine((data, ctx) => {
  // Use superRefine for custom multi-field rules or future-dating checks
  if (new Date(data.date) > new Date()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Note date cannot be set in the future.',
      path: ['date']
    });
  }
});
```

---

## Step 2: Assemble UI Using Atomic Primitives

Build your screen using our standardized primitives located in `src/components/ui/`. Avoid raw `<button>`, `<input>`, or ad-hoc Tailwind styling where a component already exists.

### Key Components to Integrate:
- **`<Input>`**: Automatically binds to `react-hook-form` via `{...register('fieldName')}` and displays inline validation errors when `error={errors.fieldName?.message}` is provided.
- **`<Button>`**: Supports built-in Framer Motion micro-animations, standard sizes (`sm`, `md`, `lg`), and variants (`primary`, `secondary`, `glass`, `outline`).
- **`<Card>`**: Provides glassmorphic containers (`variant="glass"`) with optional hover elevation (`hoverEffect={true}`).
- **`<Modal>`**: Wraps dialog forms with Framer Motion entry/exit animations and backdrop click handling.
- **`<Badge>`**: High-impact status chips (`variant="success"`, `variant="warning"`, etc.) with optional pulsing indicator dots (`dot={true}`).

---

## Step 3: Manage Global State with Zustand Persistence

If your feature requires shared data across routes or data persistence across browser reloads, extend or create a store in `src/store/`.

### Rules for Zustand Stores:
1. **Always wrap persistent state in `persist` middleware**:
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useClinicalStore = create(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
      clearNotes: () => set({ notes: [] })
    }),
    {
      name: 'rxease-clinical-storage',
      partialize: (state) => ({ notes: state.notes }) // Only persist necessary fields
    }
  )
);
```
2. **Granular Selectors**: In your React components, select individual store properties to avoid component-wide re-renders:
```javascript
const notes = useClinicalStore((state) => state.notes);
const addNote = useClinicalStore((state) => state.addNote);
```

---

## Step 4: Register Route & Guarding (`App.jsx`)

1. Open `src/App.jsx`.
2. Add your new hash string (e.g. `#clinical-notes`) to the hash matching logic.
3. Wrap authenticated workspaces in `<ProtectedRoute>`:
```jsx
if (currentHash === '#clinical-notes') {
  return (
    <ProtectedRoute>
      <ClinicalNotesPage />
    </ProtectedRoute>
  );
}
```

---

## Step 5: Integrate Navigation (`SideNavbar.jsx` & `Navbar.jsx`)

All post-authentication views must display the responsive sidebar (`SideNavbar.jsx`) to maintain workspace continuity.

1. In `src/components/layout/SideNavbar.jsx`, add your route to the `navItems` array:
```javascript
{ name: 'Clinical Notes', href: '#clinical-notes', icon: 'note_add' }
```
2. Ensure your page layout wraps content inside the standard workspace container alongside `<SideNavbar />`:
```jsx
return (
  <div className="flex min-h-screen bg-surface dark:bg-slate-950 text-on-surface dark:text-white">
    <SideNavbar />
    <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
      {/* Page Header & Content */}
    </main>
  </div>
);
```

---

## Step 6: Error Handling & User Feedback

- For all API requests, catch errors and pass them through `getFriendlyErrorMessage(error)` (`src/utils/errorMessages.js`).
- Display user alerts via `useAppStore.getState().showToast(message, type)` or the `useToast()` context hook.
