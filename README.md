# Chelsea Dental Clinic Management System

A comprehensive dental clinic management system built with Next.js 16, PostgreSQL, and Drizzle ORM.

## Features

- **User Authentication**: Role-based access control (Admin, Dentist, Receptionist, Patient)
- **Patient Management**: Complete patient profiles with medical history
- **Appointment Scheduling**: Calendar-based booking with conflict detection
- **Treatment Records**: Dental-specific documentation with tooth mapping
- **Billing & Payments**: Invoice generation, payment processing, insurance claims
- **Staff Management**: Staff profiles, schedules, and certifications
- **Dashboard Analytics**: Role-specific dashboards with key metrics

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with bcrypt password hashing

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chelsea-dental
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Set up the database:
```bash
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Test Accounts

After running the seed script, you can login with:

- **Admin**: admin@chelseadental.com / admin123
- **Dentist**: dr.smith@chelseadental.com / dentist123
- **Receptionist**: reception@chelseadental.com / receptionist123
- **Patient**: john.doe@email.com / patient123

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Dashboard pages by role
│   └── api/             # API routes
├── components/          # React components
├── db/                  # Database schema and migrations
├── lib/                 # Utility functions and helpers
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient
- `PUT /api/patients/:id` - Update patient

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment
- `PUT /api/appointments/:id` - Update appointment

### Treatments
- `GET /api/treatments` - List treatments
- `POST /api/treatments` - Create treatment

### Billing
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/payments` - List payments
- `POST /api/payments` - Record payment

### Staff
- `GET /api/staff` - List staff
- `POST /api/staff` - Create staff member

### Dashboard
- `GET /api/dashboard` - Get dashboard stats

## License

This project is licensed under the MIT License.
