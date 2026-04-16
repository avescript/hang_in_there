import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
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

  const { storyId } = body as Record<string, unknown>;
  if (typeof storyId !== 'string' || !storyId.trim()) {
    return NextResponse.json({ error: 'storyId must be a non-empty string' }, { status: 400 });
  }

  try {
    // Record the story read (unique per user+story+date)
    await query(
      `INSERT INTO story_reads (user_id, story_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, story_id, DATE(read_at)) DO NOTHING`,
      [user.id, storyId]
    );

    // Get all distinct read dates ordered descending
    const datesResult = await query<{ read_date: string }>(
      `SELECT DISTINCT DATE(read_at)::text AS read_date
       FROM story_reads
       WHERE user_id = $1
       ORDER BY read_date DESC`,
      [user.id]
    );

    const dates = datesResult.rows.map((r) => r.read_date); // YYYY-MM-DD strings

    // Calculate current streak: consecutive days ending today or yesterday
    const today = new Date();
    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(new Date(today.getTime() - 86400000));

    let currentStreak = 0;
    if (dates.length > 0) {
      // Determine anchor: if today has a read, start from today; else from yesterday
      const anchor = dates[0] === todayStr ? todayStr : dates[0] === yesterdayStr ? yesterdayStr : null;
      if (anchor) {
        let expected = anchor;
        for (const d of dates) {
          if (d === expected) {
            currentStreak++;
            expected = formatDate(new Date(parseDate(expected).getTime() - 86400000));
          } else {
            break;
          }
        }
      }
    }

    // Calculate longest streak
    let longestStreak = currentStreak;
    let runLength = 0;
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        runLength = 1;
      } else {
        const prev = parseDate(dates[i - 1]);
        const curr = parseDate(dates[i]);
        const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
        if (diffDays === 1) {
          runLength++;
        } else {
          runLength = 1;
        }
      }
      if (runLength > longestStreak) longestStreak = runLength;
    }

    // Upsert reading_streaks
    await query(
      `INSERT INTO reading_streaks (user_id, current_streak, longest_streak, last_read_date)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         current_streak = EXCLUDED.current_streak,
         longest_streak = GREATEST(reading_streaks.longest_streak, EXCLUDED.longest_streak),
         last_read_date = EXCLUDED.last_read_date,
         updated_at = NOW()`,
      [user.id, currentStreak, longestStreak, todayStr]
    );

    return NextResponse.json({ currentStreak, longestStreak });
  } catch (err) {
    console.error('POST /api/user/read error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function formatDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
