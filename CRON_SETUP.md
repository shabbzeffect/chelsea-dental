# Scheduled Reports - Cron Setup Guide

This document explains how to set up the cron job to automatically send scheduled reports.

## Option 1: Vercel Cron Jobs (Recommended for Vercel deployments)

Add this to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/reports/cron",
      "schedule": "0 * * * *"
    }
  ]
}
```

This runs every hour and checks for due reports.

## Option 2: External Cron Service

Use any cron service (e.g., cron-job.org, EasyCron, GitHub Actions) to call:

```
GET https://your-domain.com/api/reports/cron
Authorization: Bearer YOUR_CRON_SECRET
```

Set the `CRON_SECRET` environment variable to a secure random string.

## Option 3: GitHub Actions

Create `.github/workflows/scheduled-reports.yml`:

```yaml
name: Scheduled Reports

on:
  schedule:
    - cron: '0 * * * *'  # Every hour

jobs:
  send-reports:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger scheduled reports
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.com/api/reports/cron
```

## Environment Variables

Add these to your `.env.local`:

```env
CRON_SECRET=your-secret-random-string-here
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## How It Works

1. The cron job runs every hour
2. It checks for active scheduled reports where `nextSendAt` <= current time
3. For each due report, it:
   - Calculates the appropriate date range based on frequency
   - Sends the report email to all recipients
   - Updates `lastSentAt` and calculates the next `nextSendAt`
4. Reports are automatically rescheduled for their next occurrence

## Frequency Options

- **Daily**: Sends every day at the specified time
- **Weekly**: Sends on the specified day of week at the specified time
- **Monthly**: Sends on the specified day of month at the specified time

## Notes

- The cron endpoint requires authentication via the `CRON_SECRET` header
- Only admin users can create, edit, or delete scheduled reports
- Reports automatically reschedule after each send
- You can pause/resume scheduled reports from the UI
