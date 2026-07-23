import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte } from 'drizzle-orm';
import { sendAppointmentReminder } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin', 'receptionist']);

    const body = await request.json();
    const { appointmentId, sendNow } = body;

    let appointments;

    if (appointmentId) {
      // Send reminder for specific appointment
      const appointment = await db.query.appointments.findFirst({
        where: eq(schema.appointments.id, appointmentId),
        with: {
          patient: {
            with: { user: true },
          },
          dentist: {
            with: { user: true },
          },
        },
      });

      if (!appointment) {
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        );
      }

      appointments = [appointment];
    } else {
      // Send reminders for upcoming appointments (next 24-48 hours)
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dayAfterTomorrow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      const todayStr = now.toISOString().split('T')[0];
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const dayAfterStr = dayAfterTomorrow.toISOString().split('T')[0];

      appointments = await db.query.appointments.findMany({
        where: and(
          eq(schema.appointments.status, 'scheduled'),
          gte(schema.appointments.appointmentDate, todayStr),
          lte(schema.appointments.appointmentDate, dayAfterStr)
        ),
        with: {
          patient: {
            with: { user: true },
          },
          dentist: {
            with: { user: true },
          },
        },
      });
    }

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
    };

    for (const appointment of appointments) {
      // Check if reminder was already sent
      const existingReminder = await db.query.appointmentReminders.findFirst({
        where: (reminders, { and, eq }) => and(
          eq(reminders.appointmentId, appointment.id),
          eq(reminders.reminderType, 'email'),
          eq(reminders.status, 'sent')
        ),
      });

      if (existingReminder && !sendNow) {
        results.skipped++;
        continue;
      }

      // Get patient email
      const patientUser = appointment.patient?.user;
      if (!patientUser?.email) {
        results.failed++;
        continue;
      }

      // Send reminder
      const clinicName = 'Chelsea Dental Clinic';
      const success = await sendAppointmentReminder({
        patientName: patientUser.fullName,
        patientEmail: patientUser.email,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        dentistName: appointment.dentist?.user?.fullName,
        clinicName,
        clinicAddress: '123 Dental Avenue, Chelsea, London SW3 6NY',
        clinicPhone: '+44 20 1234 5678',
      });

      // Record reminder
      await db.insert(schema.appointmentReminders).values({
        appointmentId: appointment.id,
        reminderType: 'email',
        scheduledTime: new Date(),
        sentAt: success ? new Date() : null,
        status: success ? 'sent' : 'failed',
      });

      if (success) {
        results.sent++;
      } else {
        results.failed++;
      }
    }

    return NextResponse.json({
      message: 'Reminders processed',
      results,
    });
  } catch (error) {
    console.error('Send reminders error:', error);
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    );
  }
}

// GET - Check reminder status
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID required' },
        { status: 400 }
      );
    }

    const reminders = await db.query.appointmentReminders.findMany({
      where: eq(schema.appointmentReminders.appointmentId, appointmentId),
      orderBy: (reminders, { desc }) => [desc(reminders.scheduledTime)],
    });

    return NextResponse.json({ reminders });
  } catch (error) {
    console.error('Get reminders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    );
  }
}
