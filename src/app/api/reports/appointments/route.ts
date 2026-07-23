import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte, sql, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    try {
      await requireRole(['admin', 'dentist', 'receptionist']);
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const dentistId = searchParams.get('dentistId');
    const patientId = searchParams.get('patientId');

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const start = startDate || firstDayOfMonth.toISOString().split('T')[0];
    const end = endDate || lastDayOfMonth.toISOString().split('T')[0];

    // Build base conditions
    const baseConditions = [
      gte(schema.appointments.appointmentDate, start),
      lte(schema.appointments.appointmentDate, end),
    ];

    // Add dentist filter if provided
    if (dentistId && dentistId !== 'all') {
      baseConditions.push(eq(schema.appointments.dentistId, dentistId));
    }

    // Add patient filter if provided
    if (patientId && patientId !== 'all') {
      baseConditions.push(eq(schema.appointments.patientId, patientId));
    }

    // Total appointments in period
    const periodAppointments = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(and(...baseConditions));

    // Completed appointments
    const completedAppointments = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(
        and(
          eq(schema.appointments.status, 'completed'),
          ...baseConditions
        )
      );

    // Canceled appointments
    const canceledAppointments = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(
        and(
          eq(schema.appointments.status, 'canceled'),
          ...baseConditions
        )
      );

    // No-show appointments
    const noShowAppointments = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(
        and(
          eq(schema.appointments.status, 'no_show'),
          ...baseConditions
        )
      );

    // Appointments by status
    const byStatus = await db
      .select({
        status: schema.appointments.status,
        count: count(),
      })
      .from(schema.appointments)
      .where(and(...baseConditions))
      .groupBy(schema.appointments.status);

    // Appointments by day of week
    const byDayOfWeek = await db
      .select({
        dayOfWeek: sql<number>`EXTRACT(DOW FROM ${schema.appointments.appointmentDate})`,
        count: count(),
      })
      .from(schema.appointments)
      .where(and(...baseConditions))
      .groupBy(sql`EXTRACT(DOW FROM ${schema.appointments.appointmentDate})`);

    // Appointments by hour
    const byHour = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${schema.appointments.startTime})`,
        count: count(),
      })
      .from(schema.appointments)
      .where(and(...baseConditions))
      .groupBy(sql`EXTRACT(HOUR FROM ${schema.appointments.startTime})`);

    // Appointments by dentist (only when not filtering by specific dentist)
    let byDentist: { dentistId: string | null; count: number }[] = [];
    if (!dentistId || dentistId === 'all') {
      byDentist = await db
        .select({
          dentistId: schema.appointments.dentistId,
          count: count(),
        })
        .from(schema.appointments)
        .where(
          and(
            ...baseConditions,
            sql`${schema.appointments.dentistId} IS NOT NULL`
          )
        )
        .groupBy(schema.appointments.dentistId);
    }

    // Get dentist names
    const dentistNames = await db
      .select({
        id: schema.staff.id,
        name: sql<string>`COALESCE(${schema.users.fullName}, 'Unknown')`,
      })
      .from(schema.staff)
      .leftJoin(schema.users, eq(schema.staff.userId, schema.users.id));

    const dentistNameMap = new Map(dentistNames.map(d => [d.id, d.name]));
    const byDentistWithName = byDentist.map(item => ({
      ...item,
      name: (item.dentistId ? dentistNameMap.get(item.dentistId) : null) || 'Unknown',
    }));

    // Appointments by month
    const byMonth = await db
      .select({
        month: sql<string>`TO_CHAR(${schema.appointments.appointmentDate}, 'YYYY-MM')`,
        count: count(),
      })
      .from(schema.appointments)
      .where(and(...baseConditions))
      .groupBy(sql`TO_CHAR(${schema.appointments.appointmentDate}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${schema.appointments.appointmentDate}, 'YYYY-MM')`);

    // Get list of patients who have appointments
    const patients = await db
      .select({
        id: schema.patients.id,
        name: sql<string>`COALESCE(${schema.users.fullName}, 'Unknown')`,
      })
      .from(schema.patients)
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .where(
        sql`${schema.patients.id} IN (SELECT DISTINCT patient_id FROM appointments WHERE appointment_date >= ${start} AND appointment_date <= ${end})`
      )
      .orderBy(sql`COALESCE(${schema.users.fullName}, 'Unknown')`);

    return NextResponse.json({
      dateRange: { start, end },
      selectedDentist: dentistId || 'all',
      selectedPatient: patientId || 'all',
      dentists: dentistNames,
      patients,
      summary: {
        total: periodAppointments[0].count,
        completed: completedAppointments[0].count,
        canceled: canceledAppointments[0].count,
        noShow: noShowAppointments[0].count,
      },
      byStatus,
      byDayOfWeek,
      byHour,
      byDentist: byDentistWithName,
      byMonth,
    });
  } catch (error) {
    console.error('Get appointments report error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch appointments report', details: errorMessage },
      { status: 500 }
    );
  }
}
