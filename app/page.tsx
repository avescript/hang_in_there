import StoryFeed from '@/components/StoryFeed';
import { getDailyStory, getStories } from '@/lib/strapi';

export default async function Home() {
  // Fetch daily story and initial feed in parallel
  const [dailyResult, feedResult] = await Promise.all([
    getDailyStory('UTC'),
    getStories({ page: 1, pageSize: 10, status: 'published', sort: 'publishDate:desc' }),
  ]);

  const dailyStory = dailyResult.success ? dailyResult.data : null;
  const initialStories = feedResult.success ? feedResult.data.stories : [];
  const hasMore = feedResult.success
    ? feedResult.data.pagination.page < feedResult.data.pagination.pageCount
    : false;

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-cream-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-700 leading-tight">Hang In There</h1>
            <p className="text-sm text-earth-500 italic">Daily stories of grit, grace &amp; human connection</p>
          </div>
        </div>
      </header>

      {/* Story feed */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {!dailyStory && initialStories.length === 0 ? (
          <div className="text-center py-24 text-earth-400">
            <p className="text-xl font-medium">No stories today.</p>
            <p className="text-sm mt-2">Check back soon — something inspiring is on its way.</p>
          </div>
        ) : (
          <StoryFeed
            dailyStory={dailyStory}
            initialStories={initialStories}
            hasMore={hasMore}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-cream-200 bg-white mt-12 py-6 text-center text-sm text-earth-500">
        <p>Hang In There &mdash; One story, every day.</p>
      </footer>
    </main>
  );
}
