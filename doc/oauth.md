# Google Sign-In Architecture & Integration Guide: RxEaseAI

This document serves as the **single source of truth** for configuring, understanding, and implementing **Google Sign-In (OAuth 2.0)** for the **RxEaseAI** platform. 

It covers two complete architectural implementations:
1. **Method A (Active Architecture):** Managed Google OAuth via **Supabase Auth** + Client-side SDK & Backend Profile Auto-Sync.
2. **Method B (Custom / Standalone Architecture):** Direct Node.js/Express implementation using **Passport.js** / `google-auth-library` without Supabase.

---

## 1. Google Cloud Console Setup

Regardless of whether you use Supabase or Passport.js, your Google Cloud Platform (GCP) credentials must be configured as follows:

### 1.1 OAuth Consent Screen Configuration
* **Location:** Google Auth Platform -> Branding -> App information
* **App Name:** `RxEaseAI`
* **User Support Email:** `dev.aneeb.rehman@gmail.com`
* **App Logo:** 120x120px square image (PNG/JPG/BMP, Max 1MB)
* **Application Home Page:** `https://rx-ease-ai-web.vercel.app`
* **Application Privacy Policy:** `https://rx-ease-ai-web.vercel.app/privacy`
* **Application Terms of Service:** `https://rx-ease-ai-web.vercel.app/terms`
* **Authorized Domains:**
  - `rx-ease-ai-web.vercel.app`
  - `rxeaseai.onrender.com`
  - `iriqdqbqefltfskwpdrw.supabase.co`

### 1.2 Web Client ID Credentials
* **Location:** Google Auth Platform -> Credentials -> Client ID for Web application
* **Name:** `RxEaseAI_Web`
* **Authorized JavaScript Origins:**
  - `https://rx-ease-ai-web.vercel.app` (Production)
  - `http://localhost:5173` (Local Development)
* **Authorized Redirect URIs:**
  - **For Supabase (Method A):** `https://iriqdqbqefltfskwpdrw.supabase.co/auth/v1/callback`
  - **For Custom Passport.js (Method B):** `http://localhost:3000/api/v1/auth/google/callback` (Dev) / `https://rxeaseai.onrender.com/api/v1/auth/google/callback` (Prod)

---

## 2. Method A: Google Sign-In with Supabase Auth (Current Active Setup)

In this architecture, **the frontend initiates OAuth directly with Supabase**, which handles Google authorization, exchanges tokens, and creates a Supabase Auth session. The Node.js Express backend validates incoming JWTs and auto-syncs user profile records in PostgreSQL (`user_profiles`).

### 2.1 Complete Flow Diagram

```text
  ┌─────────────────────────┐
  │      React Frontend     │
  │   (Vite + Vercel)       │
  └────────────┬────────────┘
               │
               │ 1. User clicks "Continue with Google"
               ▼
  ┌─────────────────────────┐
  │    oauthService.js      │ ──► Calls `supabase.auth.signInWithOAuth({ provider: 'google' })`
  └────────────┬────────────┘
               │
               │ 2. Redirects browser
               ▼
  ┌─────────────────────────┐
  │    Google OAuth 2.0     │ ──► User authenticates & grants consent
  └────────────┬────────────┘
               │
               │ 3. Redirect back with authorization code
               ▼
  ┌─────────────────────────┐
  │ Supabase Auth Callback  │ ──► Exchanges code for access/refresh tokens
  └────────────┬────────────┘
               │
               │ 4. Redirects to Frontend: `/auth/oauth/success#access_token=...`
               ▼
  ┌─────────────────────────┐
  │   App.jsx Callback      │ ──► Parses hash, saves `rxease_token`, calls `initializeAuth()`
  └────────────┬────────────┘
               │
               │ 5. GET /api/v1/auth/profile with Bearer Token
               ▼
  ┌─────────────────────────┐
  │ Node.js/Express Backend │ ──► `verifyToken` middleware validates Supabase JWT
  └────────────┬────────────┘
               │
               │ 6. If profile missing -> Auto-creates `user_profiles` record
               ▼
  ┌─────────────────────────┐
  │  PostgreSQL Database    │ ──► Returns authenticated user session + profile
  └─────────────────────────┘
```

### 2.2 Frontend Implementation Details

#### 1. OAuth Service (`frontend/src/services/oauthService.js`)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const oauthService = {
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/oauth/success`,
      },
    });
    if (error) throw error;
    return data;
  }
};
```

#### 2. Triggering Login (`frontend/src/pages/auth/SignIn.jsx`)
```javascript
import { oauthService } from '../../services/oauthService';

// Inside component handler:
const handleGoogleSignIn = async () => {
  try {
    await oauthService.signInWithGoogle();
  } catch (error) {
    showToast(getFriendlyErrorMessage(error), 'error');
  }
};
```

#### 3. Handling Callback & Hash Fragments (`frontend/src/App.jsx`)
```javascript
useEffect(() => {
  if (pathname.startsWith('/auth/oauth/success')) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const searchParams = new URLSearchParams(window.location.search);
    
    const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');

    if (accessToken) {
      localStorage.setItem('rxease_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('rxease_refresh_token', refreshToken);
      }
      // Re-initialize auth store to fetch user profile before routing
      initializeAuth().then(() => {
        window.location.href = `${window.location.origin}/#home`;
      });
    } else {
      window.location.href = `${window.location.origin}/#signin`;
    }
  }
}, [pathname]);
```

### 2.3 Backend User Sync Middleware (`backend/middleware/auth.js`)
The backend verifies the Supabase token and automatically provisions a profile in PostgreSQL if it's the user's first time signing in via Google:

```javascript
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.substring(7);

  // 1. Verify token with Supabase Auth
  const { data: { user }, error } = await supabaseAnon.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  // 2. Fetch profile from user_profiles
  let { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, is_active, role_id')
    .eq('user_id', user.id)
    .maybeSingle();

  // 3. Auto-sync: Create profile if missing (first-time Google Sign-In)
  if (!profile) {
    const userRoleId = await getRoleIdByKey(ROLE_KEYS.USER);
    const { data: newProfile } = await supabaseAdmin
      .from('user_profiles')
      .insert([{
        user_id: user.id,
        name: user.user_metadata?.full_name || 'User',
        role_id: userRoleId,
        is_active: true
      }])
      .select('user_id, is_active, role_id')
      .single();
    profile = newProfile;
  }

  req.user = { id: profile.user_id, role_id: profile.role_id, email: user.email };
  next();
};
```

---

## 3. Method B: Custom Google Sign-In without Supabase (Passport.js / Local)

If you decide to remove Supabase entirely and handle Google OAuth natively using Node.js, Express, and **Passport.js**, follow this architecture.

### 3.1 Flow Diagram (Backend-Driven OAuth)

```text
┌─────────────────┐       1. GET /api/v1/auth/google        ┌──────────────────┐
│                 ├────────────────────────────────────────►│                  │
│ React Frontend  │                                         │ Express Backend  │
│ (Port 5173)     │◄────────────────────────────────────────┤ (Port 3000)      │
└────────┬────────┘       2. 302 Redirect to Google         └────────┬─────────┘
         │                                                           │
         │                                                           │ 3. Authenticates
         ▼                                                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            Google OAuth 2.0 Server                           │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │
                                       │ 4. Redirect with `code`
                                       ▼
                            ┌──────────────────┐
                            │ Express Callback │ ──► Passport exchanges `code` for Google Profile
                            └────────┬─────────┘
                                     │
                                     │ 5. Creates/finds user in Postgres DB
                                     │ 6. Signs custom JWT token
                                     ▼
                            ┌──────────────────┐
                            │  302 Redirect    │ ──► `http://localhost:5173/#oauth-success?token=JWT`
                            └──────────────────┘
```

### 3.2 Backend Setup (Express + Passport.js)

#### 1. Install Dependencies
```bash
npm install passport passport-google-oauth20 jsonwebtoken
```

#### 2. Passport Configuration (`backend/config/passport.js`)
```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db'); // Your database connection

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const name = profile.displayName;

      // 1. Find user by google_id or email
      let user = await db.query('SELECT * FROM user_profiles WHERE google_id = $1 OR email = $2', [googleId, email]);

      if (user.rows.length === 0) {
        // 2. Create new user profile if not found
        const newUser = await db.query(
          'INSERT INTO user_profiles (email, name, google_id, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
          [email, name, googleId, 2] // 2 = USER role
        );
        user = newUser.rows[0];
      } else {
        user = user.rows[0];
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));
```

#### 3. Auth Routes (`backend/routes/authRoutes.js`)
```javascript
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Step 1: Redirect user to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: Google callback endpoint
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }),
  (req, res) => {
    // Issue custom JWT token
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect user to React frontend with JWT token
    res.redirect(`${process.env.FRONTEND_URL}/#oauth-success?token=${token}`);
  }
);

module.exports = router;
```

---

## 4. Architectural Comparison: Supabase vs. Passport.js

| Feature | Method A: Supabase Auth | Method B: Custom Passport.js |
| :--- | :--- | :--- |
| **Complexity** | Low (Handled by SDK) | Medium (Manual token & session management) |
| **User Management** | Managed in Supabase Auth Schema | Managed entirely in local PostgreSQL |
| **Session Security** | Automatic token refresh & rotation | Requires custom Refresh Token logic |
| **Vendor Dependency**| Dependent on Supabase cloud/self-hosted | 100% Independent & Self-Hosted |
| **MFA Support** | Built-in Supabase TOTP | Custom implementation required |

---

## 5. Session & Logout Lifecycle

```text
Scenario: User Clicks "Logout"
  User clicks "Logout" -> Session destroyed in local state -> Tokens removed from localStorage -> User redirected to #signin

Scenario: Google SSO Auto-Approval
  User clicks "Continue with Google" again -> Google detects active browser session -> Auto-approves without prompting password -> Returns user immediately
```

---

## 6. Future Scope: Google Ecosystem Integration

With Google OAuth established, RxEaseAI can easily expand into Phase 2 and Phase 3 integrations using Google APIs:

1. **Google Calendar API:** Auto-schedule doctor appointments & medicine intake reminders.
2. **Gmail API:** Send automated prescription summaries & lab result alerts directly to patients.
3. **Google Drive API:** Store scanned medical reports securely in the patient's personal Google Drive.
4. **Google Maps API:** Display nearby pharmacies, hospitals, and medical labs with direct navigation.
5. **Google Meet API:** Generate video call links dynamically for telemedicine consultations.
6. **Google Health Connect / Fit:** Import daily step count, heart rate, and sleep metrics into RxEaseAI analytics.
