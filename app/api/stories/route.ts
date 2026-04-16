import { NextRequest, NextResponse } from 'next/server';
import { getStories } from '@/lib/strapi';
import { StoryTheme } from '@/lib/types/story';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Handle random story request
  if (searchParams.get('random') === 'true') {
    const result = await getStories({
      page: 1,
      pageSize: 100,
      status: 'published',
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    const { stories } = result.data;
    if (stories.length === 0) {
      return NextResponse.json(
        { stories: [], pagination: { page: 1, pageSize: 1, pageCount: 0, total: 0 } }
      );
    }

    const randomIndex = Math.floor(Math.random() * stories.length);
    const picked = stories[randomIndex];

    return NextResponse.json({
      stories: [picked],
      pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
    });
  }

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '10', 10), 50);
  const theme = searchParams.get('theme') as StoryTheme | null;
  const search = searchParams.get('search') ?? undefined;
  const dateFrom = searchParams.get('dateFrom') ?? undefined;
  const dateTo = searchParams.get('dateTo') ?? undefined;
  const sort = (searchParams.get('sort') ?? 'publishDate:desc') as
    | 'publishDate:asc'
    | 'publishDate:desc';

  const result = await getStories({
    page,
    pageSize,
    status: 'published',
    ...(theme && { theme }),
    ...(search && { search }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
    sort,
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
