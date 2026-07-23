export function rescheduledTemplate(data: {
  patientName: string;
  oldDate: string;
  oldStartTime: string;
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  dentistName?: string;
  clinicName: string;
  clinicAddress?: string;
  clinicPhone?: string;
}) {
  const formatDateTime = (date: string, time: string) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const [h, m] = time.split(':').map(Number);
    const formattedTime = `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
    return { date: formattedDate, time: formattedTime };
  };

  const old = formatDateTime(data.oldDate, data.oldStartTime);
  const new_ = formatDateTime(data.newDate, data.newStartTime);
  const newEnd = formatDateTime(data.newDate, data.newEndTime);

  const subject = `🔄 Appointment Rescheduled - Now on ${new_.date} at ${new_.time}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6366f1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; opacity: 0.9; }
        .content { background: #f5f3ff; padding: 30px; border: 1px solid #c4b5fd; }
        .rescheduled-badge { display: inline-block; background: #6366f1; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
        .change-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .change-row { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
        .change-row:last-child { border-bottom: none; }
        .old-value { color: #ef4444; text-decoration: line-through; }
        .arrow { color: #6366f1; margin: 0 12px; font-weight: bold; }
        .new-value { color: #10b981; font-weight: 600; }
        .details-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .details-label { font-weight: 600; color: #6b7280; }
        .details-value { color: #111827; font-weight: 500; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔄 ${data.clinicName}</h1>
          <p>Appointment Rescheduled</p>
        </div>
        <div class="content">
          <div class="rescheduled-badge">RESCHEDULED</div>
          
          <p>Hello <strong>${data.patientName}</strong>,</p>
          <p>Your appointment has been rescheduled. Here are the changes:</p>
          
          <div class="change-card">
            <div class="change-row">
              <div>
                <div style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">FROM</div>
                <div class="old-value">${old.date} at ${old.time}</div>
              </div>
              <span class="arrow">→</span>
              <div>
                <div style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">TO</div>
                <div class="new-value">${new_.date} at ${new_.time}</div>
              </div>
            </div>
          </div>

          <p><strong>New Appointment Details:</strong></p>
          <div class="details-card">
            <div class="details-row">
              <span class="details-label">📅 Date</span>
              <span class="details-value">${new_.date}</span>
            </div>
            <div class="details-row">
              <span class="details-label">🕐 Time</span>
              <span class="details-value">${new_.time} - ${newEnd.time}</span>
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

          <p><strong>Need to make more changes?</strong></p>
          <p>Please call us at least 24 hours before your appointment.</p>
          ${data.clinicPhone ? `<p>📞 ${data.clinicPhone}</p>` : ''}
        </div>
        <div class="footer">
          <p>This is an automated notification from ${data.clinicName}</p>
          <p>You will receive a reminder 24 hours before your appointment</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
