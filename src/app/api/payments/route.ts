import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte } from 'drizzle-orm';

const createPaymentSchema = z.object({
  invoiceId: z.string().uuid().optional(),
  patientId: z.string().uuid('Invalid patient ID'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMethod: z.enum(['cash', 'card', 'check', 'insurance']),
  amount: z.string().min(1, 'Amount is required'),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin', 'receptionist']);

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || undefined;
    const invoiceId = searchParams.get('invoiceId') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const conditions = [];
    
    if (patientId) {
      conditions.push(eq(schema.payments.patientId, patientId));
    }
    if (invoiceId) {
      conditions.push(eq(schema.payments.invoiceId, invoiceId));
    }
    if (startDate) {
      conditions.push(gte(schema.payments.paymentDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(schema.payments.paymentDate, endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const payments = await db.query.payments.findMany({
      where: whereClause,
      with: {
        patient: true,
        invoice: true,
      },
      orderBy: (payments, { desc }) => [desc(payments.createdAt)],
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin', 'receptionist']);

    const body = await request.json();
    const validatedData = createPaymentSchema.parse(body);

    // Create payment
    const [payment] = await db.insert(schema.payments).values({
      invoiceId: validatedData.invoiceId,
      patientId: validatedData.patientId,
      paymentDate: validatedData.paymentDate,
      paymentMethod: validatedData.paymentMethod,
      amount: validatedData.amount,
      referenceNumber: validatedData.referenceNumber,
      notes: validatedData.notes,
    }).returning();

    // Update invoice if provided
    if (validatedData.invoiceId) {
      const invoice = await db.query.invoices.findFirst({
        where: eq(schema.invoices.id, validatedData.invoiceId),
      });

      if (invoice) {
        const currentPaid = parseFloat(invoice.paidAmount || '0');
        const paymentAmount = parseFloat(validatedData.amount);
        const newPaidAmount = currentPaid + paymentAmount;
        const totalAmount = parseFloat(invoice.totalAmount);
        
        let newStatus = 'partial';
        if (newPaidAmount >= totalAmount) {
          newStatus = 'paid';
        } else if (newPaidAmount > 0) {
          newStatus = 'partial';
        }

        await db.update(schema.invoices)
          .set({
            paidAmount: newPaidAmount.toString(),
            status: newStatus,
            updatedAt: new Date(),
          })
          .where(eq(schema.invoices.id, validatedData.invoiceId));
      }
    }

    return NextResponse.json({
      message: 'Payment recorded successfully',
      payment,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}
