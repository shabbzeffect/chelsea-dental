import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
  time,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================
// USERS & AUTHENTICATION
// ============================================================

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: varchar('role', { length: 20 }).notNull().default('patient'), // admin, dentist, receptionist, patient
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, inactive, suspended
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_users_email').on(table.email),
  index('idx_users_role').on(table.role),
]);

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_sessions_token').on(table.token),
  index('idx_sessions_user_id').on(table.userId),
]);

// ============================================================
// PATIENTS
// ============================================================

export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  patientNumber: varchar('patient_number', { length: 20 }).notNull().unique(),
  dateOfBirth: date('date_of_birth'),
  gender: varchar('gender', { length: 10 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  zip: varchar('zip', { length: 10 }),
  insuranceProvider: varchar('insurance_provider', { length: 255 }),
  insuranceId: varchar('insurance_id', { length: 100 }),
  allergies: text('allergies'),
  medicalConditions: text('medical_conditions'),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, inactive, transferred
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_patients_user_id').on(table.userId),
  index('idx_patients_patient_number').on(table.patientNumber),
  index('idx_patients_status').on(table.status),
]);

export const patientNotes = pgTable('patient_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  noteContent: text('note_content').notNull(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_patient_notes_patient_id').on(table.patientId),
]);

export const emergencyContacts = pgTable('emergency_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  relationship: varchar('relationship', { length: 100 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
}, (table) => [
  index('idx_emergency_contacts_patient_id').on(table.patientId),
]);

// ============================================================
// STAFF
// ============================================================

export const staff = pgTable('staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  staffNumber: varchar('staff_number', { length: 20 }).notNull().unique(),
  position: varchar('position', { length: 100 }).notNull(), // dentist, hygienist, receptionist, admin
  specialization: varchar('specialization', { length: 100 }), // orthodontics, cosmetic, pediatric, general
  licenseNumber: varchar('license_number', { length: 100 }),
  licenseExpiry: date('license_expiry'),
  startDate: date('start_date'),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, on_leave, inactive
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_staff_user_id').on(table.userId),
  index('idx_staff_position').on(table.position),
  index('idx_staff_status').on(table.status),
]);

export const staffCertifications = pgTable('staff_certifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  staffId: uuid('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  certificationName: varchar('certification_name', { length: 255 }).notNull(),
  issuingBody: varchar('issuing_body', { length: 255 }),
  issueDate: date('issue_date'),
  expiryDate: date('expiry_date'),
}, (table) => [
  index('idx_staff_certifications_staff_id').on(table.staffId),
]);

export const staffSchedule = pgTable('staff_schedule', {
  id: uuid('id').defaultRandom().primaryKey(),
  staffId: uuid('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0=Sunday, 6=Saturday
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  breakStart: time('break_start'),
  breakEnd: time('break_end'),
}, (table) => [
  index('idx_staff_schedule_staff_id').on(table.staffId),
  index('idx_staff_schedule_day').on(table.dayOfWeek),
]);

// ============================================================
// APPOINTMENTS
// ============================================================

export const appointmentTypes = pgTable('appointment_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(30),
  description: text('description'),
  color: varchar('color', { length: 7 }), // hex color for calendar
}, (table) => [
  index('idx_appointment_types_name').on(table.name),
]);

export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  dentistId: uuid('dentist_id').references(() => staff.id, { onDelete: 'set null' }),
  appointmentTypeId: uuid('appointment_type_id').references(() => appointmentTypes.id),
  appointmentDate: date('appointment_date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('scheduled'), // scheduled, confirmed, in_progress, completed, canceled, no_show
  notes: text('notes'),
  reason: text('reason'),
  cancellationReason: text('cancellation_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_appointments_patient_id').on(table.patientId),
  index('idx_appointments_dentist_id').on(table.dentistId),
  index('idx_appointments_date').on(table.appointmentDate),
  index('idx_appointments_status').on(table.status),
]);

export const appointmentReminders = pgTable('appointment_reminders', {
  id: uuid('id').defaultRandom().primaryKey(),
  appointmentId: uuid('appointment_id').notNull().references(() => appointments.id, { onDelete: 'cascade' }),
  reminderType: varchar('reminder_type', { length: 20 }).notNull(), // email, sms, push
  scheduledTime: timestamp('scheduled_time').notNull(),
  sentAt: timestamp('sent_at'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, sent, failed
}, (table) => [
  index('idx_appointment_reminders_appointment_id').on(table.appointmentId),
]);

export const dentistAvailability = pgTable('dentist_availability', {
  id: uuid('id').defaultRandom().primaryKey(),
  dentistId: uuid('dentist_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  isAvailable: boolean('is_available').default(true),
}, (table) => [
  index('idx_dentist_availability_dentist_id').on(table.dentistId),
]);

// ============================================================
// TREATMENTS
// ============================================================

export const treatments = pgTable('treatments', {
  id: uuid('id').defaultRandom().primaryKey(),
  appointmentId: uuid('appointment_id').references(() => appointments.id, { onDelete: 'set null' }),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  dentistId: uuid('dentist_id').references(() => staff.id, { onDelete: 'set null' }),
  treatmentDate: date('treatment_date').notNull(),
  treatmentCode: varchar('treatment_code', { length: 20 }), // ADA/CDT code
  description: text('description').notNull(),
  toothNumbers: jsonb('tooth_numbers'), // Array of tooth numbers (FDI system)
  status: varchar('status', { length: 20 }).notNull().default('completed'), // planned, in_progress, completed
  notes: text('notes'),
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_treatments_patient_id').on(table.patientId),
  index('idx_treatments_appointment_id').on(table.appointmentId),
  index('idx_treatments_dentist_id').on(table.dentistId),
  index('idx_treatments_date').on(table.treatmentDate),
]);

export const treatmentFiles = pgTable('treatment_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  treatmentId: uuid('treatment_id').notNull().references(() => treatments.id, { onDelete: 'cascade' }),
  fileType: varchar('file_type', { length: 50 }), // xray, photo, document
  filePath: varchar('file_path', { length: 500 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
}, (table) => [
  index('idx_treatment_files_treatment_id').on(table.treatmentId),
]);

export const clinicalNotes = pgTable('clinical_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  treatmentId: uuid('treatment_id').notNull().references(() => treatments.id, { onDelete: 'cascade' }),
  noteContent: text('note_content').notNull(),
  dentistId: uuid('dentist_id').references(() => staff.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_clinical_notes_treatment_id').on(table.treatmentId),
]);

// ============================================================
// BILLING & PAYMENTS
// ============================================================

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
  invoiceDate: date('invoice_date').notNull(),
  dueDate: date('due_date'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal('paid_amount', { precision: 10, scale: 2 }).default('0'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, paid, partial, overdue, canceled
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_invoices_patient_id').on(table.patientId),
  index('idx_invoices_invoice_number').on(table.invoiceNumber),
  index('idx_invoices_status').on(table.status),
]);

export const invoiceItems = pgTable('invoice_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceId: uuid('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  treatmentId: uuid('treatment_id').references(() => treatments.id, { onDelete: 'set null' }),
  description: text('description').notNull(),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
}, (table) => [
  index('idx_invoice_items_invoice_id').on(table.invoiceId),
]);

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  paymentDate: date('payment_date').notNull(),
  paymentMethod: varchar('payment_method', { length: 20 }).notNull(), // cash, card, check, insurance
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  referenceNumber: varchar('reference_number', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull().default('completed'), // pending, completed, failed, refunded
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_payments_invoice_id').on(table.invoiceId),
  index('idx_payments_patient_id').on(table.patientId),
  index('idx_payments_date').on(table.paymentDate),
]);

export const insuranceClaims = pgTable('insurance_claims', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
  claimNumber: varchar('claim_number', { length: 50 }).notNull().unique(),
  claimDate: date('claim_date').notNull(),
  claimAmount: decimal('claim_amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('submitted'), // submitted, processing, approved, denied, appealed
  responseDate: date('response_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_insurance_claims_patient_id').on(table.patientId),
  index('idx_insurance_claims_invoice_id').on(table.invoiceId),
  index('idx_insurance_claims_status').on(table.status),
]);

// ============================================================
// NOTIFICATIONS & MESSAGES
// ============================================================

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  notificationType: varchar('notification_type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  link: varchar('link', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_notifications_user_id').on(table.userId),
  index('idx_notifications_is_read').on(table.isRead),
]);

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipientId: uuid('recipient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subject: varchar('subject', { length: 255 }),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_messages_sender_id').on(table.senderId),
  index('idx_messages_recipient_id').on(table.recipientId),
]);

// ============================================================
// CLINIC SETTINGS
// ============================================================

export const clinicSettings = pgTable('clinic_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value'),
  updatedBy: uuid('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const systemLogs = pgTable('system_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: uuid('entity_id'),
  changes: jsonb('changes'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_system_logs_user_id').on(table.userId),
  index('idx_system_logs_action').on(table.action),
  index('idx_system_logs_created_at').on(table.createdAt),
]);

// ============================================================
// SCHEDULED REPORTS
// ============================================================

export const scheduledReports = pgTable('scheduled_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  reportType: varchar('report_type', { length: 50 }).notNull(), // patient, revenue, appointments, treatments, dashboard
  recipients: jsonb('recipients').notNull(), // Array of email addresses or 'all-staff'
  frequency: varchar('frequency', { length: 20 }).notNull(), // daily, weekly, monthly
  dayOfWeek: integer('day_of_week'), // 0-6 for weekly (0=Sunday)
  dayOfMonth: integer('day_of_month'), // 1-31 for monthly
  timeOfDay: varchar('time_of_day', { length: 5 }).notNull().default('09:00'), // HH:MM format
  message: text('message'),
  isActive: boolean('is_active').default(true),
  lastSentAt: timestamp('last_sent_at'),
  nextSendAt: timestamp('next_send_at'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_scheduled_reports_is_active').on(table.isActive),
  index('idx_scheduled_reports_next_send_at').on(table.nextSendAt),
]);

// ============================================================
// RELATIONS
// ============================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  patient: one(patients),
  staff: one(staff),
  sessions: many(sessions),
  notifications: many(notifications),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'recipient' }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, { fields: [patients.userId], references: [users.id] }),
  notes: many(patientNotes),
  emergencyContacts: many(emergencyContacts),
  appointments: many(appointments),
  treatments: many(treatments),
  invoices: many(invoices),
  payments: many(payments),
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
  user: one(users, { fields: [staff.userId], references: [users.id] }),
  certifications: many(staffCertifications),
  schedule: many(staffSchedule),
  appointments: many(appointments),
  treatments: many(treatments),
}));

export const staffCertificationsRelations = relations(staffCertifications, ({ one }) => ({
  staff: one(staff, { fields: [staffCertifications.staffId], references: [staff.id] }),
}));

export const staffScheduleRelations = relations(staffSchedule, ({ one }) => ({
  staff: one(staff, { fields: [staffSchedule.staffId], references: [staff.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  patient: one(patients, { fields: [appointments.patientId], references: [patients.id] }),
  dentist: one(staff, { fields: [appointments.dentistId], references: [staff.id] }),
  appointmentType: one(appointmentTypes, { fields: [appointments.appointmentTypeId], references: [appointmentTypes.id] }),
  reminders: many(appointmentReminders),
  treatments: many(treatments),
}));

export const appointmentTypesRelations = relations(appointmentTypes, ({ many }) => ({
  appointments: many(appointments),
}));

export const treatmentsRelations = relations(treatments, ({ one, many }) => ({
  appointment: one(appointments, { fields: [treatments.appointmentId], references: [appointments.id] }),
  patient: one(patients, { fields: [treatments.patientId], references: [patients.id] }),
  dentist: one(staff, { fields: [treatments.dentistId], references: [staff.id] }),
  files: many(treatmentFiles),
  clinicalNotes: many(clinicalNotes),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  patient: one(patients, { fields: [invoices.patientId], references: [patients.id] }),
  items: many(invoiceItems),
  payments: many(payments),
  insuranceClaims: many(insuranceClaims),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, { fields: [invoiceItems.invoiceId], references: [invoices.id] }),
  treatment: one(treatments, { fields: [invoiceItems.treatmentId], references: [treatments.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
  patient: one(patients, { fields: [payments.patientId], references: [patients.id] }),
}));

export const insuranceClaimsRelations = relations(insuranceClaims, ({ one }) => ({
  patient: one(patients, { fields: [insuranceClaims.patientId], references: [patients.id] }),
  invoice: one(invoices, { fields: [insuranceClaims.invoiceId], references: [invoices.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
  recipient: one(users, { fields: [messages.recipientId], references: [users.id] }),
}));
