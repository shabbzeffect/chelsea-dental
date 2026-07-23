import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, like, sql, count } from 'drizzle-orm';
import { generateStaffNumber } from '@/lib/utils';
import { hashPassword } from '@/lib/auth';

const createStaffSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  position: z.enum(['dentist', 'hygienist', 'receptionist', 'admin']),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
  startDate: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin']);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const position = searchParams.get('position') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const conditions = [];
    
    if (search) {
      conditions.push(
        sql`(${schema.staff.staffNumber} ILIKE ${'%' + search + '%'})`
      );
    }

    if (position) {
      conditions.push(eq(schema.staff.position, position));
    }

    if (status) {
      conditions.push(eq(schema.staff.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const staffMembers = await db.query.staff.findMany({
      where: whereClause,
      with: {
        user: true,
      },
      orderBy: (staff, { asc }) => [asc(staff.staffNumber)],
      limit,
      offset,
    });

    const totalResult = await db.select({ count: count() })
      .from(schema.staff)
      .where(whereClause);
    
    const total = totalResult[0].count;

    return NextResponse.json({
      staff: staffMembers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get staff error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin']);

    const body = await request.json();
    const validatedData = createStaffSchema.parse(body);

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

    // Create user account
    const passwordHash = await hashPassword(validatedData.password);
    const [user] = await db.insert(schema.users).values({
      email: validatedData.email,
      passwordHash,
      fullName: validatedData.fullName,
      phone: validatedData.phone,
      role: validatedData.position === 'admin' ? 'admin' : 
            validatedData.position === 'dentist' ? 'dentist' : 'receptionist',
    }).returning();

    // Create staff record
    const staffNumber = generateStaffNumber();
    const [staffMember] = await db.insert(schema.staff).values({
      userId: user.id,
      staffNumber,
      position: validatedData.position,
      specialization: validatedData.specialization,
      licenseNumber: validatedData.licenseNumber,
      licenseExpiry: validatedData.licenseExpiry,
      startDate: validatedData.startDate,
    }).returning();

    return NextResponse.json({
      message: 'Staff member created successfully',
      staff: staffMember,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Create staff error:', error);
    return NextResponse.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    );
  }
}
