import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';

interface ReportEmailRequest {
  reportType: 'patient' | 'revenue' | 'appointments' | 'treatments' | 'dashboard';
  recipients: string[];
  dateRange: { start: string; end: string };
  message?: string;
}

function generateReportEmailHTML(
  reportType: string,
  dateRange: { start: string; end: string },
  message?: string
): string {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const reportTitles: Record<string, string> = {
    patient: 'Patient Report',
    revenue: 'Revenue Report',
    appointments: 'Appointment Report',
    treatments: 'Treatment Report',
    dashboard: 'Reports Dashboard',
  };

  const title = reportTitles[reportType] || 'Report';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #0d9488; margin: 0; font-size: 24px;">Chelsea Dental Clinic</h1>
      <p style="color: #666; margin: 5px 0 0 0;">${title}</p>
    </div>

    <div style="background-color: #f0fdfa; border-left: 4px solid #0d9488; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0; color: #334155;">
        <strong>Report Period:</strong> ${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}
      </p>
    </div>

    ${message ? `
    <div style="margin-bottom: 20px;">
      <p style="color: #334155; line-height: 1.6;">${message}</p>
    </div>
    ` : ''}

    <div style="margin-bottom: 20px;">
      <p style="color: #334155; line-height: 1.6;">
        A new ${title.toLowerCase()} has been generated for the period ${formatDate(dateRange.start)} to ${formatDate(dateRange.end)}.
      </p>
      <p style="color: #334155; line-height: 1.6;">
        Please log in to the dashboard to view the full report with charts and detailed analytics.
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/reports/${reportType === 'dashboard' ? 'dashboard' : reportType}" 
         style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
        View Report
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
      This is an automated report notification from Chelsea Dental Clinic Management System.
    </p>
  </div>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin', 'dentist', 'receptionist']);

    const body: ReportEmailRequest = await request.json();
    const { reportType, recipients, dateRange, message } = body;

    if (!reportType || !recipients || recipients.length === 0 || !dateRange) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get staff emails if 'all-staff' is selected
    let emailRecipients = recipients;
    if (recipients.includes('all-staff')) {
      const staff = await db
        .select({ email: schema.users.email })
        .from(schema.users)
        .where(eq(schema.users.role, 'dentist'));
      
      const receptionists = await db
        .select({ email: schema.users.email })
        .from(schema.users)
        .where(eq(schema.users.role, 'receptionist'));

      emailRecipients = [...staff, ...receptionists]
        .map(s => s.email)
        .filter((email): email is string => email !== null);
    }

    // Generate email HTML
    const html = generateReportEmailHTML(reportType, dateRange, message);

    const reportTitles: Record<string, string> = {
      patient: 'Patient Report',
      revenue: 'Revenue Report',
      appointments: 'Appointment Report',
      treatments: 'Treatment Report',
      dashboard: 'Reports Dashboard',
    };

    // Send emails
    const results = await Promise.allSettled(
      emailRecipients.map(async (email) => {
        // Import sendEmail function
        const { default: sgMail } = await import('@sendgrid/mail');
        const nodemailer = await import('nodemailer');

        if (process.env.SENDGRID_API_KEY) {
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          await sgMail.send({
            from: process.env.FROM_EMAIL || 'noreply@chelseadental.com',
            to: email,
            subject: `${reportTitles[reportType]} - Chelsea Dental Clinic`,
            html,
          });
        } else {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: `"Chelsea Dental Clinic" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to: email,
            subject: `${reportTitles[reportType]} - Chelsea Dental Clinic`,
            html,
          });
        }

        return email;
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: `Report emailed to ${successful} recipient(s)${failed > 0 ? ` (${failed} failed)` : ''}`,
      successful,
      failed,
    });
  } catch (error) {
    console.error('Send report email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
