export function noShowTemplate(data: {
  patientName: string;
  appointmentDate: string;
  startTime: string;
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

  const subject = `Missed Appointment - ${formattedDate} at ${formatTime(data.startTime)}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f97316; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; opacity: 0.9; }
        .content { background: #fff7ed; padding: 30px; border: 1px solid #fed7aa; }
        .noshow-badge { display: inline-block; background: #f97316; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
        .alert-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
        .details-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .cta-button { display: inline-block; background: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 ${data.clinicName}</h1>
          <p>Missed Appointment</p>
        </div>
        <div class="content">
          <div class="noshow-badge">NO-SHOW</div>
          
          <p>Hello <strong>${data.patientName}</strong>,</p>
          
          <div class="alert-box">
            <strong>We missed you!</strong> You had an appointment scheduled but we didn't see you. We hope everything is okay.
          </div>
          
          <p><strong>Missed Appointment Details:</strong></p>
          <div class="details-card">
            <div class="details-row">
              <span><strong>📅 Date:</strong></span>
              <span>${formattedDate}</span>
            </div>
            <div class="details-row">
              <span><strong>🕐 Time:</strong></span>
              <span>${formatTime(data.startTime)}</span>
            </div>
            ${data.dentistName ? `
            <div class="details-row">
              <span><strong>👨‍⚕️ Dentist:</strong></span>
              <span>Dr. ${data.dentistName}</span>
            </div>
            ` : ''}
          </div>

          <p><strong>Would you like to reschedule?</strong></p>
          <p>We'd love to see you at the clinic. Please give us a call to book a new appointment.</p>
          
          ${data.clinicPhone ? `
          <p style="text-align: center;">
            <a href="tel:${data.clinicPhone}" class="cta-button">📞 Call to Reschedule</a>
          </p>
          <p style="text-align: center;">${data.clinicPhone}</p>
          ` : ''}

          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            <strong>Note:</strong> If you need to cancel an appointment, please let us know at least 24 hours in advance to avoid any fees.
          </p>
        </div>
        <div class="footer">
          <p>${data.clinicName}</p>
          <p>We hope to see you soon!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
