import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { getStoryById } from '@/lib/strapi';
import { Story } from '@/lib/types/story';
import StoryCard from '@/components/StoryCard';

export default async function SavedStoriesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/');
  }

  const stories: Story[] = [];

  try {
    const result = await query<{ story_id: string }>(
      'SELECT story_id FROM saved_stories WHERE user_id = $1 ORDER BY saved_at DESC',
      [user.id]
    );

    for (const row of result.rows) {
      const res = await getStoryById(row.story_id);
      if (res.success) {
        stories.push(res.data);
      }
    }
  } catch {
    // DB unavailable — render empty state
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-earth-900 mb-8">Saved Stories</h1>

      {stories.length === 0 ? (
        <p className="text-earth-600 text-center py-16">
          No saved stories yet. Start reading and save the ones that move you.
        </p>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} isSaved />
          ))}
        </div>
      )}
    </main>
  );
}
