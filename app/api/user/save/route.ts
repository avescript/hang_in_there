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

  const { storyId, action } = body as Record<string, unknown>;

  if (typeof storyId !== 'string' || !storyId.trim()) {
    return NextResponse.json({ error: 'storyId must be a non-empty string' }, { status: 400 });
  }
  if (action !== 'save' && action !== 'unsave') {
    return NextResponse.json({ error: 'action must be "save" or "unsave"' }, { status: 400 });
  }

  try {
    if (action === 'save') {
      await query(
        'INSERT INTO saved_stories (user_id, story_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [user.id, storyId]
      );
      return NextResponse.json({ saved: true });
    } else {
      await query('DELETE FROM saved_stories WHERE user_id = $1 AND story_id = $2', [
        user.id,
        storyId,
      ]);
      return NextResponse.json({ saved: false });
    }
  } catch (err) {
    console.error('POST /api/user/save error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
