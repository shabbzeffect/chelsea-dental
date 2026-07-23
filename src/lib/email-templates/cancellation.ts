export function cancellationTemplate(data: {
  patientName: string;
  appointmentDate: string;
  startTime: string;
  clinicName: string;
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

  const subject = `❌ Appointment Cancelled - ${formattedDate} at ${formatTime(data.startTime)}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; opacity: 0.9; }
        .content { background: #fef2f2; padding: 30px; border: 1px solid #fecaca; }
        .cancel-badge { display: inline-block; background: #ef4444; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
        .details-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .cta-button { display: inline-block; background: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${data.clinicName}</h1>
          <p>Appointment Cancelled</p>
        </div>
        <div class="content">
          <div class="cancel-badge">✗ CANCELLED</div>
          
          <p>Hello <strong>${data.patientName}</strong>,</p>
          <p>Your appointment has been cancelled as requested.</p>
          
          <div class="details-card">
            <div class="details-row">
              <span><strong>📅 Date:</strong></span>
              <span>${formattedDate}</span>
            </div>
            <div class="details-row">
              <span><strong>🕐 Time:</strong></span>
              <span>${formatTime(data.startTime)}</span>
            </div>
          </div>

          <p><strong>Want to reschedule?</strong></p>
          <p>We'd be happy to book a new appointment for you.</p>
          
          ${data.clinicPhone ? `<p>📞 Call us: ${data.clinicPhone}</p>` : ''}
        </div>
        <div class="footer">
          <p>${data.clinicName}</p>
          <p>We hope to see you again soon!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
