# Theme Engine & Styling Architecture

This document describes the design tokens, theme system, and dark mode implementation powering the RxEaseAI user interface.

---

## 1. Core Framework: Tailwind CSS v4

RxEaseAI uses **Tailwind CSS v4**. Theme colors and typography tokens are configured using Tailwind's CSS-first directives in `src/index.css`.

### FOUC (Flash of Unstyled Content) Prevention
To prevent bright light-mode flashes when a user in dark mode reloads the page, an inline script is injected in the `<head>` of `index.html`:

```javascript
(function () {
  const storedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();
```

### Tailwind v4 Dark Mode Variant Directive
In `src/index.css`, dark mode styles are enabled via:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

## 2. Theme State Store (`useThemeStore.js`)

Theme toggling is managed globally via Zustand (`src/store/useThemeStore.js`):

```javascript
export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  })
}));
```

---

## 3. Glassmorphic Design Guidelines

RxEaseAI heavily utilizes modern glassmorphism UI elements:
- Use `backdrop-blur-md` or `backdrop-blur-lg` for card backgrounds and overlays.
- Ensure text contrast is verified in both Light (`bg-white/80 text-slate-900`) and Dark (`dark:bg-slate-900/80 dark:text-white`) modes.
