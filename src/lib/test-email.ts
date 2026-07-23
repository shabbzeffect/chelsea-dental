import nodemailer from 'nodemailer';

async function testEmail() {
  console.log('Creating Ethereal test account...\n');

  // Create a test account on Ethereal
  const testAccount = await nodemailer.createTestAccount();

  console.log('Test account created!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SMTP credentials (for your .env file):');
  console.log(`  SMTP_HOST: "smtp.ethereal.email"`);
  console.log(`  SMTP_PORT: "587"`);
  console.log(`  SMTP_USER: "${testAccount.user}"`);
  console.log(`  SMTP_PASS: "${testAccount.pass}"`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Send test email
  console.log('Sending test email...');

  const info = await transporter.sendMail({
    from: '"Chelsea Dental Clinic" <test@chelseadental.com>',
    to: 'patient@example.com',
    subject: 'Appointment Reminder - Tomorrow at 10:00 AM',
    text: `Hello John Doe,

This is a friendly reminder about your upcoming dental appointment.

Date: Tomorrow
Time: 10:00 AM - 11:00 AM
Dentist: Dr. Sarah Smith
Location: 123 Dental Avenue, Chelsea, London SW3 6NY

Before Your Appointment:
- Please arrive 10 minutes early
- Bring your insurance card and ID
- If you need to reschedule, please call us at least 24 hours in advance

Phone: +44 20 1234 5678

This is an automated reminder from Chelsea Dental Clinic.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0f766e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .details-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .details-label { font-weight: bold; color: #6b7280; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Chelsea Dental Clinic</h1>
            <p>Appointment Reminder</p>
          </div>
          <div class="content">
            <p>Hello <strong>John Doe</strong>,</p>
            <p>This is a friendly reminder about your upcoming dental appointment.</p>
            
            <div class="details">
              <div class="details-row">
                <span class="details-label">Date:</span> Tomorrow
              </div>
              <div class="details-row">
                <span class="details-label">Time:</span> 10:00 AM - 11:00 AM
              </div>
              <div class="details-row">
                <span class="details-label">Dentist:</span> Dr. Sarah Smith
              </div>
              <div class="details-row">
                <span class="details-label">Location:</span> 123 Dental Avenue, Chelsea, London SW3 6NY
              </div>
            </div>

            <h3>Before Your Appointment:</h3>
            <ul>
              <li>Please arrive 10 minutes early</li>
              <li>Bring your insurance card and ID</li>
              <li>If you need to reschedule, please call us at least 24 hours in advance</li>
            </ul>

            <p><strong>Phone:</strong> +44 20 1234 5678</p>
          </div>
          <div class="footer">
            <p>This is an automated reminder from Chelsea Dental Clinic.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  console.log('Email sent successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Preview your email at:');
  console.log(`  ${nodemailer.getTestMessageUrl(info)}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testEmail().catch(console.error);
