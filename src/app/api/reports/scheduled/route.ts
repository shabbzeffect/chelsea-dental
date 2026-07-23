import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte, asc } from 'drizzle-orm';

function calculateNextSendAt(frequency: string, timeOfDay: string, dayOfWeek?: number | null, dayOfMonth?: number | null): Date {
  const now = new Date();
  const [hours, minutes] = timeOfDay.split(':').map(Number);
  
  let nextSend = new Date(now);
  nextSend.setHours(hours, minutes, 0, 0);

  switch (frequency) {
    case 'daily':
      if (nextSend <= now) {
        nextSend.setDate(nextSend.getDate() + 1);
      }
      break;

    case 'weekly':
      if (dayOfWeek === null || dayOfWeek === undefined) {
        dayOfWeek = 1; // Default to Monday
      }
      const currentDay = nextSend.getDay();
      let daysUntilTarget = dayOfWeek - currentDay;
      if (daysUntilTarget < 0 || (daysUntilTarget === 0 && nextSend <= now)) {
        daysUntilTarget += 7;
      }
      nextSend.setDate(nextSend.getDate() + daysUntilTarget);
      break;

    case 'monthly':
      if (dayOfMonth === null || dayOfMonth === undefined) {
        dayOfMonth = 1; // Default to 1st
      }
      nextSend.setDate(dayOfMonth);
      if (nextSend <= now) {
        nextSend.setMonth(nextSend.getMonth() + 1);
        nextSend.setDate(dayOfMonth);
      }
      break;
  }

  return nextSend;
}

// GET - List all scheduled reports
export async function GET() {
  try {
    await requireRole(['admin', 'dentist', 'receptionist']);

    const reports = await db
      .select()
      .from(schema.scheduledReports)
      .orderBy(asc(schema.scheduledReports.createdAt));

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Get scheduled reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled reports' },
      { status: 500 }
    );
  }
}

// POST - Create a new scheduled report
export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(['admin']);
    const user = session.user as any;
    const body = await request.json();

    const { reportType, recipients, frequency, dayOfWeek, dayOfMonth, timeOfDay, message } = body;

    if (!reportType || !recipients || !frequency || !timeOfDay) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const nextSendAt = calculateNextSendAt(frequency, timeOfDay || '09:00', dayOfWeek, dayOfMonth);

    const [scheduledReport] = await db.insert(schema.scheduledReports).values({
      reportType,
      recipients,
      frequency,
      dayOfWeek,
      dayOfMonth,
      timeOfDay: timeOfDay || '09:00',
      message,
      isActive: true,
      nextSendAt,
      createdBy: user?.id,
    }).returning();

    return NextResponse.json(scheduledReport, { status: 201 });
  } catch (error) {
    console.error('Create scheduled report error:', error);
    return NextResponse.json(
      { error: 'Failed to create scheduled report' },
      { status: 500 }
    );
  }
}

// PUT - Update a scheduled report
export async function PUT(request: NextRequest) {
  try {
    await requireRole(['admin']);
    const body = await request.json();

    const { id, reportType, recipients, frequency, dayOfWeek, dayOfMonth, timeOfDay, message, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing report ID' },
        { status: 400 }
      );
    }

    const nextSendAt = isActive ? calculateNextSendAt(frequency || 'weekly', timeOfDay || '09:00', dayOfWeek, dayOfMonth) : null;

    const [updated] = await db.update(schema.scheduledReports)
      .set({
        reportType,
        recipients,
        frequency,
        dayOfWeek,
        dayOfMonth,
        timeOfDay,
        message,
        isActive,
        nextSendAt,
        updatedAt: new Date(),
      })
      .where(eq(schema.scheduledReports.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update scheduled report error:', error);
    return NextResponse.json(
      { error: 'Failed to update scheduled report' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a scheduled report
export async function DELETE(request: NextRequest) {
  try {
    await requireRole(['admin']);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing report ID' },
        { status: 400 }
      );
    }

    await db.delete(schema.scheduledReports)
      .where(eq(schema.scheduledReports.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete scheduled report error:', error);
    return NextResponse.json(
      { error: 'Failed to delete scheduled report' },
      { status: 500 }
    );
  }
}
