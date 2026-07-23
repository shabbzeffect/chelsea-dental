import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte, sql, count, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const user = session.user as any;
    const { role } = user;

    const today = new Date().toISOString().split('T')[0];
    const todayStart = `${today}T00:00:00`;
    const todayEnd = `${today}T23:59:59`;

    let stats: any = {};

    if (role === 'admin') {
      // Admin dashboard - comprehensive stats
      const [
        totalPatients,
        activePatients,
        todaysAppointments,
        pendingPayments,
        totalRevenue,
        activeStaff,
        pendingInvoices,
        completedToday,
      ] = await Promise.all([
        db.select({ count: count() }).from(schema.patients),
        db.select({ count: count() }).from(schema.patients).where(eq(schema.patients.status, 'active')),
        db.select({ count: count() }).from(schema.appointments).where(eq(schema.appointments.appointmentDate, today)),
        db.select({ count: count() }).from(schema.invoices).where(eq(schema.invoices.status, 'pending')),
        db.select({ 
          total: sql<string>`COALESCE(SUM(CAST(${schema.payments.amount} AS DECIMAL)), 0)`.as('total')
        }).from(schema.payments).where(eq(schema.payments.status, 'completed')),
        db.select({ count: count() }).from(schema.staff).where(eq(schema.staff.status, 'active')),
        db.select({ count: count() }).from(schema.invoices).where(eq(schema.invoices.status, 'pending')),
        db.select({ count: count() }).from(schema.appointments).where(
          and(
            eq(schema.appointments.appointmentDate, today),
            eq(schema.appointments.status, 'completed')
          )
        ),
      ]);

      stats = {
        totalPatients: totalPatients[0].count,
        activePatients: activePatients[0].count,
        todaysAppointments: todaysAppointments[0].count,
        pendingPayments: pendingPayments[0].count,
        totalRevenue: totalRevenue[0].total,
        activeStaff: activeStaff[0].count,
        pendingInvoices: pendingInvoices[0].count,
        completedToday: completedToday[0].count,
      };
    } else if (role === 'dentist') {
      // Dentist dashboard - first find the staff record for this user
      const staffRecord = await db.query.staff.findFirst({
        where: eq(schema.staff.userId, user.id),
      });

      if (staffRecord) {
        const staffId = staffRecord.id;

        const [todayAppointments, upcomingAppointments, recentTreatments] = await Promise.all([
          db.select({ count: count() }).from(schema.appointments).where(
            and(
              eq(schema.appointments.dentistId, staffId),
              eq(schema.appointments.appointmentDate, today)
            )
          ),
          db.query.appointments.findMany({
            where: and(
              eq(schema.appointments.dentistId, staffId),
              gte(schema.appointments.appointmentDate, today)
            ),
            with: {
              patient: { with: { user: true } },
            },
            orderBy: (appointments, { asc }) => [
              sql`${appointments.appointmentDate} ASC`,
              sql`${appointments.startTime} ASC`,
            ],
            limit: 10,
          }),
          db.query.treatments.findMany({
            where: eq(schema.treatments.dentistId, staffId),
            with: {
              patient: { with: { user: true } },
            },
            orderBy: (treatments, { desc }) => [desc(treatments.treatmentDate)],
            limit: 5,
          }),
        ]);

        stats = {
          todayAppointments: todayAppointments[0].count,
          upcomingAppointments,
          recentTreatments,
        };
      } else {
        stats = {
          todayAppointments: 0,
          upcomingAppointments: [],
          recentTreatments: [],
        };
      }
    } else if (role === 'receptionist') {
      // Receptionist dashboard
      const [todaysCheckins, pendingPayments, upcomingAppointments] = await Promise.all([
        db.select({ count: count() }).from(schema.appointments).where(
          and(
            eq(schema.appointments.appointmentDate, today),
            eq(schema.appointments.status, 'completed')
          )
        ),
        db.select({ count: count() }).from(schema.invoices).where(eq(schema.invoices.status, 'pending')),
        db.query.appointments.findMany({
          where: and(
            eq(schema.appointments.appointmentDate, today),
            sql`${schema.appointments.status} IN ('scheduled', 'confirmed')`
          ),
          with: {
            patient: true,
            dentist: true,
          },
          orderBy: (appointments, { asc }) => [sql`${appointments.startTime} ASC`],
          limit: 20,
        }),
      ]);

      stats = {
        todaysCheckins: todaysCheckins[0].count,
        pendingPayments: pendingPayments[0].count,
        upcomingAppointments,
      };
    } else if (role === 'patient') {
      // Patient dashboard
      const patient = await db.query.patients.findFirst({
        where: eq(schema.patients.userId, user.id),
      });

      if (patient) {
        const [upcomingAppointments, recentTreatments, outstandingBalance] = await Promise.all([
          db.query.appointments.findMany({
            where: and(
              eq(schema.appointments.patientId, patient.id),
              gte(schema.appointments.appointmentDate, today),
              sql`${schema.appointments.status} IN ('scheduled', 'confirmed')`
            ),
            with: {
              dentist: { with: { user: true } },
            },
            orderBy: (appointments, { asc }) => [
              sql`${appointments.appointmentDate} ASC`,
              sql`${appointments.startTime} ASC`,
            ],
            limit: 5,
          }),
          db.query.treatments.findMany({
            where: eq(schema.treatments.patientId, patient.id),
            with: {
              dentist: { with: { user: true } },
            },
            orderBy: (treatments, { desc }) => [desc(treatments.treatmentDate)],
            limit: 5,
          }),
          db.select({
            total: sql<string>`COALESCE(SUM(CAST(${schema.invoices.totalAmount} AS DECIMAL) - CAST(COALESCE(${schema.invoices.paidAmount}, '0') AS DECIMAL)), 0)`.as('total')
          }).from(schema.invoices).where(
            and(
              eq(schema.invoices.patientId, patient.id),
              sql`${schema.invoices.status} IN ('pending', 'partial', 'overdue')`
            )
          ),
        ]);

        stats = {
          upcomingAppointments,
          recentTreatments,
          outstandingBalance: outstandingBalance[0].total,
        };
      }
    }

    return NextResponse.json({ stats, role });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
