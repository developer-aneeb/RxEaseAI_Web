# Reusable UI Components Architecture

To maintain visual consistency, eliminate duplication, and enforce design tokens across views, RxEaseAI relies on atomic UI primitives located in `src/components/ui/`.

---

## Component Taxonomy & API Reference

When building new features, always utilize these primitives rather than raw HTML elements.

### 1. `<Button>`
Primary interactive button primitive. Supports Framer Motion micro-interactions and extensive variants.

**Props:**
- `variant` (string): `primary`, `secondary`, `accent`, `glass`, `outline`, `ghost`, or `custom`.
- `size` (string): `sm`, `md`, `lg`, or `none`.
- `icon` (Lucide Icon Component): Renders an optional icon.
- `iconPosition` (string): `left` | `right`.
- `animate` (boolean): Default `true`. Enables tap/hover scaling animations.
- `href` (string): Renders an `<a>` tag instead of `<button>` when provided.
- `className` (string): Custom Tailwind class overrides.

---

### 2. `<MaterialIcon>`
A wrapper for Google's Material Symbols Outlined font. Provides consistent sizing and color hooks without writing raw spans.

**Props:**
- `name` (string): Material Symbol icon name (e.g. `verified_user`, `sanitizer`).
- `size` (string): `xs` (12px), `sm` (14px), `md` (16px), `lg` (18px), `xl` (20px), `2xl` (24px), `3xl` (30px).
- `color` (string): Tailwind text color class (e.g. `text-emerald-500`).

---

### 3. `<Card>`
Glassmorphic container component for feature cards, metrics, and background panels.

**Props:**
- `variant` (string): `glass`, `glassLight`, or `flat` (Default: `glass`).
- `animate` (boolean): Applies entry fade/slide animations.
- `hoverEffect` (boolean): Enables hover border and shadow highlights.

---

### 4. `<Badge>`
Status chip used for categorizing items, showing confidence scores, or highlighting flags.

**Props:**
- `variant` (string): `primary`, `success`, `warning`, `error`, `neutral`.
- `icon` (Lucide Icon Component): Optional leading icon.
- `dot` (boolean): Adds a pulsing status dot.

---

### 5. `<Input>`
Atomic `forwardRef`-compliant input component built for React Hook Form + Zod schema validation.

**Props:**
- `label` (string): Header text above the input field.
- `error` (string): Inline error message string. Automatically applies rose-colored borders when present.
- `type` (string): `text`, `email`, `password`, `time`, `date`, `number`.

---

### 6. `<Modal>`
Accessible dialog overlay utilizing Framer Motion for backdrop fading and panel scale animations.

**Props:**
- `isOpen` (boolean): Controls modal visibility.
- `onClose` (function): Callback triggered on close button (`X`) or backdrop click.
- `title` (string | React Node): Modal header title.
- `children` (React Node): Dialog content body.

---

## Settings Page Components

RxEaseAI includes specialized settings components for managing user profiles, emergency contacts, and allergies.

### Emergency Contact Section (`src/pages/settings/EmergencyContact.jsx`)

Manages emergency contact records with add, edit, and delete functionality.

**Key Features:**
- **Floating Add Button**: Prominent "Add Contact" button in header shows/hides the form
- **Auto-Hiding Form**: Contact form only appears when user initiates add/edit action
- **Empty State**: Shows "Add Your First Emergency Contact" CTA when no contacts exist
- **Responsive Grid**: Displays contacts in 1 column on mobile, 2+ columns on larger screens
- **Edit/Delete Actions**: Inline edit and delete operations with confirmation flow

**Props:**
- `emergencyContacts` (array): Array of contact objects with `id`, `contact_name`, `relationship`, `phone`, `address`, `is_deleted`
- `onSaveSuccess` (function): Callback triggered after successful save operation

**State Management:**
- `showAddForm`: Toggles the form visibility
- `editingContactId`: Tracks which contact is being edited (null for new contacts)
- `contactNameInput`, `relationshipInput`, `contactPhoneInput`, `contactAddressInput`: Form input states

**API Integration:**
- `profileService.addEmergencyContact(data)`: Creates new contact
- `profileService.updateEmergencyContact(id, data)`: Updates existing contact
- `profileService.deleteEmergencyContact(id)`: Soft-deletes contact (sets `is_deleted = true`)

---

### Allergy Section (`src/pages/settings/Allergy.jsx`)

Manages allergy records with comprehensive allergen database and manual entry support.

**Key Features:**
- **Floating Add Button**: Prominent "Add Allergy" button in header shows/hides the form
- **Common Allergen Database**: Pre-populated lists for Drug, Food, Environmental, and Other categories
- **Smart Selection**: Users can click "View Options" to browse common allergens or type manually
- **Category-Specific Options**: Allergen list filters based on selected category type
- **Auto-Hiding Form**: Allergy form only appears when user initiates add/edit action
- **Empty State**: Shows "Add Your First Allergy" CTA when no allergies exist
- **Responsive Grid**: Displays allergies in 1 column on mobile, 2+ columns on larger screens
- **Edit/Delete Actions**: Inline edit and delete operations with confirmation flow

**Props:**
- `allergies` (array): Array of allergy objects with `id`, `allergen`, `allergy_type`, `reaction`, `is_deleted`
- `onSaveSuccess` (function): Callback triggered after successful save operation

**State Management:**
- `showAddForm`: Toggles the form visibility
- `editingAllergyId`: Tracks which allergy is being edited (null for new allergies)
- `allergenInput`, `allergyTypeInput`, `reactionInput`: Form input states
- `showCommonOptions`: Toggles display of common allergen options

**Common Allergen Database:**
- **Drug**: Penicillin, Amoxicillin, Aspirin, Ibuprofen, Sulfa drugs, Codeine, Morphine, NSAIDs, ACE inhibitors, Statins, Chemotherapy drugs, Vaccines, Contrast dye, Local anesthetics
- **Food**: Peanuts, Tree nuts, Milk, Eggs, Wheat, Soy, Fish, Shellfish, Sesame, Corn, Chicken, Beef, Pork, Fruits, Chocolate, MSG, Food dyes, Preservatives
- **Environmental**: Pollen, Dust mites, Mold, Pet dander, Insect stings, Latex, Feathers, Nickel, Hair dyes, Cosmetics
- **Other**: Iron, Anesthetic agents, Insulin, Heparin, Food additives, Tick bites

**API Integration:**
- `profileService.addAllergy(data)`: Creates new allergy record
- `profileService.updateAllergy(id, data)`: Updates existing allergy record
- `profileService.deleteAllergy(id)`: Soft-deletes allergy (sets `is_deleted = true`)

---

## Best Practices

When building new settings components:

1. **Use Floating Action Buttons**: Keep the UI clean by hiding forms until user action
2. **Provide Pre-populated Options**: Use common value lists to improve UX while allowing manual entry
3. **Implement Soft Deletes**: Use `is_deleted` flag instead of permanent deletion for audit trails
4. **Maintain Consistent Styling**: Use the same `glass` variant for all cards in settings
5. **Add Empty State CTAs**: Guide users when no data exists yet
