import { db, schema } from './index';
import { hashPassword } from '../lib/auth';
import { generatePatientNumber, generateStaffNumber } from '../lib/utils';

async function seed() {
  console.log('Seeding database...');

  try {
    // Create admin user
    const adminPasswordHash = await hashPassword('admin123');
    const [adminUser] = await db.insert(schema.users).values({
      email: 'admin@chelseadental.com',
      passwordHash: adminPasswordHash,
      fullName: 'Admin User',
      phone: '+44 20 1234 5678',
      role: 'admin',
    }).returning();

    // Create dentist user
    const dentistPasswordHash = await hashPassword('dentist123');
    const [dentistUser] = await db.insert(schema.users).values({
      email: 'dr.smith@chelseadental.com',
      passwordHash: dentistPasswordHash,
      fullName: 'Dr. Sarah Smith',
      phone: '+44 20 1234 5679',
      role: 'dentist',
    }).returning();

    // Create dentist staff record
    const [dentistStaff] = await db.insert(schema.staff).values({
      userId: dentistUser.id,
      staffNumber: generateStaffNumber(),
      position: 'dentist',
      specialization: 'General Dentistry',
      licenseNumber: 'GDC-123456',
      startDate: '2020-01-15',
      phone: '+44 20 1234 5679',
      email: 'dr.smith@chelseadental.com',
    }).returning();

    // Create receptionist user
    const receptionistPasswordHash = await hashPassword('receptionist123');
    const [receptionistUser] = await db.insert(schema.users).values({
      email: 'reception@chelseadental.com',
      passwordHash: receptionistPasswordHash,
      fullName: 'Emma Johnson',
      phone: '+44 20 1234 5680',
      role: 'receptionist',
    }).returning();

    // Create receptionist staff record
    await db.insert(schema.staff).values({
      userId: receptionistUser.id,
      staffNumber: generateStaffNumber(),
      position: 'receptionist',
      startDate: '2021-06-01',
      phone: '+44 20 1234 5680',
      email: 'reception@chelseadental.com',
    }).returning();

    // Create patient users
    const patient1PasswordHash = await hashPassword('patient123');
    const [patient1User] = await db.insert(schema.users).values({
      email: 'john.doe@email.com',
      passwordHash: patient1PasswordHash,
      fullName: 'John Doe',
      phone: '+44 7700 900001',
      role: 'patient',
    }).returning();

    // Create patient records
    await db.insert(schema.patients).values({
      userId: patient1User.id,
      patientNumber: generatePatientNumber(),
      dateOfBirth: '1985-05-15',
      gender: 'male',
      address: '123 Main Street',
      city: 'London',
      state: 'England',
      zip: 'SW1A 1AA',
      insuranceProvider: 'Dental Care Plus',
      insuranceId: 'DCP-789012',
      allergies: 'Penicillin',
      medicalConditions: 'None',
    });

    // Create appointment types
    await db.insert(schema.appointmentTypes).values([
      { name: 'Consultation', durationMinutes: 30, description: 'Initial consultation', color: '#3B82F6' },
      { name: 'Check-up', durationMinutes: 20, description: 'Routine dental check-up', color: '#10B981' },
      { name: 'Cleaning', durationMinutes: 45, description: 'Professional teeth cleaning', color: '#8B5CF6' },
      { name: 'Filling', durationMinutes: 60, description: 'Dental filling procedure', color: '#F59E0B' },
      { name: 'Root Canal', durationMinutes: 90, description: 'Root canal treatment', color: '#EF4444' },
      { name: 'Crown', durationMinutes: 60, description: 'Crown placement', color: '#EC4899' },
      { name: 'Extraction', durationMinutes: 45, description: 'Tooth extraction', color: '#6366F1' },
    ]);

    // Create clinic settings
    await db.insert(schema.clinicSettings).values([
      { key: 'clinic_name', value: 'Chelsea Dental Clinic' },
      { key: 'clinic_address', value: '123 Dental Avenue, Chelsea, London SW3 6NY' },
      { key: 'clinic_phone', value: '+44 20 1234 5678' },
      { key: 'clinic_email', value: 'info@chelseadental.com' },
      { key: 'clinic_hours_weekday', value: '9:00 AM - 6:00 PM' },
      { key: 'clinic_hours_saturday', value: '9:00 AM - 2:00 PM' },
      { key: 'clinic_hours_sunday', value: 'Closed' },
      { key: 'appointment_buffer_minutes', value: '15' },
      { key: 'cancellation_policy_hours', value: '24' },
      { key: 'tax_rate', value: '20' },
    ]);

    // Create staff schedule for dentist
    const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
    for (const day of daysOfWeek) {
      await db.insert(schema.staffSchedule).values({
        staffId: dentistStaff.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
        breakStart: '13:00',
        breakEnd: '14:00',
      });
    }

    // Saturday morning
    await db.insert(schema.staffSchedule).values({
      staffId: dentistStaff.id,
      dayOfWeek: 6,
      startTime: '09:00',
      endTime: '14:00',
      breakStart: '11:30',
      breakEnd: '12:00',
    });

    console.log('Database seeded successfully!');
    console.log('\nTest accounts:');
    console.log('Admin: admin@chelseadental.com / admin123');
    console.log('Dentist: dr.smith@chelseadental.com / dentist123');
    console.log('Receptionist: reception@chelseadental.com / receptionist123');
    console.log('Patient: john.doe@email.com / patient123');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

seed()
  .catch(console.error)
  .finally(() => process.exit());
