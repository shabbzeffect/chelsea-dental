export function confirmationTemplate(data: {
  patientName: string;
  appointmentDate: string;
  startTime: string;
  endTime?: string;
  dentistName?: string;
  clinicName: string;
  clinicAddress?: string;
  clinicPhone?: string;
}) {
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

  const subject = `✅ Appointment Confirmed - ${formattedDate} at ${formatTime(data.startTime)}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0f766e; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; opacity: 0.9; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .success-badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
        .details-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .details-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
        .details-row:last-child { border-bottom: none; }
        .details-label { font-weight: 600; color: #6b7280; }
        .details-value { color: #111827; font-weight: 500; }
        .checklist { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .checklist h3 { margin-top: 0; color: #374151; }
        .checklist li { padding: 5px 0; color: #4b5563; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
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
              <span class="details-value">${formatTime(data.startTime)}${data.endTime ? ` - ${formatTime(data.endTime)}` : ''}</span>
            </div>
            ${data.dentistName ? `
            <div class="details-row">
              <span class="details-label">👨‍⚕️ Dentist</span>
              <span class="details-value">Dr. ${data.dentistName}</span>
            </div>
            ` : ''}
            ${data.clinicAddress ? `
            <div class="details-row">
              <span class="details-label">📍 Location</span>
              <span class="details-value">${data.clinicAddress}</span>
            </div>
            ` : ''}
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
          ${data.clinicPhone ? `<p>📞 ${data.clinicPhone}</p>` : ''}
        </div>
        <div class="footer">
          <p>This is an automated confirmation from ${data.clinicName}</p>
          <p>You will receive a reminder 24 hours before your appointment</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
