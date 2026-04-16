import { NextRequest, NextResponse } from 'next/server';
import { getStories } from '@/lib/strapi';
import { StoryTheme } from '@/lib/types/story';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '10', 10), 50);
  const theme = searchParams.get('theme') as StoryTheme | null;
  const search = searchParams.get('search') ?? undefined;
  const dateFrom = searchParams.get('dateFrom') ?? undefined;
  const dateTo = searchParams.get('dateTo') ?? undefined;

  const result = await getStories({
    page,
    pageSize,
    status: 'published',
    ...(theme && { theme }),
    ...(search && { search }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
    sort: 'publishDate:desc',
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  return NextResponse.json(result.data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}
