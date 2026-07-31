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
