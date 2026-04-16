import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { getStoryById } from '@/lib/strapi';
import { Story } from '@/lib/types/story';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const result = await query<{ story_id: string; saved_at: string }>(
      'SELECT story_id, saved_at FROM saved_stories WHERE user_id = $1 ORDER BY saved_at DESC',
      [user.id]
    );

    const stories: Story[] = [];
    for (const row of result.rows) {
      const res = await getStoryById(row.story_id);
      if (res.success) {
        stories.push(res.data);
      }
      // Skip stories that can't be fetched
    }

    return NextResponse.json({ stories, total: stories.length });
  } catch (err) {
    console.error('GET /api/user/saved error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
