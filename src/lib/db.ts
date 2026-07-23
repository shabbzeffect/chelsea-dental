import { db, schema } from '@/db';
import { eq, and, desc, asc, like, sql, gte, lte, between, count } from 'drizzle-orm';

// ============================================================
// USERS
// ============================================================

export async function getUserByEmail(email: string) {
  const result = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
  return result;
}

export async function getUserById(id: string) {
  const result = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
  return result;
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  role?: string;
}) {
  const result = await db.insert(schema.users).values({
    email: data.email,
    passwordHash: data.passwordHash,
    fullName: data.fullName,
    phone: data.phone,
    role: data.role || 'patient',
  }).returning();
  return result[0];
}

export async function updateUser(id: string, data: any) {
  const result = await db.update(schema.users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.users.id, id))
    .returning();
  return result[0];
}

// ============================================================
// SESSIONS
// ============================================================

export async function createSession(userId: string, token: string, expiresAt: Date) {
  const result = await db.insert(schema.sessions).values({
    userId,
    token,
    expiresAt,
  }).returning();
  return result[0];
}

export async function getSessionByToken(token: string) {
  const result = await db.query.sessions.findFirst({
    where: (sessions, { eq, and, gte }) => and(
      eq(sessions.token, token),
      gte(sessions.expiresAt, new Date())
    ),
    with: {
      user: true,
    },
  });
  return result;
}

export async function deleteSession(token: string) {
  await db.delete(schema.sessions).where(eq(schema.sessions.token, token));
}

export async function deleteExpiredSessions() {
  await db.delete(schema.sessions).where(lte(schema.sessions.expiresAt, new Date()));
}

// ============================================================
// PATIENTS
// ============================================================

export async function getPatients(filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const offset = (page - 1) * limit;

  let whereClause;
  if (filters?.search) {
    whereClause = (patients: any, { or, like }: any) => or(
      like(patients.patientNumber, `%${filters.search}%`),
      like(patients.fullName, `%${filters.search}%`),
      like(patients.phone, `%${filters.search}%`)
    );
  }

  const result = await db.query.patients.findMany({
    where: whereClause,
    with: {
      user: true,
    },
    orderBy: (patients, { desc }) => [desc(patients.createdAt)],
    limit,
    offset,
  });

  const total = await db.select({ count: count() }).from(schema.patients);

  return {
    patients: result,
    total: total[0].count,
    page,
    limit,
    totalPages: Math.ceil(total[0].count / limit),
  };
}

export async function getPatientById(id: string) {
  const result = await db.query.patients.findFirst({
    where: (patients, { eq }) => eq(patients.id, id),
    with: {
      user: true,
      notes: true,
      emergencyContacts: true,
      appointments: {
        orderBy: (appointments, { desc }) => [desc(appointments.appointmentDate)],
        limit: 10,
      },
      treatments: {
        orderBy: (treatments, { desc }) => [desc(treatments.treatmentDate)],
        limit: 10,
      },
      invoices: {
        orderBy: (invoices, { desc }) => [desc(invoices.createdAt)],
      },
    },
  });
  return result;
}

export async function createPatient(data: {
  userId?: string;
  patientNumber: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  insuranceProvider?: string;
  insuranceId?: string;
  allergies?: string;
  medicalConditions?: string;
}) {
  const result = await db.insert(schema.patients).values(data).returning();
  return result[0];
}

export async function updatePatient(id: string, data: any) {
  const result = await db.update(schema.patients)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.patients.id, id))
    .returning();
  return result[0];
}

// ============================================================
// STAFF
// ============================================================

export async function getStaff(filters?: {
  search?: string;
  position?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const offset = (page - 1) * limit;

  const result = await db.query.staff.findMany({
    with: {
      user: true,
      certifications: true,
      schedule: true,
    },
    orderBy: (staff, { asc }) => [asc(staff.staffNumber)],
    limit,
    offset,
  });

  const total = await db.select({ count: count() }).from(schema.staff);

  return {
    staff: result,
    total: total[0].count,
    page,
    limit,
    totalPages: Math.ceil(total[0].count / limit),
  };
}

export async function getStaffById(id: string) {
  const result = await db.query.staff.findFirst({
    where: (staff, { eq }) => eq(staff.id, id),
    with: {
      user: true,
      certifications: true,
      schedule: true,
    },
  });
  return result;
}

export async function getDentists() {
  const result = await db.query.staff.findMany({
    where: (staff, { eq, and }) => and(
      eq(staff.position, 'dentist'),
      eq(staff.status, 'active')
    ),
    with: {
      user: true,
    },
    orderBy: (staff, { asc }) => [asc(staff.staffNumber)],
  });
  return result;
}

// ============================================================
// APPOINTMENTS
// ============================================================

export async function getAppointments(filters?: {
  patientId?: string;
  dentistId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const offset = (page - 1) * limit;

  const result = await db.query.appointments.findMany({
    with: {
      patient: true,
      dentist: true,
      appointmentType: true,
    },
    orderBy: [
      asc(schema.appointments.appointmentDate),
      asc(schema.appointments.startTime),
    ],
    limit,
    offset,
  });

  return result;
}

export async function getAppointmentById(id: string) {
  const result = await db.query.appointments.findFirst({
    where: (appointments, { eq }) => eq(appointments.id, id),
    with: {
      patient: true,
      dentist: true,
      appointmentType: true,
      reminders: true,
      treatments: true,
    },
  });
  return result;
}

export async function createAppointment(data: {
  patientId: string;
  dentistId?: string;
  appointmentTypeId?: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  reason?: string;
}) {
  const result = await db.insert(schema.appointments).values(data).returning();
  return result[0];
}

export async function updateAppointment(id: string, data: any) {
  const result = await db.update(schema.appointments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.appointments.id, id))
    .returning();
  return result[0];
}

export async function checkAppointmentConflict(
  dentistId: string,
  appointmentDate: string,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
) {
  const conflicting = await db.query.appointments.findMany({
    where: (appointments, { and, or, eq, gte, lte }) => and(
      eq(appointments.dentistId, dentistId),
      eq(appointments.appointmentDate, appointmentDate),
      eq(appointments.status, 'scheduled'),
      or(
        and(
          gte(appointments.startTime, startTime),
          lte(appointments.startTime, endTime)
        ),
        and(
          gte(appointments.endTime, startTime),
          lte(appointments.endTime, endTime)
        )
      )
    ),
  });

  return conflicting.length > 0;
}

// ============================================================
// TREATMENTS
// ============================================================

export async function getTreatments(filters?: {
  patientId?: string;
  dentistId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const offset = (page - 1) * limit;

  const result = await db.query.treatments.findMany({
    with: {
      patient: true,
      dentist: true,
      appointment: true,
      files: true,
      clinicalNotes: true,
    },
    orderBy: (treatments, { desc }) => [desc(treatments.treatmentDate)],
    limit,
    offset,
  });

  return result;
}

export async function getTreatmentById(id: string) {
  const result = await db.query.treatments.findFirst({
    where: (treatments, { eq }) => eq(treatments.id, id),
    with: {
      patient: true,
      dentist: true,
      appointment: true,
      files: true,
      clinicalNotes: true,
    },
  });
  return result;
}

export async function createTreatment(data: {
  appointmentId?: string;
  patientId: string;
  dentistId?: string;
  treatmentDate: string;
  treatmentCode?: string;
  description: string;
  toothNumbers?: any;
  status?: string;
  notes?: string;
  estimatedCost?: string;
  actualCost?: string;
}) {
  const result = await db.insert(schema.treatments).values(data).returning();
  return result[0];
}

export async function updateTreatment(id: string, data: any) {
  const result = await db.update(schema.treatments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.treatments.id, id))
    .returning();
  return result[0];
}

// ============================================================
// INVOICES & PAYMENTS
// ============================================================

export async function getInvoices(filters?: {
  patientId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const offset = (page - 1) * limit;

  const result = await db.query.invoices.findMany({
    with: {
      patient: true,
      items: true,
      payments: true,
    },
    orderBy: (invoices, { desc }) => [desc(invoices.createdAt)],
    limit,
    offset,
  });

  return result;
}

export async function getInvoiceById(id: string) {
  const result = await db.query.invoices.findFirst({
    where: (invoices, { eq }) => eq(invoices.id, id),
    with: {
      patient: true,
      items: true,
      payments: true,
      insuranceClaims: true,
    },
  });
  return result;
}

export async function createInvoice(data: {
  patientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  totalAmount: string;
  notes?: string;
}) {
  const result = await db.insert(schema.invoices).values(data).returning();
  return result[0];
}

export async function createInvoiceItem(data: {
  invoiceId: string;
  treatmentId?: string;
  description: string;
  quantity?: number;
  unitPrice: string;
  totalPrice: string;
}) {
  const result = await db.insert(schema.invoiceItems).values(data).returning();
  return result[0];
}

export async function createPayment(data: {
  invoiceId?: string;
  patientId: string;
  paymentDate: string;
  paymentMethod: string;
  amount: string;
  referenceNumber?: string;
  notes?: string;
}) {
  const result = await db.insert(schema.payments).values(data).returning();
  
  // Update invoice paid amount if invoiceId provided
  if (data.invoiceId) {
    const invoice = await db.query.invoices.findFirst({
      where: (invoices, { eq }) => eq(invoices.id, data.invoiceId!),
    });
    
    if (invoice) {
      const newPaidAmount = (parseFloat(invoice.paidAmount || '0') + parseFloat(data.amount)).toString();
      const newStatus = parseFloat(newPaidAmount) >= parseFloat(invoice.totalAmount) ? 'paid' : 'partial';
      
      await db.update(schema.invoices)
        .set({ 
          paidAmount: newPaidAmount, 
          status: newStatus,
          updatedAt: new Date() 
        })
        .where(eq(schema.invoices.id, data.invoiceId!));
    }
  }
  
  return result[0];
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export async function getNotifications(userId: string, unreadOnly?: boolean) {
  const result = await db.query.notifications.findMany({
    where: (notifications, { eq, and }) => 
      unreadOnly 
        ? and(eq(notifications.userId, userId), eq(notifications.isRead, false))
        : eq(notifications.userId, userId),
    orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
    limit: 50,
  });
  return result;
}

export async function createNotification(data: {
  userId: string;
  notificationType: string;
  title?: string;
  message: string;
  link?: string;
}) {
  const result = await db.insert(schema.notifications).values(data).returning();
  return result[0];
}

export async function markNotificationRead(id: string) {
  await db.update(schema.notifications)
    .set({ isRead: true })
    .where(eq(schema.notifications.id, id));
}

// ============================================================
// DASHBOARD STATS
// ============================================================

export async function getDashboardStats() {
  const today = new Date().toISOString().split('T')[0];
  
  const [
    totalPatients,
    activePatients,
    todaysAppointments,
    pendingPayments,
    totalRevenue,
    staffCount,
  ] = await Promise.all([
    db.select({ count: count() }).from(schema.patients),
    db.select({ count: count() }).from(schema.patients).where(eq(schema.patients.status, 'active')),
    db.select({ count: count() }).from(schema.appointments).where(eq(schema.appointments.appointmentDate, today)),
    db.select({ count: count() }).from(schema.invoices).where(eq(schema.invoices.status, 'pending')),
    db.select({ 
      total: sql<string>`COALESCE(SUM(CAST(${schema.payments.amount} AS DECIMAL)), 0)`.as('total')
    }).from(schema.payments).where(eq(schema.payments.status, 'completed')),
    db.select({ count: count() }).from(schema.staff).where(eq(schema.staff.status, 'active')),
  ]);

  return {
    totalPatients: totalPatients[0].count,
    activePatients: activePatients[0].count,
    todaysAppointments: todaysAppointments[0].count,
    pendingPayments: pendingPayments[0].count,
    totalRevenue: totalRevenue[0].total,
    staffCount: staffCount[0].count,
  };
}
