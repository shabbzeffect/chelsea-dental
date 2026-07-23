import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte, sql, count, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    let session;
    try {
      session = await requireRole(['admin', 'dentist', 'receptionist']);
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('Dashboard API - startDate:', startDate, 'endDate:', endDate);

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Default to current month if no dates provided
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const start = startDate || firstDayOfMonth.toISOString().split('T')[0];
    const end = endDate || lastDayOfMonth.toISOString().split('T')[0];

    console.log('Dashboard API - computed start:', start, 'end:', end);

    // Patient metrics
    const totalPatients = await db.select({ count: count() }).from(schema.patients);
    const newPatients = await db
      .select({ count: count() })
      .from(schema.patients)
      .where(gte(schema.patients.createdAt, new Date(start + 'T00:00:00')));

    // Appointment metrics
    const todayAppointments = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(eq(schema.appointments.appointmentDate, today));

    const upcomingAppointments = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, today),
          lte(schema.appointments.appointmentDate, nextWeek),
          inArray(schema.appointments.status, ['scheduled', 'confirmed'])
        )
      );

    const periodAppointments = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      );

    const noShows = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(
        and(
          eq(schema.appointments.status, 'no_show'),
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      );

    // Revenue metrics
    const periodRevenue = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${schema.payments.amount} AS DECIMAL)), 0)`,
      })
      .from(schema.payments)
      .where(
        and(
          eq(schema.payments.status, 'completed'),
          gte(schema.payments.paymentDate, start),
          lte(schema.payments.paymentDate, end)
        )
      );

    const pendingPayments = await db
      .select({
        total: sql<string>`COALESCE(SUM(
          CAST(${schema.invoices.totalAmount} AS DECIMAL) - CAST(COALESCE(${schema.invoices.paidAmount}, '0') AS DECIMAL)
        ), 0)`,
      })
      .from(schema.invoices)
      .where(inArray(schema.invoices.status, ['pending', 'partial', 'overdue']));

    // Treatment metrics
    const periodTreatments = await db
      .select({ count: count() })
      .from(schema.treatments)
      .where(
        and(
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end)
        )
      );

    const periodTreatmentRevenue = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${schema.treatments.actualCost} AS DECIMAL)), 0)`,
      })
      .from(schema.treatments)
      .where(
        and(
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end),
          sql`${schema.treatments.actualCost} IS NOT NULL`
        )
      );

    // Chart data: Appointments by status
    const appointmentsByStatus = await db
      .select({
        status: schema.appointments.status,
        count: count(),
      })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      )
      .groupBy(schema.appointments.status);

    // Chart data: Appointments by day of week
    const appointmentsByDay = await db
      .select({
        dayOfWeek: sql<number>`EXTRACT(DOW FROM ${schema.appointments.appointmentDate})`,
        count: count(),
      })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      )
      .groupBy(sql`EXTRACT(DOW FROM ${schema.appointments.appointmentDate})`);

    // Chart data: Revenue by day
    const revenueByDay = await db
      .select({
        date: schema.payments.paymentDate,
        total: sql<string>`COALESCE(SUM(CAST(${schema.payments.amount} AS DECIMAL)), 0)`,
      })
      .from(schema.payments)
      .where(
        and(
          eq(schema.payments.status, 'completed'),
          gte(schema.payments.paymentDate, start),
          lte(schema.payments.paymentDate, end)
        )
      )
      .groupBy(schema.payments.paymentDate)
      .orderBy(schema.payments.paymentDate);

    // Chart data: Top treatments
    const topTreatments = await db
      .select({
        description: schema.treatments.description,
        count: count(),
      })
      .from(schema.treatments)
      .where(
        and(
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end)
        )
      )
      .groupBy(schema.treatments.description)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(5);

    // Drill-down data: Appointments by status with details
    const appointmentsByStatusDetails = await db
      .select({
        status: schema.appointments.status,
        id: schema.appointments.id,
        date: schema.appointments.appointmentDate,
        time: schema.appointments.startTime,
        patientName: sql<string>`COALESCE(${schema.users.fullName}, 'Unknown')`,
      })
      .from(schema.appointments)
      .leftJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      )
      .orderBy(schema.appointments.appointmentDate);

    // Drill-down data: Appointments by day with details
    const appointmentsByDayDetails = await db
      .select({
        dayOfWeek: sql<number>`EXTRACT(DOW FROM ${schema.appointments.appointmentDate})`,
        id: schema.appointments.id,
        date: schema.appointments.appointmentDate,
        time: schema.appointments.startTime,
        status: schema.appointments.status,
        patientName: sql<string>`COALESCE(${schema.users.fullName}, 'Unknown')`,
      })
      .from(schema.appointments)
      .leftJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      )
      .orderBy(schema.appointments.appointmentDate);

    // Drill-down data: Revenue by day with details
    const revenueByDayDetails = await db
      .select({
        date: schema.payments.paymentDate,
        id: schema.payments.id,
        amount: schema.payments.amount,
        method: schema.payments.paymentMethod,
        patientName: sql<string>`COALESCE(${schema.users.fullName}, 'Unknown')`,
      })
      .from(schema.payments)
      .leftJoin(schema.patients, eq(schema.payments.patientId, schema.patients.id))
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .where(
        and(
          eq(schema.payments.status, 'completed'),
          gte(schema.payments.paymentDate, start),
          lte(schema.payments.paymentDate, end)
        )
      )
      .orderBy(schema.payments.paymentDate);

    // Drill-down data: Treatments by type with details
    const treatmentsByTypeDetails = await db
      .select({
        description: schema.treatments.description,
        id: schema.treatments.id,
        date: schema.treatments.treatmentDate,
        cost: schema.treatments.actualCost,
        patientName: sql<string>`COALESCE(${schema.users.fullName}, 'Unknown')`,
      })
      .from(schema.treatments)
      .leftJoin(schema.patients, eq(schema.treatments.patientId, schema.patients.id))
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .where(
        and(
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end)
        )
      )
      .orderBy(schema.treatments.treatmentDate);

    // Recent activity (last 5 appointments)
    const recentAppointments = await db
      .select({
        id: schema.appointments.id,
        date: schema.appointments.appointmentDate,
        time: schema.appointments.startTime,
        status: schema.appointments.status,
        patientName: sql<string>`COALESCE(${schema.users.fullName}, 'Unknown')`,
      })
      .from(schema.appointments)
      .leftJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .orderBy(sql`${schema.appointments.appointmentDate} DESC, ${schema.appointments.startTime} DESC`)
      .limit(5);

    // Upcoming appointments
    const upcomingList = await db
      .select({
        id: schema.appointments.id,
        date: schema.appointments.appointmentDate,
        time: schema.appointments.startTime,
        status: schema.appointments.status,
        patientName: sql<string>`COALESCE(${schema.users.fullName}, 'Unknown')`,
      })
      .from(schema.appointments)
      .leftJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .where(
        and(
          gte(schema.appointments.appointmentDate, today),
          lte(schema.appointments.appointmentDate, nextWeek),
          inArray(schema.appointments.status, ['scheduled', 'confirmed'])
        )
      )
      .orderBy(schema.appointments.appointmentDate, schema.appointments.startTime)
      .limit(5);

    return NextResponse.json({
      dateRange: { start, end },
      patients: {
        total: totalPatients[0].count,
        newInPeriod: newPatients[0].count,
      },
      appointments: {
        today: todayAppointments[0].count,
        upcoming: upcomingAppointments[0].count,
        inPeriod: periodAppointments[0].count,
        noShows: noShows[0].count,
        noShowRate: periodAppointments[0].count > 0
          ? ((noShows[0].count / periodAppointments[0].count) * 100).toFixed(1)
          : '0',
      },
      revenue: {
        inPeriod: periodRevenue[0].total,
        pending: pendingPayments[0].total,
      },
      treatments: {
        inPeriod: periodTreatments[0].count,
        revenueInPeriod: periodTreatmentRevenue[0].total,
      },
      charts: {
        appointmentsByStatus,
        appointmentsByDay,
        revenueByDay,
        topTreatments,
      },
      drillDown: {
        appointmentsByStatus: appointmentsByStatusDetails,
        appointmentsByDay: appointmentsByDayDetails,
        revenueByDay: revenueByDayDetails,
        treatmentsByType: treatmentsByTypeDetails,
      },
      recentAppointments,
      upcomingAppointments: upcomingList,
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', details: errorMessage, stack: errorStack },
      { status: 500 }
    );
  }
}
