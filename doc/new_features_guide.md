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

---

## Settings Component Pattern

When building new settings page components (like EmergencyContact, Allergy, ProfileSection), follow this pattern:

### 1. Create the Settings Component File

**Location**: `frontend/src/pages/settings/YourComponentName.jsx`

```javascript
import { useState } from 'react';
import { IconName } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAppStore } from '../../store/useAppStore';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function YourComponent({ data, onSaveSuccess }) {
  const showToast = useAppStore((state) => state.showToast);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  
  const activeItems = (data || []).filter(item => !item.is_deleted);
  
  // Show form handler
  const handleShowAddForm = () => {
    setInput1('');
    setInput2('');
    setEditingId(null);
    setShowAddForm(true);
  };
  
  // Save handler
  const handleSave = async () => {
    if (!input1.trim()) {
      showToast('Field is required', 'warning');
      return;
    }
    
    try {
      if (editingId) {
        await profileService.updateYourItem(editingId, {
          field1: input1,
          field2: input2
        });
        showToast('Updated successfully', 'success');
      } else {
        await profileService.addYourItem({
          field1: input1,
          field2: input2
        });
        showToast('Added successfully', 'success');
      }
      
      setShowAddForm(false);
      setInput1('');
      setInput2('');
      setEditingId(null);
      onSaveSuccess();
    } catch (error) {
      showToast(getFriendlyErrorMessage(error, 'Failed to save'), 'error');
    }
  };
  
  return (
    <Card>
      <div className="flex items-center gap-2 mb-6 border-b">
        <IconName className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold">Title</h3>
          <p className="text-[11px] text-slate-400">Description</p>
        </div>
        {!showAddForm && (
          <Button 
            onClick={handleShowAddForm} 
            variant="primary"
            className="ml-auto"
          >
            Add Item
          </Button>
        )}
      </div>
      
      {!showAddForm && (
        <div className="space-y-4 mb-6">
          {activeItems.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center border border-dashed rounded-2xl">
              No active items registered.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeItems.map(item => (
                <div key={item.id}>
                  {/* Item display */}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {showAddForm && (
        <div className="border-t pt-5 space-y-4 mb-6">
          {/* Form fields */}
          <Button onClick={handleSave}>Save</Button>
        </div>
      )}
      
      {!showAddForm && activeItems.length === 0 && (
        <div className="flex justify-center pt-4">
          <Button onClick={handleShowAddForm} variant="primary">
            Add Your First Item
          </Button>
        </div>
      )}
    </Card>
  );
}
```

### 2. Common Patterns

- **Floating Add Button**: Always show "Add" in header, hide when form is visible
- **Empty State CTA**: Show "Add Your First X" when no items exist
- **Form Toggle**: Use `showAddForm` state to toggle visibility
- **Soft Deletes**: Use `is_deleted` flag instead of permanent deletion
- **Responsive Grid**: Use `grid-cols-1 md:grid-cols-2` for item display
- **Scroll on Show**: Scroll to form anchor when showing form
