import { z } from 'zod';

// ============================================================
// AUTH VALIDATORS
// ============================================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceId: z.string().optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ============================================================
// PATIENT VALIDATORS
// ============================================================

export const patientSchema = z.object({
  userId: z.string().uuid().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceId: z.string().optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  status: z.enum(['active', 'inactive', 'transferred']).optional(),
});

// ============================================================
// APPOINTMENT VALIDATORS
// ============================================================

export const appointmentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  dentistId: z.string().uuid().optional(),
  appointmentTypeId: z.string().uuid().optional(),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  notes: z.string().optional(),
  reason: z.string().optional(),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

// ============================================================
// TREATMENT VALIDATORS
// ============================================================

export const treatmentSchema = z.object({
  appointmentId: z.string().uuid().optional(),
  patientId: z.string().uuid('Invalid patient ID'),
  dentistId: z.string().uuid().optional(),
  treatmentDate: z.string().min(1, 'Treatment date is required'),
  treatmentCode: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  toothNumbers: z.array(z.number()).optional(),
  status: z.enum(['planned', 'in_progress', 'completed']).optional(),
  notes: z.string().optional(),
  estimatedCost: z.string().optional(),
  actualCost: z.string().optional(),
});

// ============================================================
// INVOICE VALIDATORS
// ============================================================

export const invoiceSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    treatmentId: z.string().uuid().optional(),
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1).default(1),
    unitPrice: z.string().min(1, 'Unit price is required'),
  })).min(1, 'At least one item is required'),
});

export const paymentSchema = z.object({
  invoiceId: z.string().uuid().optional(),
  patientId: z.string().uuid('Invalid patient ID'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMethod: z.enum(['cash', 'card', 'check', 'insurance']),
  amount: z.string().min(1, 'Amount is required'),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================================
// STAFF VALIDATORS
// ============================================================

export const staffSchema = z.object({
  userId: z.string().uuid().optional(),
  position: z.enum(['dentist', 'hygienist', 'receptionist', 'admin']),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
  startDate: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  status: z.enum(['active', 'on_leave', 'inactive']).optional(),
});

// ============================================================
// HELPER TYPES
// ============================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PatientInput = z.infer<typeof patientSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type TreatmentInput = z.infer<typeof treatmentSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type StaffInput = z.infer<typeof staffSchema>;
