import sgMail from '@sendgrid/mail';

// Load env vars
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@chelseadental.com';

if (!SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY is not set in .env');
  process.exit(1);
}

sgMail.setApiKey(SENDGRID_API_KEY);

async function testSendGrid() {
  console.log('🧪 Testing SendGrid email delivery...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`API Key: ${SENDGRID_API_KEY.substring(0, 10)}...`);
  console.log(`From: ${FROM_EMAIL}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const testEmail = {
    to: FROM_EMAIL, // Send to yourself for testing
    from: FROM_EMAIL,
    subject: ' Chelsea Dental - Test Email from SendGrid',
    text: 'This is a test email from Chelsea Dental Clinic management system.',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0f766e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .success { color: #10b981; font-size: 24px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Chelsea Dental Clinic</h1>
            <p>SendGrid Integration Test</p>
          </div>
          <div class="content">
            <p class="success">✓ Email sent successfully via SendGrid!</p>
            <p>This is a test email to verify that your SendGrid integration is working correctly.</p>
            <p><strong>Configuration:</strong></p>
            <ul>
              <li>Provider: SendGrid</li>
              <li>From: ${FROM_EMAIL}</li>
              <li>Status: Active</li>
            </ul>
            <p>You will receive appointment confirmations and reminders from this email address.</p>
          </div>
          <div class="footer">
            <p>Chelsea Dental Clinic Management System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(testEmail);
    console.log('✅ Test email sent successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Check your inbox at:', FROM_EMAIL);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error: any) {
    console.error('❌ Failed to send email:\n');
    if (error.response) {
      console.error('Status:', error.response.statusCode);
      console.error('Body:', JSON.stringify(error.response.body, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testSendGrid();
