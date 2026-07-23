/**
 * Test script for scheduled reports
 * Run with: npx tsx scripts/test-scheduled-reports.ts
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET || 'test-secret-123';

async function testEmailAPI(sessionToken: string) {
  console.log('\n1. Testing Email API...');
  
  const response = await fetch(`${BASE_URL}/api/reports/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `session_token=${sessionToken}`,
    },
    body: JSON.stringify({
      reportType: 'dashboard',
      recipients: ['test@example.com'],
      dateRange: {
        start: '2026-07-01',
        end: '2026-07-31',
      },
      message: 'Test email from scheduled reports script',
    }),
  });

  const data = await response.json();
  console.log('Response:', data);
  return data.success;
}

async function createScheduledReport(sessionToken: string) {
  console.log('\n2. Creating Scheduled Report...');
  
  const response = await fetch(`${BASE_URL}/api/reports/scheduled`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `session_token=${sessionToken}`,
    },
    body: JSON.stringify({
      reportType: 'dashboard',
      recipients: ['test@example.com'],
      frequency: 'daily',
      timeOfDay: '09:00',
      message: 'Test scheduled report',
    }),
  });

  const data = await response.json();
  console.log('Response:', data);
  return data;
}

async function listScheduledReports(sessionToken: string) {
  console.log('\n3. Listing Scheduled Reports...');
  
  const response = await fetch(`${BASE_URL}/api/reports/scheduled`, {
    headers: {
      'Cookie': `session_token=${sessionToken}`,
    },
  });

  const data = await response.json();
  console.log('Reports:', data);
  return data;
}

async function runCronJob() {
  console.log('\n4. Running Cron Job...');
  
  const response = await fetch(`${BASE_URL}/api/reports/cron`, {
    headers: {
      'Authorization': `Bearer ${CRON_SECRET}`,
    },
  });

  const data = await response.json();
  console.log('Response:', data);
  return data;
}

async function main() {
  const sessionToken = process.argv[2];
  
  if (!sessionToken) {
    console.log('Usage: npx tsx scripts/test-scheduled-reports.ts <session_token>');
    console.log('\nTo get your session token:');
    console.log('1. Log in to the app');
    console.log('2. Open DevTools (F12)');
    console.log('3. Go to Application > Cookies');
    console.log('4. Copy the session_token value');
    process.exit(1);
  }

  console.log('=== Testing Scheduled Reports ===');
  console.log(`Base URL: ${BASE_URL}`);
  
  try {
    // Test 1: Email API
    const emailSuccess = await testEmailAPI(sessionToken);
    if (!emailSuccess) {
      console.log('\n⚠️  Email API test failed. Check your email configuration.');
    }

    // Test 2: Create scheduled report
    const scheduledReport = await createScheduledReport(sessionToken);

    // Test 3: List scheduled reports
    const reports = await listScheduledReports(sessionToken);

    // Test 4: Run cron job
    const cronResult = await runCronJob();

    console.log('\n=== Test Summary ===');
    console.log(`Email API: ${emailSuccess ? '✓ Working' : '✗ Failed'}`);
    console.log(`Scheduled Report Created: ${scheduledReport.id ? '✓ Yes' : '✗ No'}`);
    console.log(`Reports in Database: ${reports.length}`);
    console.log(`Cron Job Processed: ${cronResult.processed || 0} reports`);
    
    if (cronResult.results?.some((r: any) => r.success)) {
      console.log('\n✓ Report email sent! Check your inbox.');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

main();
