'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import StoryCard from '@/components/StoryCard';
import { Story } from '@/lib/types/story';

const THEMES = [
  { value: '', label: 'All Themes' },
  { value: 'grit', label: 'Grit' },
  { value: 'love', label: 'Love' },
  { value: 'community', label: 'Community' },
  { value: 'environment', label: 'Environment' },
  { value: 'balance', label: 'Balance' },
  { value: 'care', label: 'Care' },
];

const PAGE_SIZE = 20;

interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export default function ArchivePage() {
  return (
    <Suspense fallback={
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-earth-900 mb-6">Story Archive</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-lg border border-cream-200 p-6 animate-pulse" aria-hidden="true">
              <div className="h-4 bg-cream-200 rounded w-1/4 mb-3" />
              <div className="h-6 bg-cream-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-cream-200 rounded w-full" />
            </div>
          ))}
        </div>
      </main>
    }>
      <ArchiveContent />
    </Suspense>
  );
}

function ArchiveContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read filter state from URL
  const q = searchParams.get('q') ?? '';
  const theme = searchParams.get('theme') ?? '';
  const dateFrom = searchParams.get('dateFrom') ?? '';
  const dateTo = searchParams.get('dateTo') ?? '';
  const sort = searchParams.get('sort') ?? 'publishDate:desc';
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  // Local search input (separate from URL to support submit-on-enter)
  const [searchInput, setSearchInput] = useState(q);

  // Data state
  const [stories, setStories] = useState<Story[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Random story state
  const [randomStory, setRandomStory] = useState<Story | null>(null);
  const [randomLoading, setRandomLoading] = useState(false);

  // Sync search input when URL q param changes externally
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // Build updated URL params helper
  const buildParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const current = { q, theme, dateFrom, dateTo, sort, page: String(page) };
      const merged = { ...current, ...overrides };
      // Reset page on any filter change (unless explicitly overriding page)
      if (!('page' in overrides)) {
        merged.page = '1';
      }
      Object.entries(merged).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      return params.toString();
    },
    [q, theme, dateFrom, dateTo, sort, page]
  );

  const pushParams = useCallback(
    (overrides: Record<string, string>) => {
      router.push(`${pathname}?${buildParams(overrides)}`);
    },
    [router, pathname, buildParams]
  );

  // Fetch stories on filter/page change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(PAGE_SIZE));
    if (q) params.set('search', q);
    if (theme) params.set('theme', theme);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (sort) params.set('sort', sort);

    fetch(`/api/stories?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load stories');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setStories(data.stories ?? []);
        setPagination(data.pagination ?? null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q, theme, dateFrom, dateTo, sort, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushParams({ q: searchInput });
  };

  const handleRandom = async () => {
    setRandomLoading(true);
    try {
      const res = await fetch('/api/stories?random=true&pageSize=1');
      if (!res.ok) throw new Error('Failed to fetch random story');
      const data = await res.json();
      const story: Story = data.stories?.[0];
      if (story) {
        setRandomStory(story);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      // Silently fail — random story is a nice-to-have
    } finally {
      setRandomLoading(false);
    }
  };

  const from = pagination ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = pagination ? Math.min(page * PAGE_SIZE, pagination.total) : 0;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-earth-900 mb-6">Story Archive</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-cream-200 p-4 mb-6 space-y-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} role="search">
          <label htmlFor="archive-search" className="block text-sm font-medium text-earth-700 mb-1">
            Search stories
          </label>
          <div className="flex gap-2">
            <input
              id="archive-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by keyword…"
              className="flex-1 px-3 py-2 border border-cream-300 rounded-lg text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Row: theme + date range + sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Theme */}
          <div>
            <label htmlFor="theme-filter" className="block text-sm font-medium text-earth-700 mb-1">
              Theme
            </label>
            <select
              id="theme-filter"
              value={theme}
              onChange={(e) => pushParams({ theme: e.target.value })}
              className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm text-earth-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {THEMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort-select" className="block text-sm font-medium text-earth-700 mb-1">
              Sort
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => pushParams({ sort: e.target.value })}
              className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm text-earth-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="publishDate:desc">Newest First</option>
              <option value="publishDate:asc">Oldest First</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label htmlFor="date-from" className="block text-sm font-medium text-earth-700 mb-1">
              From
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => pushParams({ dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label htmlFor="date-to" className="block text-sm font-medium text-earth-700 mb-1">
              To
            </label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => pushParams({ dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Random Story button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleRandom}
            disabled={randomLoading}
            className="px-4 py-2 bg-earth-500 text-white rounded-lg text-sm font-medium hover:bg-earth-600 focus:outline-none focus:ring-2 focus:ring-earth-500 focus:ring-offset-2 transition-colors disabled:opacity-60"
          >
            {randomLoading ? 'Finding…' : '🎲 Random Story'}
          </button>
        </div>
      </div>

      {/* Random story highlight */}
      {randomStory && (
        <div className="mb-6">
          <p className="text-sm font-medium text-primary-600 mb-2">✨ Random pick for you</p>
          <StoryCard story={randomStory} />
        </div>
      )}

      {/* Result count */}
      {!loading && !error && pagination && pagination.total > 0 && (
        <p className="text-sm text-earth-600 mb-4">
          Showing {from}–{to} of {pagination.total} stories
        </p>
      )}

      {/* Content */}
      <div aria-busy={loading} aria-live="polite">
        {loading ? (
          <div className="space-y-4" aria-label="Loading stories">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-lg border border-cream-200 p-6 animate-pulse"
                aria-hidden="true"
              >
                <div className="h-4 bg-cream-200 rounded w-1/4 mb-3" />
                <div className="h-6 bg-cream-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-cream-200 rounded w-full mb-2" />
                <div className="h-4 bg-cream-200 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg border border-cream-200 p-8 text-center">
            <p className="text-earth-600">{error}</p>
            <button
              type="button"
              onClick={() => pushParams({})}
              className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            >
              Try again
            </button>
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-lg border border-cream-200 p-10 text-center">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-earth-700 font-medium">No stories found</p>
            <p className="text-earth-500 text-sm mt-1">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && pagination && pagination.pageCount > 1 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream-200">
          <button
            type="button"
            onClick={() => pushParams({ page: String(page - 1) })}
            disabled={page <= 1}
            className="px-4 py-2 bg-white border border-cream-300 rounded-lg text-sm font-medium text-earth-700 hover:bg-cream-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <span className="text-sm text-earth-600">
            Page {page} of {pagination.pageCount}
          </span>
          <button
            type="button"
            onClick={() => pushParams({ page: String(page + 1) })}
            disabled={page >= pagination.pageCount}
            className="px-4 py-2 bg-white border border-cream-300 rounded-lg text-sm font-medium text-earth-700 hover:bg-cream-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}
