# Testing Scheduled Reports

## Quick Test Steps

### 1. Test the Email API First

Before testing scheduled reports, verify the email API works:

```bash
# Replace with your actual session cookie
curl -X POST http://localhost:3000/api/reports/send-email \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN" \
  -d '{
    "reportType": "dashboard",
    "recipients": ["test@example.com"],
    "dateRange": {
      "start": "2026-07-01",
      "end": "2026-07-31"
    },
    "message": "Test email from scheduled reports"
  }'
```

### 2. Test Creating a Scheduled Report

```bash
curl -X POST http://localhost:3000/api/reports/scheduled \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN" \
  -d '{
    "reportType": "dashboard",
    "recipients": ["all-staff"],
    "frequency": "daily",
    "timeOfDay": "09:00",
    "message": "Daily dashboard report"
  }'
```

### 3. Test the Cron Endpoint

```bash
# First, set CRON_SECRET in your .env.local
# Then test with:

curl -X GET http://localhost:3000/api/reports/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Step-by-Step Testing Guide

### Step 1: Start Your Development Server

```bash
npm run dev
```

### Step 2: Get Your Session Token

1. Log in to the app at http://localhost:3000
2. Open browser DevTools (F12)
3. Go to Application > Cookies
4. Copy the `session_token` value

### Step 3: Test Email Sending

Run this in your terminal (replace YOUR_SESSION_TOKEN):

```bash
curl -X POST http://localhost:3000/api/reports/send-email \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN" \
  -d '{
    "reportType": "dashboard",
    "recipients": ["your-email@example.com"],
    "dateRange": {
      "start": "2026-07-01",
      "end": "2026-07-31"
    },
    "message": "Test email"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Report emailed to 1 recipient(s)",
  "successful": 1,
  "failed": 0
}
```

### Step 4: Create a Test Scheduled Report

```bash
curl -X POST http://localhost:3000/api/reports/scheduled \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN" \
  -d '{
    "reportType": "dashboard",
    "recipients": ["your-email@example.com"],
    "frequency": "daily",
    "timeOfDay": "09:00",
    "message": "Test scheduled report"
  }'
```

### Step 5: Verify the Scheduled Report

```bash
curl -X GET http://localhost:3000/api/reports/scheduled \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN"
```

**Expected response:**
```json
[
  {
    "id": "...",
    "reportType": "dashboard",
    "recipients": ["your-email@example.com"],
    "frequency": "daily",
    "timeOfDay": "09:00",
    "isActive": true,
    "nextSendAt": "2026-07-24T09:00:00.000Z",
    ...
  }
]
```

### Step 6: Test the Cron Job

1. Add to your `.env.local`:
```
CRON_SECRET=test-secret-123
```

2. Run the cron endpoint:
```bash
curl -X GET http://localhost:3000/api/reports/cron \
  -H "Authorization: Bearer test-secret-123"
```

**Expected response (if report is due):**
```json
{
  "processed": 1,
  "results": [
    {
      "id": "...",
      "reportType": "dashboard",
      "success": true,
      "nextSendAt": "2026-07-25T09:00:00.000Z"
    }
  ]
}
```

## Testing via UI

### 1. Create a Schedule

1. Go to http://localhost:3000/admin/reports
2. Click "Scheduled Reports" button
3. Click "Add Schedule"
4. Configure:
   - Report Type: Dashboard
   - Frequency: Daily
   - Time: 09:00
   - Recipients: Add your email
5. Click "Create"

### 2. Test Immediately (Force Send)

To test without waiting, temporarily modify the cron endpoint to process reports regardless of `nextSendAt`:

```typescript
// In /api/reports/cron/route.ts, temporarily change the query:
const dueReports = await db
  .select()
  .from(schema.scheduledReports)
  .where(
    and(
      eq(schema.scheduledReports.isActive, true),
      // Remove this line for testing:
      // lte(schema.scheduledReports.nextSendAt, now)
    )
  );
```

Then call the cron endpoint:
```bash
curl -X GET http://localhost:3000/api/reports/cron \
  -H "Authorization: Bearer test-secret-123"
```

### 3. Check Your Email

You should receive an email with the report details and a link to view the full report.

## Monitoring Logs

Watch the server logs for email activity:

```bash
# In your terminal running npm run dev, you should see:
Email sent via SendGrid to test@example.com
# or
Email sent via SMTP to test@example.com
```

## Troubleshooting

### "Unauthorized" Error
- Make sure `CRON_SECRET` is set in `.env.local`
- Ensure you're passing the correct Authorization header

### Email Not Received
1. Check server logs for errors
2. Verify email configuration (SendGrid or SMTP)
3. Check spam/junk folder
4. Test with a simple email first

### Schedule Not Processing
1. Verify `isActive: true` in the database
2. Check `nextSendAt` is in the past
3. Ensure cron endpoint is being called

### Database Connection Issues
```bash
# Check if database is running
npx drizzle-kit studio
```

## Quick Test Script

Save this as `test-scheduled-reports.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
SESSION_TOKEN="YOUR_SESSION_TOKEN"
CRON_SECRET="test-secret-123"

echo "1. Testing email API..."
curl -s -X POST "$BASE_URL/api/reports/send-email" \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=$SESSION_TOKEN" \
  -d '{
    "reportType": "dashboard",
    "recipients": ["test@example.com"],
    "dateRange": {"start": "2026-07-01", "end": "2026-07-31"}
  }' | jq .

echo -e "\n2. Creating scheduled report..."
curl -s -X POST "$BASE_URL/api/reports/scheduled" \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=$SESSION_TOKEN" \
  -d '{
    "reportType": "dashboard",
    "recipients": ["test@example.com"],
    "frequency": "daily",
    "timeOfDay": "09:00"
  }' | jq .

echo -e "\n3. Listing scheduled reports..."
curl -s -X GET "$BASE_URL/api/reports/scheduled" \
  -H "Cookie: session_token=$SESSION_TOKEN" | jq .

echo -e "\n4. Running cron job..."
curl -s -X GET "$BASE_URL/api/reports/cron" \
  -H "Authorization: Bearer $CRON_SECRET" | jq .

echo -e "\nDone! Check your email for the report."
```

Make it executable:
```bash
chmod +x test-scheduled-reports.sh
./test-scheduled-reports.sh
```
