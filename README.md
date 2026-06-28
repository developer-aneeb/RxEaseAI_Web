# RxEaseAI - AI-Powered Prescription Ingestion ✨

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Styling-38BDF8?logo=tailwindcss&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-black?logo=framer&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-Linting-4B32C3?logo=eslint&logoColor=white) ![Lucide](https://img.shields.io/badge/Lucide-Icons-111827)

Transform handwritten prescriptions into structured clinical intelligence. RxEaseAI is a frontend experience that showcases fast ingestion, safety checks, and real-time analytics for pharmacy workflows.

---

## 🌐 Live Demo

- 🚀 RxEaseAI Website: [View Live Portfolio](https://RxEaseAI.vercel.app/)

---

## One-line summary

- RxEaseAI is a modern UI that simulates OCR ingestion, dosage safety checks, operational analytics, and secure authentication for pharmacies and hospital networks.

---

## Key facts (quick)

- Target: sub-2s ingestion and 74% OCR accuracy (validated dataset)
- YOLO-based segmentation with medical OCR concepts
- FHIR/HL7-ready structured output
- React 19, Vite 8, Tailwind CSS v4, Framer Motion
- Full custom Authentication Flows with interactive form validation (React Hook Form + Zod)
- Protected Routing and global mock session state (AuthContext)

---

## Scope and purpose (repo-specific)

- This repository contains the frontend UI and interactions only.
- Backend services, model hosting, datasets, and compliance systems are not included here.

---

## Features and capabilities

- **🔍 YOLO Vision Region Detector:** Automatically detects and isolates text regions, lines, and tokens to reduce handwriting noise.
- **🩺 Specialized Medical OCR:** Translates challenging doctor handwriting into legible clinical transcripts.
- **💊 Clinical Dosage Audit Engine:** Flags drug interactions, high-risk quantities, and age-limit warnings.
- **🔐 Complete Authentication Flow:** Includes fully validated forms for Sign In, Sign Up, Forgot Password, Reset Password, and Email Verification.
- **⚡ Form Validation:** Powered by React Hook Form + Zod for centralized, strict schema-based error handling.
- **🛡️ Live Password Security:** Interactive password strength indicators ensuring HIPAA-compliant credential creation.
- **🔒 Protected Routes:** Role-based guard components to block unauthenticated access to the dashboard.
- **🌗 Adaptive Theme System:** Clean light/dark mode with FOUC-resistant startup logic.
- **🧩 Reusable UI Architecture:** Component-driven design using highly reusable abstractions (Buttons, Icons, Cards, Badges).
- **🟢 High-Fidelity Laser Scanning:** HUD-style OCR animations that mimic live server scanning.

---

## How it works

1. **Authenticate:** Securely sign up or log in to the HIPAA-compliant dashboard.
2. **Segment:** Vision model isolates handwriting regions and line tokens.
3. **Transcribe:** Medical OCR converts text into structured, readable data.
4. **Audit:** Safety engine checks dosage rules and interaction risk.
5. **Export:** Data is normalized into FHIR/HL7-compatible JSON.
6. **Observe:** Analytics dashboards surface throughput and accuracy metrics.

---

## Where to edit content (quick paths)

- Page composition: `src/pages/LandingPage.jsx`
- Auth Pages: `src/pages/auth/SignIn.jsx`, `src/pages/auth/SignUp.jsx`, `src/pages/auth/ResetPassword.jsx`, `src/pages/auth/ForgotPassword.jsx`, `src/pages/auth/VerifyEmail.jsx`
- Sections: `src/components/sections/`
- Layout: `src/components/layout/`
- Auth Components: `src/components/auth/`
- UI primitives: `src/components/ui/`
- Theme hook: `src/hooks/useTheme.js`
- Global styles: `src/index.css`

---

## Project structure

```bash
src/
 ├── components/
 │   ├── auth/          # Auth components & Route guards (PasswordStrengthPanel, ProtectedRoute)
 │   ├── layout/        # Navbar and footer
 │   ├── sections/      # Hero, Features, Workflow, Dashboard, Analytics, Faq
 │   └── ui/            # Reusable UI primitives (Button, Card, Badge, MaterialIcon, etc.)
 ├── hooks/
 │   ├── useTheme.js    # Theme persistence and system sync
 │   └── useAuth.js     # Custom hook for auth context
 ├── pages/
 │   ├── LandingPage.jsx # Main Page composer
 │   └── auth/           # Authentication pages
 │       ├── SignIn.jsx      
 │       ├── SignUp.jsx
 │       ├── ForgotPassword.jsx
 │       ├── ResetPassword.jsx
 │       └── VerifyEmail.jsx
 ├── styles/            # Shared style utilities
 ├── index.css          # Tailwind imports and global styles
 ├── App.jsx            # Routing and Hash-based Navigation
 └── main.jsx           # App entry point
```

---

## Screenshots / Preview (add your own)


| Desktop (Hero) | Analytics | Auth Flow |
|---:|:---:|:---:|
| ![Hero](public/preview-hero.png) | ![Analytics](public/preview-analytics.png) | ![Auth](public/preview-auth.png) |

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
- Robust client-side validation and secure password-strength requirements on all Auth forms

---

## Contributing

- This repo is structured for a single front-end experience.
- Use branches for content updates and open a PR for major layout changes.

---

## Contact

**ANEEB UR REHMAN — Full Stack AI Engineer**  
Email: dev.aneeb.rehman@gmail.com  
GitHub: https://github.com/developer-aneeb
LinkedIn: https://www.linkedin.com/in/aneeb-ur-rehman-528a50299/