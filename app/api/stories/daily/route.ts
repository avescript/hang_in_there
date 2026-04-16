import { NextRequest, NextResponse } from 'next/server';
import { getDailyStory } from '@/lib/strapi';

export async function GET(request: NextRequest) {
  // Resolve timezone from query param or Accept-Language header, default UTC
  const timezone = request.nextUrl.searchParams.get('timezone') ?? 'UTC';

  const result = await getDailyStory(timezone);

  if (!result.success) {
    const status = result.error.code === 'NO_DAILY_STORY' ? 404 : 503;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.data, {
    headers: {
      // Cache for 5 minutes — story changes at most once per day
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
}
