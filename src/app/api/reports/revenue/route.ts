import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte, sql, count, inArray } from 'drizzle-orm';

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

    // Total revenue (all time)
    const totalRevenue = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${schema.payments.amount} AS DECIMAL)), 0)`,
      })
      .from(schema.payments)
      .where(eq(schema.payments.status, 'completed'));

    // Revenue in period
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

    // Pending payments (outstanding invoices)
    const pendingPayments = await db
      .select({
        total: sql<string>`COALESCE(SUM(
          CAST(${schema.invoices.totalAmount} AS DECIMAL) - CAST(COALESCE(${schema.invoices.paidAmount}, '0') AS DECIMAL)
        ), 0)`,
      })
      .from(schema.invoices)
      .where(inArray(schema.invoices.status, ['pending', 'partial', 'overdue']));

    // Overdue payments
    const overduePayments = await db
      .select({
        total: sql<string>`COALESCE(SUM(
          CAST(${schema.invoices.totalAmount} AS DECIMAL) - CAST(COALESCE(${schema.invoices.paidAmount}, '0') AS DECIMAL)
        ), 0)`,
      })
      .from(schema.invoices)
      .where(eq(schema.invoices.status, 'overdue'));

    // Revenue by month (using period range, expand to show full months)
    const revenueByMonth = await db
      .select({
        month: sql<string>`TO_CHAR(${schema.payments.paymentDate}, 'YYYY-MM')`,
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
      .groupBy(sql`TO_CHAR(${schema.payments.paymentDate}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${schema.payments.paymentDate}, 'YYYY-MM')`);

    // Revenue by payment method in period
    const revenueByMethod = await db
      .select({
        method: schema.payments.paymentMethod,
        total: sql<string>`COALESCE(SUM(CAST(${schema.payments.amount} AS DECIMAL)), 0)`,
        count: count(),
      })
      .from(schema.payments)
      .where(
        and(
          eq(schema.payments.status, 'completed'),
          gte(schema.payments.paymentDate, start),
          lte(schema.payments.paymentDate, end)
        )
      )
      .groupBy(schema.payments.paymentMethod);

    // Revenue by dentist in period
    const revenueByDentist = await db
      .select({
        dentistId: schema.treatments.dentistId,
        total: sql<string>`COALESCE(SUM(CAST(${schema.treatments.actualCost} AS DECIMAL)), 0)`,
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
    const revenueByDentistWithName = revenueByDentist.map(item => ({
      ...item,
      name: (item.dentistId ? dentistNameMap.get(item.dentistId) : null) || 'Unknown',
    }));

    // Invoice status breakdown in period
    const invoiceStatusBreakdown = await db
      .select({
        status: schema.invoices.status,
        count: count(),
        total: sql<string>`COALESCE(SUM(CAST(${schema.invoices.totalAmount} AS DECIMAL)), 0)`,
      })
      .from(schema.invoices)
      .where(
        and(
          gte(schema.invoices.invoiceDate, start),
          lte(schema.invoices.invoiceDate, end)
        )
      )
      .groupBy(schema.invoices.status);

    return NextResponse.json({
      dateRange: { start, end },
      summary: {
        totalRevenue: totalRevenue[0].total,
        periodRevenue: periodRevenue[0].total,
        pendingPayments: pendingPayments[0].total,
        overduePayments: overduePayments[0].total,
      },
      revenueByMonth,
      revenueByMethod,
      revenueByDentist: revenueByDentistWithName,
      invoiceStatusBreakdown,
    });
  } catch (error) {
    console.error('Get revenue report error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue report' },
      { status: 500 }
    );
  }
}
