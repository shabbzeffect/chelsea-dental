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

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const start = startDate || firstDayOfMonth.toISOString().split('T')[0];
    const end = endDate || lastDayOfMonth.toISOString().split('T')[0];

    // Total treatments (all time)
    const totalTreatments = await db
      .select({ count: count() })
      .from(schema.treatments);

    // Treatments in period
    const periodTreatments = await db
      .select({ count: count() })
      .from(schema.treatments)
      .where(
        and(
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end)
        )
      );

    // Total revenue from treatments (all time)
    const totalRevenue = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${schema.treatments.actualCost} AS DECIMAL)), 0)`,
      })
      .from(schema.treatments)
      .where(sql`${schema.treatments.actualCost} IS NOT NULL`);

    // Revenue in period
    const periodRevenue = await db
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

    // Average treatment cost in period
    const avgCost = await db
      .select({
        avg: sql<string>`COALESCE(AVG(CAST(${schema.treatments.actualCost} AS DECIMAL)), 0)`,
      })
      .from(schema.treatments)
      .where(
        and(
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end),
          sql`${schema.treatments.actualCost} IS NOT NULL`
        )
      );

    // Treatments by status in period
    const byStatus = await db
      .select({
        status: schema.treatments.status,
        count: count(),
      })
      .from(schema.treatments)
      .where(
        and(
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end)
        )
      )
      .groupBy(schema.treatments.status);

    // Top treatment types in period
    const byType = await db
      .select({
        description: schema.treatments.description,
        count: count(),
        totalRevenue: sql<string>`COALESCE(SUM(CAST(${schema.treatments.actualCost} AS DECIMAL)), 0)`,
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
      .limit(10);

    // Treatments by dentist in period
    const byDentist = await db
      .select({
        dentistId: schema.treatments.dentistId,
        count: count(),
        totalRevenue: sql<string>`COALESCE(SUM(CAST(${schema.treatments.actualCost} AS DECIMAL)), 0)`,
      })
      .from(schema.treatments)
      .where(
        and(
          sql`${schema.treatments.dentistId} IS NOT NULL`,
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end)
        )
      )
      .groupBy(schema.treatments.dentistId);

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

    // Treatments by month in period
    const byMonth = await db
      .select({
        month: sql<string>`TO_CHAR(${schema.treatments.treatmentDate}, 'YYYY-MM')`,
        count: count(),
        totalRevenue: sql<string>`COALESCE(SUM(CAST(${schema.treatments.actualCost} AS DECIMAL)), 0)`,
      })
      .from(schema.treatments)
      .where(
        and(
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end)
        )
      )
      .groupBy(sql`TO_CHAR(${schema.treatments.treatmentDate}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${schema.treatments.treatmentDate}, 'YYYY-MM')`);

    // Treatments with tooth numbers in period
    const byTooth = await db
      .select({
        toothNumbers: schema.treatments.toothNumbers,
      })
      .from(schema.treatments)
      .where(
        and(
          sql`${schema.treatments.toothNumbers} IS NOT NULL`,
          gte(schema.treatments.treatmentDate, start),
          lte(schema.treatments.treatmentDate, end)
        )
      );

    // Count treatments per tooth
    const toothCounts: Record<number, number> = {};
    byTooth.forEach((row) => {
      if (Array.isArray(row.toothNumbers)) {
        row.toothNumbers.forEach((tooth: number) => {
          toothCounts[tooth] = (toothCounts[tooth] || 0) + 1;
        });
      }
    });

    const topTeeth = Object.entries(toothCounts)
      .map(([tooth, count]) => ({ tooth: parseInt(tooth), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      dateRange: { start, end },
      summary: {
        total: totalTreatments[0].count,
        inPeriod: periodTreatments[0].count,
        totalRevenue: totalRevenue[0].total,
        periodRevenue: periodRevenue[0].total,
        avgCost: avgCost[0].avg,
      },
      byStatus,
      byType,
      byDentist: byDentistWithName,
      byMonth,
      topTeeth,
    });
  } catch (error) {
    console.error('Get treatments report error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatments report' },
      { status: 500 }
    );
  }
}
