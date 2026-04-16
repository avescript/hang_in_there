'use client';

import { useEffect, useRef, useState } from 'react';
import StoryCard from './StoryCard';
import { Story } from '@/lib/types/story';

interface StoryFeedProps {
  initialStories: Story[];
  dailyStory: Story | null;
  hasMore?: boolean;
}

export default function StoryFeed({ initialStories, dailyStory, hasMore: initialHasMore = false }: StoryFeedProps) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, loading, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/stories?page=${nextPage}&pageSize=10`);

      if (!res.ok) throw new Error('Failed to load stories');

      const data = await res.json();
      setStories((prev) => [...prev, ...data.stories]);
      setHasMore(data.pagination.page < data.pagination.pageCount);
      setPage(nextPage);
    } catch {
      setError('Could not load more stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Deduplicate: remove daily story from the feed list to avoid showing it twice
  const feedStories = dailyStory
    ? stories.filter((s) => s.id !== dailyStory.id)
    : stories;

  return (
    <div className="space-y-6">
      {/* Daily story pinned at top */}
      {dailyStory && (
        <section aria-label="Today's story">
          <StoryCard story={dailyStory} isPinned />
        </section>
      )}

      {/* Recent stories */}
      {feedStories.length > 0 && (
        <section aria-label="Recent stories">
          <div className="space-y-6">
            {feedStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}

      {/* No stories state */}
      {feedStories.length === 0 && !dailyStory && (
        <div className="text-center py-16 text-earth-500">
          <p className="text-lg">No stories yet. Check back soon.</p>
        </div>
      )}

      {/* Infinite scroll trigger / pagination fallback */}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-8">
          {loading ? (
            <div
              className="w-8 h-8 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"
              aria-label="Loading more stories"
              role="status"
            />
          ) : (
            <button
              onClick={loadMore}
              className="px-6 py-2 rounded-lg bg-cream-200 text-earth-800 hover:bg-cream-300 font-medium text-sm transition-colors"
            >
              Load more
            </button>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={loadMore}
            className="mt-2 text-primary-600 hover:underline text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
