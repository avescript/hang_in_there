import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const result = await query<{
      current_streak: number;
      longest_streak: number;
      last_read_date: string | null;
    }>('SELECT current_streak, longest_streak, last_read_date FROM reading_streaks WHERE user_id = $1', [
      user.id,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ currentStreak: 0, longestStreak: 0, lastReadDate: null });
    }

    const row = result.rows[0];
    return NextResponse.json({
      currentStreak: row.current_streak,
      longestStreak: row.longest_streak,
      lastReadDate: row.last_read_date,
    });
  } catch (err) {
    console.error('GET /api/user/streak error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
