import sgMail from '@sendgrid/mail';

// Load env vars
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'wangarashabir@gmail.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  dentistName: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
}

async function sendConfirmation(data: AppointmentEmailData) {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0f766e; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; opacity: 0.9; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .success-badge { 
          display: inline-block; 
          background: #10b981; 
          color: white; 
          padding: 8px 16px; 
          border-radius: 20px; 
          font-weight: bold;
          margin-bottom: 20px;
        }
        .details-card { 
          background: white; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border: 1px solid #e5e7eb;
        }
        .details-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 12px 0; 
          border-bottom: 1px solid #f3f4f6; 
        }
        .details-row:last-child { border-bottom: none; }
        .details-label { font-weight: 600; color: #6b7280; }
        .details-value { color: #111827; font-weight: 500; }
        .checklist { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .checklist h3 { margin-top: 0; color: #374151; }
        .checklist li { padding: 5px 0; color: #4b5563; }
        .cta-button {
          display: inline-block;
          background: #0f766e;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 10px 0;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          color: #9ca3af; 
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🦷 ${data.clinicName}</h1>
          <p>Appointment Confirmation</p>
        </div>
        <div class="content">
          <div class="success-badge">✓ BOOKED</div>
          
          <p>Hello <strong>${data.patientName}</strong>,</p>
          <p>Your appointment has been successfully scheduled! Here are the details:</p>
          
          <div class="details-card">
            <div class="details-row">
              <span class="details-label">📅 Date</span>
              <span class="details-value">${formattedDate}</span>
            </div>
            <div class="details-row">
              <span class="details-label">🕐 Time</span>
              <span class="details-value">${formatTime(data.startTime)} - ${formatTime(data.endTime)}</span>
            </div>
            <div class="details-row">
              <span class="details-label">👨‍⚕️ Dentist</span>
              <span class="details-value">Dr. ${data.dentistName}</span>
            </div>
            <div class="details-row">
              <span class="details-label">📍 Location</span>
              <span class="details-value">${data.clinicAddress}</span>
            </div>
          </div>

          <div class="checklist">
            <h3>Before Your Appointment</h3>
            <ul>
              <li>✅ Arrive 10 minutes early</li>
              <li>✅ Bring your insurance card</li>
              <li>✅ Bring a valid photo ID</li>
              <li>✅ List any current medications</li>
            </ul>
          </div>

          <p><strong>Need to reschedule?</strong></p>
          <p>Please call us at least 24 hours before your appointment.</p>
          <p>📞 ${data.clinicPhone}</p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation from ${data.clinicName}</p>
          <p>You will receive a reminder 24 hours before your appointment</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sgMail.send({
    from: FROM_EMAIL,
    to: data.patientEmail,
    subject: `✅ Appointment Confirmed - ${formattedDate} at ${formatTime(data.startTime)}`,
    html,
  });
}

async function sendReminder(data: AppointmentEmailData) {
  const formattedDate = new Date(data.appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #fffbeb; padding: 30px; border: 1px solid #fcd34d; }
        .alert-box { 
          background: white; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #f59e0b;
        }
        .details-card { 
          background: white; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
        }
        .details-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 10px 0; 
          border-bottom: 1px solid #f3f4f6; 
        }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Appointment Reminder</h1>
          <p>${data.clinicName}</p>
        </div>
        <div class="content">
          <div class="alert-box">
            <strong>Tomorrow!</strong> You have an upcoming dental appointment.
          </div>
          
          <p>Hello <strong>${data.patientName}</strong>,</p>
          <p>This is a friendly reminder about your appointment <strong>tomorrow</strong>.</p>
          
          <div class="details-card">
            <div class="details-row">
              <span><strong>📅 Date:</strong></span>
              <span>${formattedDate}</span>
            </div>
            <div class="details-row">
              <span><strong>🕐 Time:</strong></span>
              <span>${formatTime(data.startTime)} - ${formatTime(data.endTime)}</span>
            </div>
            <div class="details-row">
              <span><strong>👨‍⚕️ Dentist:</strong></span>
              <span>Dr. ${data.dentistName}</span>
            </div>
          </div>

          <p><strong>Don't forget:</strong></p>
          <ul>
            <li>Bring your insurance card</li>
            <li>Bring a valid photo ID</li>
            <li>Arrive 10 minutes early</li>
          </ul>

          <p>📞 ${data.clinicPhone}</p>
        </div>
        <div class="footer">
          <p>Automated reminder from ${data.clinicName}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sgMail.send({
    from: FROM_EMAIL,
    to: data.patientEmail,
    subject: `⏰ Reminder: Appointment Tomorrow at ${formatTime(data.startTime)}`,
    html,
  });
}

async function createTestAppointment() {
  console.log('🦷 Creating Test Appointment...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Appointment details
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const appointmentDate = tomorrow.toISOString().split('T')[0];

  const appointment = {
    patientName: 'Wangara Shabir',
    patientEmail: 'wangarashabir@gmail.com',
    appointmentDate: appointmentDate,
    startTime: '10:00',
    endTime: '11:00',
    dentistName: 'Sarah Smith',
    clinicName: 'Chelsea Dental Clinic',
    clinicAddress: '123 Dental Avenue, Chelsea, London SW3 6NY',
    clinicPhone: '+44 20 1234 5678',
  };

  console.log('Appointment Details:');
  console.log(`  Patient: ${appointment.patientName}`);
  console.log(`  Email: ${appointment.patientEmail}`);
  console.log(`  Date: ${appointment.appointmentDate} (tomorrow)`);
  console.log(`  Time: ${appointment.startTime} - ${appointment.endTime}`);
  console.log(`  Dentist: Dr. ${appointment.dentistName}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Send confirmation email
    console.log('📤 Sending confirmation email...');
    await sendConfirmation(appointment);
    console.log('✅ Confirmation email sent!\n');

    // Send reminder email (simulating 24-hour reminder)
    console.log('📤 Sending reminder email (simulated)...');
    await sendReminder(appointment);
    console.log('✅ Reminder email sent!\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Test appointment created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Check your inbox at: wangarashabir@gmail.com');
    console.log('You should receive 2 emails:');
    console.log('  1. Appointment Confirmation');
    console.log('  2. Appointment Reminder');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error: any) {
    console.error('❌ Failed to create appointment:');
    if (error.response) {
      console.error('Status:', error.response.statusCode);
      console.error('Error:', error.response.body?.errors?.[0]?.message || error.response.body);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

createTestAppointment();
