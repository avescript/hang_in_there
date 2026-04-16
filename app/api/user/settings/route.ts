import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

const VALID_THEMES = new Set(['grit', 'love', 'community', 'environment', 'balance', 'care']);
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const DEFAULT_SETTINGS = {
  notification_enabled: false,
  notification_time: '08:00',
  timezone: 'UTC',
  theme_filters: [] as string[],
  streak_visible: true,
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const result = await query(
      'SELECT notification_enabled, notification_time, timezone, theme_filters, streak_visible FROM user_settings WHERE user_id = $1',
      [user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    const row = result.rows[0];
    const rawTime: string = row.notification_time ?? '08:00';
    return NextResponse.json({
      notification_enabled: row.notification_enabled,
      notification_time: rawTime.length > 5 ? rawTime.slice(0, 5) : rawTime,
      timezone: row.timezone,
      theme_filters: row.theme_filters ?? [],
      streak_visible: row.streak_visible,
    });
  } catch (err) {
    console.error('GET /api/user/settings error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  // Validate fields
  if (typeof b.notification_enabled !== 'boolean') {
    return NextResponse.json({ error: 'notification_enabled must be a boolean' }, { status: 400 });
  }
  if (typeof b.notification_time !== 'string' || !TIME_REGEX.test(b.notification_time)) {
    return NextResponse.json({ error: 'notification_time must be HH:MM' }, { status: 400 });
  }
  if (typeof b.timezone !== 'string' || !b.timezone.trim()) {
    return NextResponse.json({ error: 'timezone must be a non-empty string' }, { status: 400 });
  }
  if (!Array.isArray(b.theme_filters) || !b.theme_filters.every((t) => VALID_THEMES.has(t as string))) {
    return NextResponse.json({ error: 'theme_filters must be an array of valid theme strings' }, { status: 400 });
  }
  if (typeof b.streak_visible !== 'boolean') {
    return NextResponse.json({ error: 'streak_visible must be a boolean' }, { status: 400 });
  }

  try {
    const result = await query(
      `INSERT INTO user_settings (user_id, notification_enabled, notification_time, timezone, theme_filters, streak_visible)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         notification_enabled = EXCLUDED.notification_enabled,
         notification_time = EXCLUDED.notification_time,
         timezone = EXCLUDED.timezone,
         theme_filters = EXCLUDED.theme_filters,
         streak_visible = EXCLUDED.streak_visible,
         updated_at = NOW()
       RETURNING notification_enabled, notification_time, timezone, theme_filters, streak_visible`,
      [
        user.id,
        b.notification_enabled,
        b.notification_time,
        b.timezone,
        b.theme_filters,
        b.streak_visible,
      ]
    );

    const row = result.rows[0];
    const rawTime: string = row.notification_time ?? '08:00';
    return NextResponse.json({
      notification_enabled: row.notification_enabled,
      notification_time: rawTime.length > 5 ? rawTime.slice(0, 5) : rawTime,
      timezone: row.timezone,
      theme_filters: row.theme_filters ?? [],
      streak_visible: row.streak_visible,
    });
  } catch (err) {
    console.error('PUT /api/user/settings error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
