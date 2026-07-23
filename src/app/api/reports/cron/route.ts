import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { eq, and, lte, gte } from 'drizzle-orm';

// This endpoint should be called by an external cron service (e.g., Vercel Cron, GitHub Actions, or a simple cron job)
// It checks for scheduled reports that are due and sends them

async function sendReportEmail(
  reportType: string,
  recipients: string[],
  dateRange: { start: string; end: string },
  message?: string
): Promise<boolean> {
  try {
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/reports/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportType,
        recipients,
        dateRange,
        message,
      }),
    });

    return emailResponse.ok;
  } catch (error) {
    console.error('Failed to send report email:', error);
    return false;
  }
}

function getDateRange(frequency: string): { start: string; end: string } {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (frequency) {
    case 'daily':
      start = new Date(now);
      start.setDate(start.getDate() - 1);
      end = new Date(now);
      break;

    case 'weekly':
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      end = new Date(now);
      break;

    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      break;

    default:
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      end = new Date(now);
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

function calculateNextSendAt(frequency: string, timeOfDay: string, dayOfWeek?: number | null, dayOfMonth?: number | null): Date {
  const now = new Date();
  const [hours, minutes] = timeOfDay.split(':').map(Number);
  
  let nextSend = new Date(now);
  nextSend.setHours(hours, minutes, 0, 0);

  switch (frequency) {
    case 'daily':
      nextSend.setDate(nextSend.getDate() + 1);
      break;

    case 'weekly':
      if (dayOfWeek === null || dayOfWeek === undefined) {
        dayOfWeek = 1;
      }
      const currentDay = nextSend.getDay();
      let daysUntilTarget = dayOfWeek - currentDay;
      if (daysUntilTarget <= 0) {
        daysUntilTarget += 7;
      }
      nextSend.setDate(nextSend.getDate() + daysUntilTarget);
      break;

    case 'monthly':
      if (dayOfMonth === null || dayOfMonth === undefined) {
        dayOfMonth = 1;
      }
      nextSend.setMonth(nextSend.getMonth() + 1);
      nextSend.setDate(dayOfMonth);
      break;
  }

  return nextSend;
}

// GET - Process scheduled reports (called by cron)
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find all active scheduled reports that are due
    const dueReports = await db
      .select()
      .from(schema.scheduledReports)
      .where(
        and(
          eq(schema.scheduledReports.isActive, true),
          lte(schema.scheduledReports.nextSendAt, now)
        )
      );

    const results = [];

    for (const report of dueReports) {
      const dateRange = getDateRange(report.frequency);
      const recipients = report.recipients as string[];

      // Send the report
      const success = await sendReportEmail(
        report.reportType,
        recipients,
        dateRange,
        report.message || undefined
      );

      // Update the report with last sent time and next send time
      const nextSendAt = calculateNextSendAt(
        report.frequency,
        report.timeOfDay || '09:00',
        report.dayOfWeek,
        report.dayOfMonth
      );

      await db.update(schema.scheduledReports)
        .set({
          lastSentAt: now,
          nextSendAt,
          updatedAt: now,
        })
        .where(eq(schema.scheduledReports.id, report.id));

      results.push({
        id: report.id,
        reportType: report.reportType,
        success,
        nextSendAt,
      });
    }

    return NextResponse.json({
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to process scheduled reports' },
      { status: 500 }
    );
  }
}
