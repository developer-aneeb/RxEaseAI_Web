# Reusable UI Components Architecture

To ensure extreme visual consistency, avoid code duplication, and maintain a centralized design language, RxEaseAI relies on a suite of generic, highly-reusable UI primitives located in `src/components/ui/`.

## Component Overview

When building new features, always prioritize using these components over raw HTML elements.

### 1. `<Button>`
The primary interactive element. Supports extensive variants, icons, and built-in Framer Motion interactions.

**Props:**
- `variant` (string): `primary`, `secondary`, `accent`, `glass`, `outline`, `ghost`, or `custom`.
- `size` (string): `sm`, `md`, `lg`, or `none`.
- `icon` (Lucide React Component): Renders an icon alongside the text.
- `iconPosition` (string): `left` or `right`.
- `animate` (boolean): Default `true`. Disables Framer Motion hover/tap scaling if `false`.
- `href` (string): If provided, renders an `<a>` tag instead of a `<button>`.
- `className` (string): Appends custom Tailwind classes.

**Usage:**
```jsx
<Button variant="primary" icon={ArrowRight}>
  Submit Data
</Button>
```

> **The `custom` Variant:**
> Use `variant="custom"` and `size="none"` when you need entirely custom styling (e.g., specific Auth gradients) while still maintaining the Button's underlying structure and animation capabilities.

### 2. `<MaterialIcon>`
A wrapper for Google's Material Symbols Outlined font. Provides consistent sizing and color hooks without writing raw spans.

**Props:**
- `name` (string): The exact string name of the Material Symbol (e.g., `verified_user`).
- `size` (string): `xs` (12px), `sm` (14px), `md` (16px), `lg` (18px), `xl` (20px), `2xl` (24px), `3xl` (30px), or `none` (to bypass preset class).
- `color` (string): Tailwind text color class (e.g., `text-primary`).
- `className` (string): Custom CSS classes.

**Usage:**
```jsx
<MaterialIcon name="health_and_safety" size="2xl" color="text-blue-500" />
```

### 3. `<Card>`
A container component utilized extensively for dashboards, feature lists, and background panels.

**Props:**
- `variant` (string): `glass`, `glassLight`, or `flat`. (Defaults to `glass`).
- `animate` (boolean): Applies entry fade/slide transition.
- `hoverEffect` (boolean): Enables shadow and border highlights on hover.
- `onClick` (function): Optional click event callback.
- `className` (string): Custom CSS class wrapper.

**Usage:**
```jsx
<Card variant="glass" hoverEffect={true} className="p-6">
  <h2>Patient Details</h2>
</Card>
```

### 4. `<Badge>`
A small tag/chip used for categorizing, highlighting statuses, or displaying numbers.

**Props:**
- `variant` (string): `primary`, `success`, `warning`, `error`, `neutral`.
- `icon` (Lucide React Component): Optional leading icon.
- `dot` (boolean): Adds a pulsing status dot.

**Usage:**
```jsx
<Badge variant="success" dot={true}>
  System Online
</Badge>
```

### 5. `<SectionHeader>`
A macro-component designed specifically for the Landing Page to ensure all sections (Features, Analytics, FAQ) share the exact same title taxonomy.

**Props:**
- `badgeText` (string): Text for the top eyebrow badge.
- `badgeIcon` (Lucide React Component): Icon for the eyebrow badge.
- `title` (string): Main section `<h2>` heading.
- `subtitle` (string): Paragraph descriptor below the title.

**Usage:**
```jsx
<SectionHeader
  badgeText="Support"
  badgeIcon={HelpCircle}
  title="Frequently Asked Questions"
  subtitle="Everything you need to know about RxEaseAI."
/>
```
