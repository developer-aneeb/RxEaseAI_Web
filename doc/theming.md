# Theming System (Light / Dark Mode)

RxEaseAI features a robust, flicker-free dark mode system powered by Tailwind CSS v4 and native DOM APIs.

## How it works

The theming system is divided into two primary parts to prevent Flash of Unstyled Content (FOUC):

### 1. The FOUC Prevention Script
In `index.html`, a synchronous blocking `<script>` runs before React mounts. It checks `localStorage` or the user's OS preference (`prefers-color-scheme`) and injects the `.dark` class directly onto the `<html>` root element. 

This ensures that the page background is rendered with the correct color before any JavaScript bundles are parsed.

### 2. The `useThemeStore` Zustand Store
Located at `src/store/useThemeStore.js`, this global store allows components to read and toggle the current theme.

```javascript
import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 
         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', nextTheme);
    return { theme: nextTheme };
  }),
}));
```

Using it in components:
```javascript
const theme = useThemeStore((state) => state.theme);
const toggleTheme = useThemeStore((state) => state.toggleTheme);
```

## Styling for Dark Mode

Tailwind CSS v4 configures dark mode slightly differently than v3. In `src/index.css`, we use the `@custom-variant` directive to tell Tailwind to look for the `.dark` class anywhere in the DOM tree above the element:

```css
/* index.css */
@theme { ... }
@custom-variant dark (&:where(.dark, .dark *));
```

### Implementing in Components
When writing JSX, simply append the `dark:` prefix to any utility class you want applied when dark mode is active.

```jsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  This card adapts to the theme!
</div>
```

**Design Principle:** Avoid hardcoding black or white colors. Utilize the custom CSS variables configured in `index.css` (e.g., `text-on-surface`, `bg-surface-container`) which automatically adjust their hex values based on the theme context, greatly reducing the amount of `dark:` classes required.
