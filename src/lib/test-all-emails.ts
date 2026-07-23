import sgMail from '@sendgrid/mail';
import { sendAppointmentConfirmation, sendAppointmentRescheduled, sendAppointmentCancellation, sendAppointmentNoShow } from './email';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const TEST_EMAIL = 'wangarashabir@gmail.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

const CLINIC_INFO = {
  clinicName: 'Chelsea Dental Clinic',
  clinicAddress: '123 Dental Avenue, Chelsea, London SW3 6NY',
  clinicPhone: '+44 20 1234 5678',
};

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAllScenarios() {
  console.log('🧪 Testing All Email Scenarios\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📧 Test email: ${TEST_EMAIL}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Calculate dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  // ═══════════════════════════════════════════════════════════════════════
  // SCENARIO 1: Create Appointment → Confirmation Email
  // ═══════════════════════════════════════════════════════════════════════
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📅 SCENARIO 1: Create Appointment');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Action: Patient books a new appointment');
  console.log('Email: Confirmation\n');

  await sendAppointmentConfirmation({
    patientName: 'John Doe',
    patientEmail: TEST_EMAIL,
    appointmentDate: tomorrowStr,
    startTime: '10:00',
    endTime: '11:00',
    dentistName: 'Sarah Smith',
    ...CLINIC_INFO,
  });
  console.log('✅ Confirmation email sent!\n');

  await delay(1000);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENARIO 2: Reschedule Appointment → Rescheduled Email
  // ═══════════════════════════════════════════════════════════════════════
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 SCENARIO 2: Reschedule Appointment');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Action: Receptionist reschedules to next week');
  console.log('Email: Rescheduled (shows old vs new)\n');

  await sendAppointmentRescheduled({
    patientName: 'John Doe',
    patientEmail: TEST_EMAIL,
    oldDate: tomorrowStr,
    oldStartTime: '10:00',
    newDate: nextWeekStr,
    newStartTime: '14:00',
    newEndTime: '15:00',
    dentistName: 'Sarah Smith',
    ...CLINIC_INFO,
  });
  console.log('✅ Rescheduled email sent!\n');

  await delay(1000);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENARIO 3: Cancel Appointment → Cancellation Email
  // ═══════════════════════════════════════════════════════════════════════
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('❌ SCENARIO 3: Cancel Appointment');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Action: Patient calls to cancel');
  console.log('Email: Cancellation\n');

  await sendAppointmentCancellation({
    patientName: 'John Doe',
    patientEmail: TEST_EMAIL,
    appointmentDate: nextWeekStr,
    startTime: '14:00',
    dentistName: 'Sarah Smith',
    ...CLINIC_INFO,
  });
  console.log('✅ Cancellation email sent!\n');

  await delay(1000);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENARIO 4: No-Show → No-Show Email
  // ═══════════════════════════════════════════════════════════════════════
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 SCENARIO 4: No-Show');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Action: Patient doesn\'t show up');
  console.log('Email: No-show with reschedule CTA\n');

  await sendAppointmentNoShow({
    patientName: 'John Doe',
    patientEmail: TEST_EMAIL,
    appointmentDate: tomorrowStr,
    startTime: '10:00',
    dentistName: 'Sarah Smith',
    ...CLINIC_INFO,
  });
  console.log('✅ No-show email sent!\n');

  // ═══════════════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════════════
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ ALL TESTS COMPLETE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Check your inbox at:', TEST_EMAIL);
  console.log('\nYou should receive 4 emails:');
  console.log('  1. 📅 Appointment Confirmation (Teal header)');
  console.log('  2. 🔄 Appointment Rescheduled (Purple header)');
  console.log('  3. ❌ Appointment Cancelled (Red header)');
  console.log('  4. 📋 Missed Appointment (Orange header)');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

testAllScenarios().catch(console.error);
