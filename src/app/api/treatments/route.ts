import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || undefined;
    const dentistId = searchParams.get('dentistId') || undefined;
    const status = searchParams.get('status') || undefined;

    const conditions = [];

    if (patientId) {
      conditions.push(eq(schema.treatments.patientId, patientId));
    }
    if (dentistId) {
      conditions.push(eq(schema.treatments.dentistId, dentistId));
    }
    if (status) {
      conditions.push(eq(schema.treatments.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const treatments = await db.query.treatments.findMany({
      where: whereClause,
      with: {
        patient: { with: { user: true } },
        dentist: { with: { user: true } },
      },
      orderBy: (treatments, { desc }) => [desc(treatments.treatmentDate)],
    });

    return NextResponse.json({ treatments });
  } catch (error) {
    console.error('Get treatments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatments' },
      { status: 500 }
    );
  }
}
