# Authentication Flow & Validation

RxEaseAI incorporates a complete, secure authentication flow designed with HIPAA compliance and rigorous client-side validation in mind. The UI handles complex validation rules instantly, providing immediate feedback before any backend request is triggered.

## Auth Pages Overview

All authentication pages are located in `src/pages/` and include:

1. **`SignIn.jsx`**: Handles returning users with email/password and OAuth (Google/Apple) stubs.
2. **`SignUp.jsx`**: Captures new user registrations, including robust password creation rules and a mandatory Terms of Service checkbox.
3. **`ForgotPassword.jsx`**: Initiates the account recovery flow via email.
4. **`ResetPassword.jsx`**: Handles the final step of recovery, enforcing the same rigorous password rules as the SignUp flow.
5. **`VerifyEmail.jsx`**: A dedicated landing page instructing the user to check their inbox, complete with a resend timer.

## Form State & Validation Logic

The project uses a standard React state pattern for managing form inputs and errors.

### 1. State Management
Each page maintains state for inputs, a boolean for loading, and an `errors` object.

```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [errors, setErrors] = useState({});
```

### 2. Validation Pattern
Validation occurs inside the `handleSubmit` function. If validation fails, the `errors` state is populated, preventing the submission.

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};

  // Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    newErrors.email = "Please enter a valid email address.";
  }

  // Password Requirements (Example)
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    newErrors.password = "Password must be at least 8 characters with 1 uppercase and 1 special character.";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // Proceed with backend API Call
  setIsSubmitting(true);
  // ... API Call Logic ...
}
```

### 3. Inline Error Clearing
To ensure a smooth user experience, the error state is cleared the moment a user begins typing in the corresponding field:

```javascript
onChange={(e) => { 
  setEmail(e.target.value); 
  setErrors(prev => ({...prev, email: ''})); // Clears error instantly
}}
```

## Security Visuals: `PasswordStrengthPanel`

For both `SignUp` and `ResetPassword`, the `PasswordStrengthPanel.jsx` component is utilized.

### Functionality
- Evaluates the current `password` string in real-time.
- Displays a 4-bar colored strength indicator (Red -> Orange -> Yellow -> Green).
- Enforces strict rules:
  - 8+ characters
  - Lowercase & Uppercase letters
  - Numbers
  - Special symbols
- Returns a UI block highlighting exactly which criteria the user has met.

> **Security Note**: While client-side validation provides a great UX, these exact same validations **must** be duplicated on the backend server before creating or updating any user credentials to prevent API abuse.
