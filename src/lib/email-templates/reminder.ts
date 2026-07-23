export function reminderTemplate(data: {
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

  const subject = `⏰ Reminder: Appointment Tomorrow at ${formatTime(data.startTime)}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; opacity: 0.9; }
        .content { background: #fffbeb; padding: 30px; border: 1px solid #fcd34d; }
        .alert-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .details-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .checklist { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
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
              <span>${formatTime(data.startTime)}${data.endTime ? ` - ${formatTime(data.endTime)}` : ''}</span>
            </div>
            ${data.dentistName ? `
            <div class="details-row">
              <span><strong>👨‍⚕️ Dentist:</strong></span>
              <span>Dr. ${data.dentistName}</span>
            </div>
            ` : ''}
            ${data.clinicAddress ? `
            <div class="details-row">
              <span><strong>📍 Location:</strong></span>
              <span>${data.clinicAddress}</span>
            </div>
            ` : ''}
          </div>

          <div class="checklist">
            <h3>Don't Forget</h3>
            <ul>
              <li>✅ Bring your insurance card</li>
              <li>✅ Bring a valid photo ID</li>
              <li>✅ Arrive 10 minutes early</li>
            </ul>
          </div>

          ${data.clinicPhone ? `<p>📞 ${data.clinicPhone}</p>` : ''}
        </div>
        <div class="footer">
          <p>Automated reminder from ${data.clinicName}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
