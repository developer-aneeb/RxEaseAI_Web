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
  medicine_name: z.string().min(1, 'Please enter the medicine name'),
  dosage: z.string().optional().or(z.literal('')),
  date: z.string().min(1, 'Please select a reminder date'),
  time: z.string().min(1, 'Please select a reminder time'),
  schedule_type: z.enum(['once', 'daily', 'weekly', 'monthly']),
  weekdays: z.array(z.number()).optional(),
  remind_count: z.number().min(1).max(10).optional(),
  remind_interval_minutes: z.number().min(1).max(240).optional(),
  meal: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.schedule_type === 'weekly' && (!data.weekdays || data.weekdays.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select at least one day of the week',
      path: ['weekdays'],
    });
  }
});

export const followUpSchema = z.object({
  reminder_type: z.enum(['revisit', 'lab_test', 'general'], {
    required_error: 'Please select a follow-up type',
  }),
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title is too long'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  notes: z.string().optional().or(z.literal('')),
});

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  specialty: z.string().optional().or(z.literal('')),
  date_of_birth: z.string().optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female', 'Other', '']).optional(),
  blood_group: z.string().optional().or(z.literal('')),
  height: z.string().optional().or(z.literal('')),
  weight: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  province: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
});

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  feedbackText: z.string().min(10, 'Please write at least 10 characters of feedback'),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

