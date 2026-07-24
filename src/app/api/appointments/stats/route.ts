import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte, sql, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth().catch(() => null);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Default to current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const start = startDate || firstDayOfMonth;
    const end = endDate || lastDayOfMonth;

    // Get appointments by status
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

    // Get appointments by day of week
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

    // Get appointments by dentist
    const appointmentsByDentist = await db
      .select({
        dentistId: schema.appointments.dentistId,
        count: count(),
      })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end),
          sql`${schema.appointments.dentistId} IS NOT NULL`
        )
      )
      .groupBy(schema.appointments.dentistId);

    // Get appointments by hour
    const appointmentsByHour = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${schema.appointments.startTime})`,
        count: count(),
      })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      )
      .groupBy(sql`EXTRACT(HOUR FROM ${schema.appointments.startTime})`);

    // Get total counts
    const totalAppointments = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      );

    // Get today's appointments
    const today = now.toISOString().split('T')[0];
    const todayCount = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(eq(schema.appointments.appointmentDate, today));

    // Get upcoming appointments (next 7 days)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const upcomingCount = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, today),
          lte(schema.appointments.appointmentDate, nextWeek),
          sql`${schema.appointments.status} IN ('scheduled', 'confirmed')`
        )
      );

    // Get revenue (from treatments)
    const revenue = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${schema.treatments.actualCost} AS DECIMAL)), 0)`,
      })
      .from(schema.treatments)
      .where(
        and(
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end)
        )
      );

    // Get pending payments
    const pendingPayments = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${schema.invoices.totalAmount} - CAST(COALESCE(${schema.invoices.paidAmount}, '0') AS DECIMAL)) AS DECIMAL), 0)`,
      })
      .from(schema.invoices)
      .where(sql`${schema.invoices.status} IN ('pending', 'partial', 'overdue')`);

    // Get dentist names for the appointmentsByDentist stats
    const dentistNames = await db
      .select({
        id: schema.staff.id,
        name: schema.users.fullName,
      })
      .from(schema.staff)
      .innerJoin(schema.users, eq(schema.staff.userId, schema.users.id));

    // Map dentist IDs to names
    const dentistNameMap = new Map(dentistNames.map(d => [d.id, d.name]));
    const appointmentsByDentistWithName = appointmentsByDentist.map(item => ({
      ...item,
      name: (item.dentistId ? dentistNameMap.get(item.dentistId) : null) || 'Unknown',
    }));

    return NextResponse.json({
      period: { start, end },
      summary: {
        total: totalAppointments[0].count,
        today: todayCount[0].count,
        upcoming: upcomingCount[0].count,
        revenue: revenue[0].total,
        pendingPayments: pendingPayments[0].total,
      },
      byStatus: appointmentsByStatus,
      byDay: appointmentsByDay,
      byDentist: appointmentsByDentistWithName,
      byHour: appointmentsByHour,
    });
  } catch (error) {
    console.error('Get appointment stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment stats' },
      { status: 500 }
    );
  }
}
