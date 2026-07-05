export const validateFullName = (fullName) => {
  if (!fullName || fullName.trim() === '') {
    return 'Please enter your full name.';
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Please enter your email address.';
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || password === '') {
    return 'Please enter a password.';
  }
  const currentStrengthScore = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
  ].filter(Boolean).length;
  
  if (currentStrengthScore < 4) {
    return 'Please satisfy all password strength requirements.';
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword === '') {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
};

export const validateTerms = (terms) => {
  if (!terms) {
    return 'You must agree to the terms.';
  }
  return null;
};

export const validateReminderDateTime = (date, time) => {
  if (!date) {
    return 'Please select a reminder date.';
  }
  if (!time) {
    return 'Please select a reminder time.';
  }
  const reminderDateTime = new Date(`${date}T${time}`);
  if (isNaN(reminderDateTime.getTime())) {
    return 'Invalid date or time format.';
  }
  if (reminderDateTime <= new Date()) {
    return 'Reminders must be set in the future, never in the past.';
  }
  return null;
};

