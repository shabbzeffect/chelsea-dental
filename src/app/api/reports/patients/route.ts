import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte, sql, count, desc } from 'drizzle-orm';

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

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const start = startDate || firstDayOfMonth.toISOString().split('T')[0];
    const end = endDate || lastDayOfMonth.toISOString().split('T')[0];

    // Total patients
    const totalPatients = await db
      .select({ count: count() })
      .from(schema.patients);

    // New patients in period
    const newInPeriod = await db
      .select({ count: count() })
      .from(schema.patients)
      .where(gte(schema.patients.createdAt, new Date(start + 'T00:00:00')));

    // Active patients (with appointments in period)
    const activePatients = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${schema.appointments.patientId})` })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      );

    // Average visits per patient in period
    const periodAppointments = await db
      .select({ count: count() })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      );
    const avgVisits = totalPatients[0].count > 0
      ? periodAppointments[0].count / totalPatients[0].count
      : 0;

    // Age demographics (all patients)
    const allPatients = await db
      .select({
        dateOfBirth: schema.patients.dateOfBirth,
      })
      .from(schema.patients)
      .where(sql`${schema.patients.dateOfBirth} IS NOT NULL`);

    const ageGroupCounts: Record<string, number> = {
      'Under 18': 0,
      '18-29': 0,
      '30-39': 0,
      '40-49': 0,
      '50-59': 0,
      '60+': 0,
    };

    const today = new Date();
    allPatients.forEach((p) => {
      if (!p.dateOfBirth) return;
      const birthDate = new Date(p.dateOfBirth);
      const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) ageGroupCounts['Under 18']++;
      else if (age < 30) ageGroupCounts['18-29']++;
      else if (age < 40) ageGroupCounts['30-39']++;
      else if (age < 50) ageGroupCounts['40-49']++;
      else if (age < 60) ageGroupCounts['50-59']++;
      else ageGroupCounts['60+']++;
    });

    const ageGroups = Object.entries(ageGroupCounts).map(([group, count]) => ({ group, count }));

    // Gender breakdown (all patients)
    const genderBreakdown = await db
      .select({
        gender: sql<string>`COALESCE(${schema.patients.gender}, 'Unknown')`,
        count: count(),
      })
      .from(schema.patients)
      .groupBy(schema.patients.gender);

    // Visit frequency distribution in period
    const visitFrequency = await db
      .select({
        patientId: schema.appointments.patientId,
        visitCount: count(),
      })
      .from(schema.appointments)
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      )
      .groupBy(schema.appointments.patientId);

    const frequencyBuckets = [
      { min: 1, max: 1, label: '1 visit' },
      { min: 2, max: 3, label: '2-3 visits' },
      { min: 4, max: 6, label: '4-6 visits' },
      { min: 7, max: 10, label: '7-10 visits' },
      { min: 11, max: Infinity, label: '11+ visits' },
    ];

    const visitFrequencyDistribution = frequencyBuckets.map((bucket) => ({
      frequency: bucket.label,
      patientCount: visitFrequency.filter(
        (v) => v.visitCount >= bucket.min && v.visitCount <= bucket.max
      ).length,
    }));

    // Recent patients in period (last 10)
    const recentPatients = await db
      .select({
        id: schema.patients.id,
        firstName: schema.users.fullName,
        lastName: sql<string>`''`,
        lastVisit: sql<string>`MAX(${schema.appointments.appointmentDate})`,
        totalVisits: count(),
      })
      .from(schema.patients)
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .leftJoin(schema.appointments, eq(schema.patients.id, schema.appointments.patientId))
      .where(
        and(
          gte(schema.appointments.appointmentDate, start),
          lte(schema.appointments.appointmentDate, end)
        )
      )
      .groupBy(schema.patients.id, schema.users.fullName)
      .orderBy(desc(sql`MAX(${schema.appointments.appointmentDate})`))
      .limit(10);

    return NextResponse.json({
      dateRange: { start, end },
      summary: {
        totalPatients: totalPatients[0].count,
        newInPeriod: newInPeriod[0].count,
        activePatients: activePatients[0].count,
        avgVisitsPerPatient: avgVisits,
      },
      demographics: {
        ageGroups,
        genderBreakdown,
      },
      visitFrequency: visitFrequencyDistribution,
      recentPatients,
    });
  } catch (error) {
    console.error('Get patient report error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch patient report', details: errorMessage },
      { status: 500 }
    );
  }
}
