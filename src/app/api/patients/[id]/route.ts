import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';

// GET - Fetch single patient
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin', 'dentist', 'receptionist']);

    const { id } = await context.params;

    const patient = await db
      .select({
        id: schema.patients.id,
        patientNumber: schema.patients.patientNumber,
        dateOfBirth: schema.patients.dateOfBirth,
        gender: schema.patients.gender,
        address: schema.patients.address,
        city: schema.patients.city,
        state: schema.patients.state,
        zip: schema.patients.zip,
        insuranceProvider: schema.patients.insuranceProvider,
        insuranceId: schema.patients.insuranceId,
        allergies: schema.patients.allergies,
        medicalConditions: schema.patients.medicalConditions,
        status: schema.patients.status,
        createdAt: schema.patients.createdAt,
        user: {
          id: schema.users.id,
          fullName: schema.users.fullName,
          email: schema.users.email,
          phone: schema.users.phone,
        },
      })
      .from(schema.patients)
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .where(eq(schema.patients.id, id))
      .limit(1);

    if (patient.length === 0) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ patient: patient[0] });
  } catch (error) {
    console.error('Get patient error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    );
  }
}

// PUT - Update patient
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['admin', 'dentist', 'receptionist']);

    const { id } = await context.params;
    const body = await request.json();

    // Check if patient exists
    const existing = await db
      .select({ id: schema.patients.id })
      .from(schema.patients)
      .where(eq(schema.patients.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Update patient
    const [updated] = await db
      .update(schema.patients)
      .set({
        dateOfBirth: body.dateOfBirth,
        gender: body.gender,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        insuranceProvider: body.insuranceProvider,
        insuranceId: body.insuranceId,
        allergies: body.allergies,
        medicalConditions: body.medicalConditions,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(schema.patients.id, id))
      .returning();

    return NextResponse.json({ patient: updated });
  } catch (error) {
    console.error('Update patient error:', error);
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    );
  }
}
