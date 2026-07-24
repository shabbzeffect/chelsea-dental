import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import {
  sendAppointmentConfirmation,
  sendAppointmentCancellation,
  sendAppointmentRescheduled,
  sendAppointmentNoShow,
} from '@/lib/email';

const CLINIC_INFO = {
  clinicName: 'Chelsea Dental Clinic',
  clinicAddress: '123 Dental Avenue, Chelsea, London SW3 6NY',
  clinicPhone: '+44 20 1234 5678',
};

const createAppointmentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  dentistId: z.string().uuid().optional(),
  appointmentTypeId: z.string().uuid().optional(),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  notes: z.string().optional(),
  reason: z.string().optional(),
});

// Helper to get patient and dentist info
async function getAppointmentDetails(patientId: string, dentistId?: string) {
  const patient = await db.query.patients.findFirst({
    where: eq(schema.patients.id, patientId),
    with: { user: true },
  });

  let dentist = null;
  if (dentistId) {
    dentist = await db.query.staff.findFirst({
      where: eq(schema.staff.id, dentistId),
      with: { user: true },
    });
  }

  return { patient, dentist };
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth().catch(() => null);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || undefined;
    const dentistId = searchParams.get('dentistId') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const status = searchParams.get('status') || undefined;

    const conditions = [];

    if (patientId) {
      conditions.push(eq(schema.appointments.patientId, patientId));
    }
    if (dentistId) {
      conditions.push(eq(schema.appointments.dentistId, dentistId));
    }
    if (startDate) {
      conditions.push(gte(schema.appointments.appointmentDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(schema.appointments.appointmentDate, endDate));
    }
    if (status) {
      conditions.push(eq(schema.appointments.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const appointments = await db.query.appointments.findMany({
      where: whereClause,
      with: {
        patient: { with: { user: true } },
        dentist: { with: { user: true } },
      },
      orderBy: [
        sql`${schema.appointments.appointmentDate} ASC`,
        sql`${schema.appointments.startTime} ASC`,
      ],
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(['admin', 'dentist', 'receptionist']).catch(() => null);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAppointmentSchema.parse(body);

    // Check for scheduling conflicts
    if (validatedData.dentistId) {
      const conflicting = await db.query.appointments.findMany({
        where: and(
          eq(schema.appointments.dentistId, validatedData.dentistId),
          eq(schema.appointments.appointmentDate, validatedData.appointmentDate),
          eq(schema.appointments.status, 'scheduled'),
          sql`(${schema.appointments.startTime} < ${validatedData.endTime} AND ${schema.appointments.endTime} > ${validatedData.startTime})`
        ),
      });

      if (conflicting.length > 0) {
        return NextResponse.json(
          { error: 'Time slot is already booked for this dentist' },
          { status: 409 }
        );
      }
    }

    // Create appointment
    const [appointment] = await db.insert(schema.appointments).values({
      patientId: validatedData.patientId,
      dentistId: validatedData.dentistId,
      appointmentTypeId: validatedData.appointmentTypeId,
      appointmentDate: validatedData.appointmentDate,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      notes: validatedData.notes,
      reason: validatedData.reason,
    }).returning();

    // Get patient and dentist details for email
    const { patient, dentist } = await getAppointmentDetails(
      validatedData.patientId,
      validatedData.dentistId
    );

    // ✉️ Send confirmation email
    if (patient?.user?.email) {
      try {
        await sendAppointmentConfirmation({
          patientName: patient.user.fullName,
          patientEmail: patient.user.email,
          appointmentDate: validatedData.appointmentDate,
          startTime: validatedData.startTime,
          endTime: validatedData.endTime,
          dentistName: dentist?.user?.fullName,
          ...CLINIC_INFO,
        });
        console.log(`✅ Confirmation email sent to ${patient.user.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send confirmation email:', emailError);
      }
    }

    // Schedule reminder for 24 hours before appointment
    const appointmentDate = new Date(validatedData.appointmentDate);
    const [hours, minutes] = validatedData.startTime.split(':').map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);
    const reminderTime = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);

    if (reminderTime > new Date()) {
      await db.insert(schema.appointmentReminders).values({
        appointmentId: appointment.id,
        reminderType: 'email',
        scheduledTime: reminderTime,
        status: 'pending',
      });
    }

    return NextResponse.json({
      message: 'Appointment created successfully',
      appointment,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
