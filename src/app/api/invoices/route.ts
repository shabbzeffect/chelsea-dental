import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq, and, gte, lte } from 'drizzle-orm';
import { generateInvoiceNumber } from '@/lib/utils';

const createInvoiceSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    treatmentId: z.string().uuid().optional(),
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1).default(1),
    unitPrice: z.string().min(1, 'Unit price is required'),
  })).min(1, 'At least one item is required'),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin', 'receptionist']);

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || undefined;
    const status = searchParams.get('status') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const conditions = [];
    
    if (patientId) {
      conditions.push(eq(schema.invoices.patientId, patientId));
    }
    if (status) {
      conditions.push(eq(schema.invoices.status, status));
    }
    if (startDate) {
      conditions.push(gte(schema.invoices.invoiceDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(schema.invoices.invoiceDate, endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const invoices = await db.query.invoices.findMany({
      where: whereClause,
      with: {
        patient: { with: { user: true } },
      },
      orderBy: (invoices, { desc }) => [desc(invoices.createdAt)],
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin', 'receptionist']);

    const body = await request.json();
    const validatedData = createInvoiceSchema.parse(body);

    // Calculate total amount
    let totalAmount = 0;
    const itemsWithTotal = validatedData.items.map(item => {
      const quantity = item.quantity || 1;
      const unitPrice = parseFloat(item.unitPrice);
      const totalPrice = quantity * unitPrice;
      totalAmount += totalPrice;
      return {
        ...item,
        quantity,
        unitPrice: item.unitPrice,
        totalPrice: totalPrice.toString(),
      };
    });

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();

    // Create invoice
    const [invoice] = await db.insert(schema.invoices).values({
      patientId: validatedData.patientId,
      invoiceNumber,
      invoiceDate: validatedData.invoiceDate,
      dueDate: validatedData.dueDate,
      totalAmount: totalAmount.toString(),
      notes: validatedData.notes,
    }).returning();

    // Create invoice items
    for (const item of itemsWithTotal) {
      await db.insert(schema.invoiceItems).values({
        invoiceId: invoice.id,
        treatmentId: item.treatmentId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      });
    }

    return NextResponse.json({
      message: 'Invoice created successfully',
      invoice: {
        ...invoice,
        items: itemsWithTotal,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
