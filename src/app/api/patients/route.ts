import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, like, sql, count, getTableColumns } from 'drizzle-orm';
import { generatePatientNumber } from '@/lib/utils';

const createPatientSchema = z.object({
  userId: z.string().uuid().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceId: z.string().optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin', 'dentist', 'receptionist']);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        sql`(${schema.patients.patientNumber} ILIKE ${searchTerm} OR ${schema.users.fullName} ILIKE ${searchTerm} OR ${schema.users.email} ILIKE ${searchTerm} OR ${schema.users.phone} ILIKE ${searchTerm})`
      );
    }

    if (status) {
      conditions.push(eq(schema.patients.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get patients with user data
    const patientsQuery = db
      .select({
        ...getTableColumns(schema.patients),
        user: schema.users,
      })
      .from(schema.patients)
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .where(whereClause)
      .orderBy(sql`${schema.patients.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    const patients = await patientsQuery;

    // Get total count
    const totalResult = await db.select({ count: count() })
      .from(schema.patients)
      .leftJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .where(whereClause);
    
    const total = totalResult[0].count;

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin', 'receptionist']);

    const body = await request.json();
    const validatedData = createPatientSchema.parse(body);

    // Generate unique patient number
    const patientNumber = generatePatientNumber();

    // Create patient
    const [patient] = await db.insert(schema.patients).values({
      ...validatedData,
      patientNumber,
    }).returning();

    return NextResponse.json({
      message: 'Patient created successfully',
      patient,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Create patient error:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
