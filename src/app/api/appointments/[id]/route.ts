import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, sql } from 'drizzle-orm';
import {
  sendAppointmentCancellation,
  sendAppointmentRescheduled,
  sendAppointmentNoShow,
} from '@/lib/email';

const CLINIC_INFO = {
  clinicName: 'Chelsea Dental Clinic',
  clinicAddress: '123 Dental Avenue, Chelsea, London SW3 6NY',
  clinicPhone: '+44 20 1234 5678',
};

const updateAppointmentSchema = z.object({
  dentistId: z.string().uuid().optional(),
  appointmentDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'canceled', 'no_show']).optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

// Helper to get patient user info
async function getPatientEmail(patientId: string) {
  const patient = await db.query.patients.findFirst({
    where: eq(schema.patients.id, patientId),
    with: { user: true },
  });
  return patient?.user;
}

// Helper to get dentist name
async function getDentistName(dentistId?: string) {
  if (!dentistId) return undefined;
  const dentist = await db.query.staff.findFirst({
    where: eq(schema.staff.id, dentistId),
    with: { user: true },
  });
  return dentist?.user?.fullName;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await requireAuth().catch(() => null);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await db.query.appointments.findFirst({
      where: eq(schema.appointments.id, id),
      with: {
        patient: true,
        dentist: true,
        appointmentType: true,
        reminders: true,
        treatments: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireRole(['admin', 'dentist', 'receptionist']);

    const body = await request.json();
    const validatedData = updateAppointmentSchema.parse(body);

    // Get current appointment before update
    const currentAppointment = await db.query.appointments.findFirst({
      where: eq(schema.appointments.id, id),
    });

    if (!currentAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check for conflicts if rescheduling
    if (validatedData.dentistId && validatedData.appointmentDate && validatedData.startTime && validatedData.endTime) {
      const conflicting = await db.query.appointments.findMany({
        where: (appointments, { and, eq, sql }) => and(
          eq(appointments.dentistId, validatedData.dentistId!),
          eq(appointments.appointmentDate, validatedData.appointmentDate!),
          eq(appointments.status, 'scheduled'),
          sql`(${appointments.id} != ${id})`,
          sql`(${appointments.startTime} < ${validatedData.endTime} AND ${appointments.endTime} > ${validatedData.startTime})`
        ),
      });

      if (conflicting.length > 0) {
        return NextResponse.json(
          { error: 'Time slot is already booked for this dentist' },
          { status: 409 }
        );
      }
    }

    const [updatedAppointment] = await db.update(schema.appointments)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(schema.appointments.id, id))
      .returning();

    // Get patient info for email
    const patientUser = await getPatientEmail(currentAppointment.patientId);
    const dentistName = await getDentistName(
      validatedData.dentistId || currentAppointment.dentistId || undefined
    );

    // ✉️ Send appropriate email based on status change
    if (patientUser?.email) {
      try {
        // Check if it's a reschedule (date or time changed)
        const isRescheduled =
          (validatedData.appointmentDate && validatedData.appointmentDate !== currentAppointment.appointmentDate) ||
          (validatedData.startTime && validatedData.startTime !== currentAppointment.startTime);

        if (isRescheduled && validatedData.appointmentDate && validatedData.startTime && validatedData.endTime) {
          // 🔄 Send rescheduled email
          await sendAppointmentRescheduled({
            patientName: patientUser.fullName,
            patientEmail: patientUser.email,
            oldDate: currentAppointment.appointmentDate,
            oldStartTime: currentAppointment.startTime,
            newDate: validatedData.appointmentDate,
            newStartTime: validatedData.startTime,
            newEndTime: validatedData.endTime,
            dentistName,
            ...CLINIC_INFO,
          });
          console.log(`✅ Rescheduled email sent to ${patientUser.email}`);
        }

        // Check if it's a cancellation
        if (validatedData.status === 'canceled') {
          // ❌ Send cancellation email
          await sendAppointmentCancellation({
            patientName: patientUser.fullName,
            patientEmail: patientUser.email,
            appointmentDate: currentAppointment.appointmentDate,
            startTime: currentAppointment.startTime,
            dentistName,
            ...CLINIC_INFO,
          });
          console.log(`✅ Cancellation email sent to ${patientUser.email}`);
        }

        // Check if it's a no-show
        if (validatedData.status === 'no_show') {
          // 📋 Send no-show email
          await sendAppointmentNoShow({
            patientName: patientUser.fullName,
            patientEmail: patientUser.email,
            appointmentDate: currentAppointment.appointmentDate,
            startTime: currentAppointment.startTime,
            dentistName,
            ...CLINIC_INFO,
          });
          console.log(`✅ No-show email sent to ${patientUser.email}`);
        }
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        // Don't fail the appointment update if email fails
      }
    }

    return NextResponse.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireRole(['admin', 'receptionist']);

    // Get current appointment before deleting
    const currentAppointment = await db.query.appointments.findFirst({
      where: eq(schema.appointments.id, id),
    });

    if (!currentAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Cancel appointment instead of deleting
    const [canceledAppointment] = await db.update(schema.appointments)
      .set({
        status: 'canceled',
        updatedAt: new Date()
      })
      .where(eq(schema.appointments.id, id))
      .returning();

    // Get patient info for email
    const patientUser = await getPatientEmail(currentAppointment.patientId);
    const dentistName = await getDentistName(currentAppointment.dentistId || undefined);

    // ❌ Send cancellation email
    if (patientUser?.email) {
      try {
        await sendAppointmentCancellation({
          patientName: patientUser.fullName,
          patientEmail: patientUser.email,
          appointmentDate: currentAppointment.appointmentDate,
          startTime: currentAppointment.startTime,
          dentistName,
          ...CLINIC_INFO,
        });
        console.log(`✅ Cancellation email sent to ${patientUser.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send cancellation email:', emailError);
      }
    }

    return NextResponse.json({
      message: 'Appointment canceled successfully',
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}
