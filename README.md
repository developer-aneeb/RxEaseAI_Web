# RxEaseAI - AI-Powered Prescription Ingestion 👨‍💻✨

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Styling-38BDF8?logo=tailwindcss&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-black?logo=framer&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-Linting-4B32C3?logo=eslint&logoColor=white) ![Lucide](https://img.shields.io/badge/Lucide-Icons-111827)

Transform handwritten prescriptions into structured clinical intelligence. RxEaseAI is a frontend experience that showcases fast ingestion, safety checks, and real-time analytics for pharmacy workflows.

---

## 🌐 Live Demo

- 🚀 Portfolio Website: [View Live Portfolio](https://portfolio-six-nu-20.vercel.app/)

---

## One-line summary

- RxEaseAI is a modern UI that simulates OCR ingestion, dosage safety checks, and operational analytics for pharmacies and hospital networks.

---

## Key facts (quick)

- Target: sub-2s ingestion and 99.2% OCR accuracy (validated dataset)
- YOLO-based segmentation with medical OCR concepts
- FHIR/HL7-ready structured output
- React 19, Vite 8, Tailwind CSS v4, Framer Motion

---

## Scope and purpose (repo-specific)

- This repository contains the frontend UI and interactions only.
- Backend services, model hosting, datasets, and compliance systems are not included here.

---

## Features and capabilities

- **YOLO Vision Region Detector:** Isolates text regions, lines, and tokens to reduce handwriting noise.
- **Specialized Medical OCR:** Converts challenging handwriting into readable clinical transcripts.
- **Clinical Dosage Audit Engine:** Flags drug interactions, high-risk quantities, and age-limit warnings.
- **EHR and FHIR Ingestion:** Produces HL7-aligned JSON for Epic, Cerner, or local database workflows.
- **Adaptive Theme System:** Light/dark mode with FOUC-resistant startup logic.
- **High-Fidelity Laser Scanning:** HUD-style OCR animations that mimic live server scanning.

---

## How it works

1. **Segment:** Vision model isolates handwriting regions and line tokens.
2. **Transcribe:** Medical OCR converts text into structured, readable data.
3. **Audit:** Safety engine checks dosage rules and interaction risk.
4. **Export:** Data is normalized into FHIR/HL7-compatible JSON.
5. **Observe:** Analytics dashboards surface throughput and accuracy metrics.

---

## Where to edit content (quick paths)

- Page composition: `src/pages/LandingPage.jsx`
- Sections: `src/components/sections/`
- Layout: `src/components/layout/`
- UI primitives: `src/components/ui/`
- Theme hook: `src/hooks/useTheme.js`
- Global styles: `src/index.css`

---

## Project structure

```bash
src/
 ├── components/
 │   ├── layout/        # Navbar and footer
 │   ├── sections/      # Hero, Features, Workflow, Dashboard, Analytics, Faq
 │   └── ui/            # Reusable UI primitives (Button, Card, Badge, etc.)
 ├── hooks/
 │   └── useTheme.js    # Theme persistence and system sync
 ├── pages/
 │   └── LandingPage.jsx # Page composer
 ├── styles/            # Shared style utilities
 ├── index.css          # Tailwind imports and global styles
 └── main.jsx           # App entry point
```

---

## Screenshots / Preview (add your own)

<!-- Replace these placeholders with real assets in /public and reference them below.

| Desktop (Hero) | Analytics | Mobile |
|---:|:---:|:---:|
| ![Hero](public/preview-hero.png) | ![Analytics](public/preview-analytics.png) | ![Mobile](public/preview-mobile.png) |

-->

---

## Development (local)

Prereqs: Node.js 18+ and npm

```bash
# Install
npm install

# Start dev server
npm run dev

# Build
npm run build

# Preview
npm run preview
```

Notes:
- This project uses Vite for a fast development loop.
- Use `npm run lint` to run ESLint.

---

## Theme system implementation

RxEaseAI prevents theme flicker (FOUC) by injecting a small script in the `<head>` of `index.html` before the React app mounts:

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

Tailwind CSS v4 dark mode support is enabled via the CSS-first directive:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

## Compliance and security (design goals)

- HIPAA-ready ingestion workflow with client-encrypted upload concepts
- SOC 2-style audit logging visuals for pharmacist verification actions

---

## Contributing

- This repo is structured for a single front-end experience.
- Use branches for content updates and open a PR for major layout changes.

---

## Contact

- Add your contact details here (email, LinkedIn, or GitHub)