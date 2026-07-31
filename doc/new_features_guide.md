# Developer Playbook: Adding New Features

This playbook outlines the step-by-step process for implementing new features or workspaces in the RxEaseAI React 19 frontend application.

---

## Workflow Step-by-Step

### 1. Define Form Validation Schemas
Always define validation rules before building UI components.
- **Path**: `src/utils/validation/zodSchemas.js`
- Create a new Zod schema exporting necessary fields and message rules.

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

### 2. Create the Domain Service Module
Add necessary API endpoint calls in a dedicated service module.
- **Path**: `src/services/newFeatureService.js`

```javascript
import apiClient from './apiClient';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

export const newFeatureService = {
  createRecord: async (payload) => {
    try {
      const response = await apiClient.post('/new-feature', payload);
      return response.data;
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error, 'Failed to create feature record.'));
    }
  }
};
```

---

### 3. Integrate Zustand Global State (Optional)
If state needs to persist or be shared across pages:
- **Path**: `src/store/useNewFeatureStore.js`
- Use Zustand with optional `persist` middleware.

---

### 4. Build UI Components & Workspace Page
- Create reusable components in `src/components/` and the main view in `src/pages/`.
- Use primitive components (`<Button>`, `<Input>`, `<Card>`, `<Badge>`).
- Use React Hook Form + Zod for forms.

---

### 5. Register Hash Route in `App.jsx`
Register the hash route and wrap it in `<ProtectedRoute>` or `<PublicRoute>`:

```jsx
// src/App.jsx
{currentHash === '#new-feature' && (
  <ProtectedRoute>
    <NewFeaturePage />
  </ProtectedRoute>
)}
```
