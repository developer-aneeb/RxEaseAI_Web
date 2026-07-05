import { z } from 'zod';
import { validateReminderDateTime } from './authValidation';

// Shared base rules
const passwordRules = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one number or special character');

export const signInSchema = z.object({
  email: z.string().min(1, 'Please enter your email').email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
});

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().min(1, 'Please enter your email address').email('Please enter a valid email address'),
  password: passwordRules,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Please enter your email address').email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: passwordRules,
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const reminderSchema = z.object({
  name: z.string().min(1, 'Please enter the medicine name'),
  date: z.string().min(1, 'Please select a reminder date'),
  time: z.string().min(1, 'Please select a reminder time'),
  meal: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Before Sleep', 'Anytime'], {
    required_error: 'Please select a meal timing',
  }),
}).superRefine((data, ctx) => {
  const error = validateReminderDateTime(data.date, data.time);
  if (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: error,
      path: ['time'],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: error,
      path: ['date'],
    });
  }
});

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  specialty: z.string().min(1, 'Specialty/Role is required'),
});

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  feedbackText: z.string().min(10, 'Please write at least 10 characters of feedback'),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

