# Settings Page Components Architecture

This document details the architecture and implementation of the Emergency Contact and Allergy management components in the RxEaseAI frontend application.

---

## Overview

RxEaseAI includes specialized settings components for managing user profile information including emergency contacts and allergies registry. These components follow a consistent pattern with floating action buttons, clean form toggling, and comprehensive data management.

---

## File Location

- **EmergencyContact.jsx**: `frontend/src/pages/settings/EmergencyContact.jsx`
- **Allergy.jsx**: `frontend/src/pages/settings/Allergy.jsx`

---

## EmergencyContactSection Component

Manages emergency contact records with add, edit, and delete functionality.

### Key Features

1. **Floating Add Button**: Prominent "Add Contact" button in header shows/hides the form
2. **Auto-Hiding Form**: Contact form only appears when user initiates add/edit action
3. **Empty State**: Shows "Add Your First Emergency Contact" CTA when no contacts exist
4. **Responsive Grid**: Displays contacts in 1 column on mobile, 2+ columns on larger screens
5. **Edit/Delete Actions**: Inline edit and delete operations with confirmation flow
6. **Soft Deletes**: Uses `is_deleted` flag instead of permanent deletion

### Component Structure

```javascript
export default function EmergencyContactSection({ emergencyContacts, onSaveSuccess }) {
  // State Management
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContactId, setEditingContactId] = useState(null);
  const [contactNameInput, setContactNameInput] = useState('');
  const [relationshipInput, setRelationshipInput] = useState('');
  const [contactPhoneInput, setContactPhoneInput] = useState('');
  const [contactAddressInput, setContactAddressInput] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  
  // Data Processing
  const activeContacts = (emergencyContacts || []).filter(c => !c.is_deleted);
  
  // Actions
  const handleShowAddForm = () => { /* show form, reset fields */ };
  const handleCancelAdd = () => { /* hide form, reset fields */ };
  const handleSaveContact = async () => { /* save logic */ };
  const handleEditContact = (contact) => { /* populate form for editing */ };
  const handleDeleteContact = async (contact) => { /* soft delete */ };
}
```

### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `emergencyContacts` | array | Array of contact objects with `id`, `contact_name`, `relationship`, `phone`, `address`, `is_deleted` |
| `onSaveSuccess` | function | Callback triggered after successful save operation |

### Form Fields

- **Name**: Required string field for contact name
- **Relationship**: Optional string (Spouse, Parent, Brother, etc.)
- **Phone**: Required string for phone number
- **Address**: Optional string for contact address

### Visual Pattern

```
┌─────────────────────────────────────────────┐
│ [Icon] Emergency Contacts          [Add]   │
│  Manage backup contacts...                  │
├─────────────────────────────────────────────┤
│ [No contacts message or contact cards...]  │
├─────────────────────────────────────────────┤
│ [Form only shown when clicking Add]        │
└─────────────────────────────────────────────┘
```

---

## AllergySection Component

Manages allergy records with comprehensive allergen database and manual entry support.

### Key Features

1. **Floating Add Button**: Prominent "Add Allergy" button in header shows/hides the form
2. **Common Allergen Database**: Pre-populated lists for Drug, Food, Environmental, and Other categories
3. **Smart Selection**: Users can click "View Options" to browse common allergens or type manually
4. **Category-Specific Options**: Allergen list filters based on selected category type
5. **Auto-Hiding Form**: Allergy form only appears when user initiates add/edit action
6. **Empty State**: Shows "Add Your First Allergy" CTA when no allergies exist
7. **Responsive Grid**: Displays allergies in 1 column on mobile, 2+ columns on larger screens
8. **Edit/Delete Actions**: Inline edit and delete operations with confirmation flow

### Component Structure

```javascript
// Comprehensive allergen database
const COMMON_ALLERGIES = {
  Drug: [
    'Penicillin', 'Amoxicillin', 'Aspirin', 'Ibuprofen', 'Sulfa drugs', 
    'Codeine', 'Morphine', 'NSAIDs', 'ACE inhibitors', 'Statins',
    'Chemotherapy drugs', 'Vaccines', 'Contrast dye', 'Local anesthetics', 'Antibiotics'
  ],
  Food: [
    'Peanuts', 'Tree nuts (almonds, walnuts, cashews)', 'Milk', 'Eggs', 'Wheat',
    'Soy', 'Fish (salmon, tuna, cod)', 'Shellfish (shrimp, crab, lobster)', 'Sesame',
    'Corn', 'Chicken', 'Beef', 'Pork', 'Fruits (banana, avocado, kiwi)',
    'Chocolate', 'MSG', 'Food dyes', 'Preservatives'
  ],
  Environmental: [
    'Pollen (tree, grass, ragweed)', 'Dust mites', 'Mold', 'Pet dander (cats, dogs)',
    'Cockroach droppings', 'Insect stings (bees, wasps, hornets)', 'Latex',
    'Feathers', 'Cedar wood', 'Nickel', 'Hair dyes', 'Cosmetics'
  ],
  Other: [
    'Latex', 'Iron', 'Anesthetic agents', 'Insulin', 'Heparin',
    'Vaccines', 'Contrast dye', 'Preservatives', 'Food additives', 'Tick bites'
  ]
};

export default function AllergySection({ allergies, onSaveSuccess }) {
  // State Management
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCommonOptions, setShowCommonOptions] = useState(false);
  const [editingAllergyId, setEditingAllergyId] = useState(null);
  const [allergenInput, setAllergenInput] = useState('');
  const [allergyTypeInput, setAllergyTypeInput] = useState('Drug');
  const [reactionInput, setReactionInput] = useState('');
  
  // Data Processing
  const activeAllergies = (allergies || []).filter(a => !a.is_deleted);
  const commonAllergiesForType = COMMON_ALLERGIES[allergyTypeInput] || [];
  
  // Actions
  const handleShowAddForm = () => { /* show form, reset fields */ };
  const handleSelectCommonAllergen = (allergen) => { /* populate input */ };
  const handleSaveAllergy = async () => { /* save logic */ };
}
```

### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `allergies` | array | Array of allergy objects with `id`, `allergen`, `allergy_type`, `reaction`, `is_deleted` |
| `onSaveSuccess` | function | Callback triggered after successful save operation |

### Form Fields

- **Category Type**: Radio buttons for Drug, Food, Environmental, Other
- **Allergen Name**: Text input with "View Options" to select from common allergens or type manually
- **Observed Reaction**: Text input for reaction description

### Allergen Selection Pattern

```
┌─────────────────────────────────────────────┐
│ Category: Drug ☑ Food ○ Environmental ○    │
├─────────────────────────────────────────────┤
│ Allergen: [________________] View Options  │
├─────────────────────────────────────────────┤
│ Common Drug Allergens:                      │
│ [Penicillin] [Amoxicillin] [Aspirin] ...  │
│ [Hide common options]                       │
├─────────────────────────────────────────────┤
│ Reaction: [________________]                │
└─────────────────────────────────────────────┘
```

### Common Allergen Categories

#### Drug Allergies
- Penicillin, Amoxicillin, Aspirin, Ibuprofen
- Sulfa drugs, Codeine, Morphine, NSAIDs
- ACE inhibitors, Statins
- Chemotherapy drugs, Vaccines, Contrast dye
- Local anesthetics

#### Food Allergies
- Peanuts, Tree nuts (almonds, walnuts, cashews)
- Milk, Eggs, Wheat, Soy
- Fish (salmon, tuna, cod), Shellfish (shrimp, crab, lobster)
- Sesame, Corn, Chicken, Beef, Pork
- Fruits (banana, avocado, kiwi)
- Chocolate, MSG, Food dyes

#### Environmental Allergies
- Pollen (tree, grass, ragweed)
- Dust mites, Mold
- Pet dander (cats, dogs)
- Insect stings (bees, wasps, hornets)
- Latex, Feathers, Nickel

---

## UI Design Patterns

### 1. Floating Action Button Pattern

```javascript
<div className="flex items-center gap-2 mb-6">
  <HeaderIcon />
  <div>
    <h3>Title</h3>
    <p>Description</p>
  </div>
  {!showAddForm && (
    <Button
      onClick={handleShowAddForm}
      variant="primary"
      className="ml-auto"
    >
      <Plus className="w-4 h-4" />
      Add Item
    </Button>
  )}
</div>
```

### 2. Empty State CTA Pattern

```javascript
{!showAddForm && activeItems.length === 0 && (
  <div className="flex justify-center pt-4">
    <Button
      onClick={handleShowAddForm}
      variant="primary"
      className="bg-primary text-white text-sm font-bold px-6 py-3 rounded-2xl"
    >
      <Plus className="w-5 h-5" />
      Add Your First Item
    </Button>
  </div>
)}
```

### 3. Form Toggle Pattern

```javascript
{showAddForm && (
  <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4 mb-6 animate-fade-in">
    {/* Form fields */}
    <Button onClick={handleSave}>Save</Button>
  </div>
)}
```

---

## State Persistence

Settings data is persisted using Zustand stores with the following keys:
- `rxease-auth-storage`: Authentication and user profile state
- `rxease-prescription-storage`: Prescription history and OCR results
- `rxease-app-storage`: UI state, toast notifications, and app settings

---

## API Integration

Both components integrate with the `profileService.js` through:

### Emergency Contacts
- `profileService.addEmergencyContact(data)`: Creates new contact
- `profileService.updateEmergencyContact(id, data)`: Updates existing contact
- `profileService.deleteEmergencyContact(id)`: Soft-deletes contact

### Allergies
- `profileService.addAllergy(data)`: Creates new allergy record
- `profileService.updateAllergy(id, data)`: Updates existing allergy record
- `profileService.deleteAllergy(id)`: Soft-deletes allergy

---

## Best Practices

When building new settings components:

1. **Use Floating Action Buttons**: Keep the UI clean by hiding forms until user action
2. **Provide Pre-populated Options**: Use common value lists to improve UX while allowing manual entry
3. **Implement Soft Deletes**: Use `is_deleted` flag instead of permanent deletion for audit trails
4. **Maintain Consistent Styling**: Use the same `glass` variant for all cards in settings
5. **Add Empty State CTAs**: Guide users when no data exists yet
6. **Use Responsive Grids**: Display items in 1 column mobile, 2+ columns desktop
7. **Show Confirmation Flow**: Use confirm-delete pattern before destructive actions
8. **Enable Form Toggle**: Only show form when user initiates action