# Developer Playbook: Adding New Features

This playbook outlines the step-by-step process for implementing new features or workspaces in the RxEaseAI React 19 frontend application.

---

## Workflow Step-by-Step

### 1. Define Form Validation Schemas
Always define validation rules before building UI components.
- **Path**: `src/utils/validation/zodSchemas.js`
- Create a new Zod schema exporting necessary fields and message rules.

```javascript
import { z } from 'zod';

export const newFeatureSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().nonempty('Category is required.')
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
