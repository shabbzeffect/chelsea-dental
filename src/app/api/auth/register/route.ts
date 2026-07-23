import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPassword } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { generatePatientNumber } from '@/lib/utils';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, validatedData.email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user
    const [user] = await db.insert(schema.users).values({
      email: validatedData.email,
      passwordHash,
      fullName: validatedData.fullName,
      phone: validatedData.phone,
      role: 'patient',
    }).returning();

    // Create patient record
    const patientNumber = generatePatientNumber();
    await db.insert(schema.patients).values({
      userId: user.id,
      patientNumber,
      dateOfBirth: validatedData.dateOfBirth,
      gender: validatedData.gender,
    });

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
