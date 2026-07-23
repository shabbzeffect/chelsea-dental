import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';

const SETTINGS_KEY = 'clinic_settings';

interface Settings {
  emailNotifications: boolean;
  autoConfirmAppointments: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
}

const defaultSettings: Settings = {
  emailNotifications: true,
  autoConfirmAppointments: false,
  smsNotifications: false,
  darkMode: false,
};

// GET - Fetch settings
export async function GET() {
  try {
    await requireRole(['admin']);

    const setting = await db
      .select()
      .from(schema.clinicSettings)
      .where(eq(schema.clinicSettings.key, SETTINGS_KEY))
      .limit(1);

    let settings = defaultSettings;

    if (setting.length > 0 && setting[0].value) {
      try {
        settings = JSON.parse(setting[0].value);
      } catch {
        settings = defaultSettings;
      }
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole(['admin']);
    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings data is required' },
        { status: 400 }
      );
    }

    const existingSetting = await db
      .select()
      .from(schema.clinicSettings)
      .where(eq(schema.clinicSettings.key, SETTINGS_KEY))
      .limit(1);

    if (existingSetting.length > 0) {
      await db
        .update(schema.clinicSettings)
        .set({
          value: JSON.stringify(settings),
          updatedAt: new Date(),
        })
        .where(eq(schema.clinicSettings.key, SETTINGS_KEY));
    } else {
      await db.insert(schema.clinicSettings).values({
        key: SETTINGS_KEY,
        value: JSON.stringify(settings),
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
