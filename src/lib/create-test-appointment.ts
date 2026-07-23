import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

async function createTestAppointment() {
  // Get patient user ID
  const patientUser = await sql`SELECT id FROM users WHERE email = 'john.doe@email.com'`;
  if (patientUser.length === 0) {
    console.log('Patient user not found');
    return;
  }
  const userId = patientUser[0].id;

  // Get patient record
  const patient = await sql`SELECT id FROM patients WHERE user_id = ${userId}`;
  if (patient.length === 0) {
    console.log('Patient record not found');
    return;
  }
  const patientId = patient[0].id;

  // Get dentist staff ID (Dr. Sarah Smith)
  const dentist = await sql`SELECT id FROM staff WHERE position = 'dentist' LIMIT 1`;
  if (dentist.length === 0) {
    console.log('Dentist not found');
    return;
  }
  const dentistId = dentist[0].id;

  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const appointmentDate = tomorrow.toISOString().split('T')[0];

  console.log('Creating appointment...');
  console.log('Patient ID:', patientId);
  console.log('Dentist ID:', dentistId);
  console.log('Date:', appointmentDate);
  console.log('Time: 10:00 - 11:00\n');

  // Create appointment
  const appointment = await sql`
    INSERT INTO appointments (patient_id, dentist_id, appointment_date, start_time, end_time, status, reason)
    VALUES (${patientId}, ${dentistId}, ${appointmentDate}, '10:00', '11:00', 'scheduled', 'Routine check-up')
    RETURNING *
  `;

  console.log('✅ Appointment created successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Appointment ID:', appointment[0].id);
  console.log('Date:', appointment[0].appointment_date);
  console.log('Time:', appointment[0].start_time, '-', appointment[0].end_time);
  console.log('Status:', appointment[0].status);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Send confirmation email
  console.log('Sending confirmation email to patient...');
  const { sendAppointmentConfirmation } = await import('./email');

  // Get patient user email
  const patientUserInfo = await sql`SELECT email, full_name FROM users WHERE id = ${userId}`;

  if (patientUserInfo.length > 0 && patientUserInfo[0].email) {
    const success = await sendAppointmentConfirmation({
      patientName: patientUserInfo[0].full_name,
      patientEmail: patientUserInfo[0].email,
      appointmentDate: appointmentDate,
      startTime: '10:00',
      endTime: '11:00',
      dentistName: 'Sarah Smith',
      clinicName: 'Chelsea Dental Clinic',
      clinicAddress: '123 Dental Avenue, Chelsea, London SW3 6NY',
      clinicPhone: '+44 20 1234 5678',
    });

    if (success) {
      console.log('✅ Confirmation email sent to:', patientUserInfo[0].email);
    } else {
      console.log('❌ Failed to send confirmation email');
    }
  }

  await sql.end();
}

createTestAppointment().catch(console.error);
