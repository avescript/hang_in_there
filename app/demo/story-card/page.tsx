import StoryCard from '@/components/StoryCard';
import { Story } from '@/lib/types/story';

// Sample stories for demonstration
const sampleStories: Story[] = [
  {
    id: '1',
    headline: 'A Fisherwoman Who Rebuilt Her Community After the Storm',
    narrative: `Maria Santos had been fishing the same waters for thirty years when Hurricane Elena destroyed everything. Her boat was gone, her home was flooded, and the small fishing cooperative she'd helped build was in ruins. But Maria didn't give up.

She gathered the other fisherwomen in her village and proposed a plan: they would pool their resources, apply for a small grant, and rebuild together. It took two years of early mornings and late nights, but they did it. Today, the cooperative is stronger than ever, employing 50 families and serving as a model for other coastal communities.

"We didn't just rebuild our boats," Maria says. "We rebuilt our hope."`,
    subjectName: 'Maria Santos',
    subjectIdentifier: 'fisherwoman, Brazil',
    theme: 'community',
    sourceUrl: 'https://example.com/maria-santos-story',
    sourceAttribution: 'The Guardian - Upside Series',
    publishDate: new Date(),
    scheduledDate: new Date(),
    status: 'published',
    commentsEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    headline: 'The Teacher Who Never Gave Up on His Students',
    narrative: `For fifteen years, James Chen taught mathematics at an underfunded high school in Detroit. When budget cuts threatened to eliminate the advanced math program, he didn't accept defeat. Instead, he started teaching extra classes after school, on weekends, and during summer break—all without additional pay.

His dedication paid off. Over the years, 47 of his students earned full scholarships to top universities, many becoming the first in their families to attend college. Several have returned to teach in their community, inspired by Mr. Chen's example.

"Success isn't about never falling down," he tells his students. "It's about getting back up, every single time."`,
    subjectName: 'James Chen',
    subjectIdentifier: 'teacher, Detroit, USA',
    theme: 'grit',
    sourceUrl: 'https://example.com/james-chen-story',
    sourceAttribution: 'NPR - Remarkable People',
    publishDate: new Date(Date.now() - 86400000), // Yesterday
    scheduledDate: new Date(Date.now() - 86400000),
    status: 'published',
    commentsEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    headline: 'A Nurse Who Forgave the Unforgivable',
    narrative: `When Sarah Williams' daughter was killed by a drunk driver, everyone expected her to demand the harshest punishment. Instead, she did something extraordinary: she visited the driver in prison and offered forgiveness.

"Holding onto anger was destroying me," Sarah explains. "Forgiveness wasn't about excusing what happened—it was about freeing myself from the weight of hatred." Over the next five years, she continued to visit, eventually helping the young man turn his life around.

Today, they speak together at schools about the power of forgiveness and the consequences of drunk driving. Their story has touched thousands of lives and prevented countless tragedies.`,
    subjectName: 'Sarah Williams',
    subjectIdentifier: 'nurse, Manchester, UK',
    theme: 'love',
    sourceUrl: 'https://example.com/sarah-williams-story',
    sourceAttribution: 'BBC - People Fixing the World',
    publishDate: new Date(Date.now() - 172800000), // 2 days ago
    scheduledDate: new Date(Date.now() - 172800000),
    status: 'published',
    commentsEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    headline: 'The Farmer Who Brought Back the Butterflies',
    narrative: `When Miguel Hernandez inherited his family's farm in rural Mexico, the land was depleted from decades of intensive agriculture. Monarch butterflies, once abundant, had all but disappeared. Miguel decided to change course.

He converted half his land to native wildflowers and stopped using pesticides. Neighbors thought he was crazy—until the butterflies returned. Within three years, his farm became a crucial stopover on the monarch migration route. Other farmers took notice and began following his example.

Now, the entire valley is transforming. "We don't own the land," Miguel says. "We're just borrowing it from our children."`,
    subjectName: 'Miguel Hernandez',
    subjectIdentifier: 'farmer, Michoacán, Mexico',
    theme: 'environment',
    sourceUrl: 'https://example.com/miguel-hernandez-story',
    sourceAttribution: 'Reasons to Be Cheerful',
    publishDate: new Date(Date.now() - 604800000), // 7 days ago
    scheduledDate: new Date(Date.now() - 604800000),
    status: 'published',
    commentsEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    headline: 'The CEO Who Chose Rest Over Revenue',
    narrative: `When Anna Kowalski took over as CEO of a struggling tech startup, everyone expected her to demand longer hours and weekend work. Instead, she did the opposite: she instituted a four-day work week and mandatory vacation time.

"Burnout was killing our creativity," she explains. "People can't innovate when they're exhausted." The board was skeptical, but the results spoke for themselves. Within a year, productivity increased by 30%, employee retention improved dramatically, and the company launched its most successful product ever.

Other companies are now studying her model. "Rest isn't a luxury," Anna says. "It's a strategic advantage."`,
    subjectName: 'Anna Kowalski',
    subjectIdentifier: 'CEO, Warsaw, Poland',
    theme: 'balance',
    sourceUrl: 'https://example.com/anna-kowalski-story',
    sourceAttribution: 'The Atlantic',
    publishDate: new Date(Date.now() - 1209600000), // 14 days ago
    scheduledDate: new Date(Date.now() - 1209600000),
    status: 'published',
    commentsEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    headline: 'The Veterinarian Who Saved a Species',
    narrative: `Dr. Amara Okafor had spent her entire career treating pets in Lagos when she learned that the African forest elephant was on the brink of extinction. She couldn't ignore the call. At 52, she left her comfortable practice to work in remote conservation areas.

For eight years, she's treated injured elephants, trained local veterinarians, and worked with communities to reduce human-wildlife conflict. Her efforts have helped stabilize the population in three critical habitats. She's also established a scholarship program to train the next generation of African wildlife veterinarians.

"Every species we lose diminishes us all," she says. "Saving them is saving ourselves."`,
    subjectName: 'Dr. Amara Okafor',
    subjectIdentifier: 'veterinarian, Nigeria',
    theme: 'care',
    sourceUrl: 'https://example.com/amara-okafor-story',
    sourceAttribution: 'National Geographic',
    publishDate: new Date(Date.now() - 2592000000), // 30 days ago
    scheduledDate: new Date(Date.now() - 2592000000),
    status: 'published',
    commentsEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function StoryCardDemoPage() {
  const handleSave = (storyId: string) => {
    console.log('Save story:', storyId);
    alert(`Story ${storyId} saved! (This is a demo - functionality not yet implemented)`);
  };

  const handleShare = (storyId: string) => {
    console.log('Share story:', storyId);
    alert(`Share story ${storyId}! (This is a demo - functionality not yet implemented)`);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-cream-200 py-6 mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-earth-900">StoryCard Component Demo</h1>
          <p className="text-earth-600 mt-2">
            Showcasing all theme types and responsive design
          </p>
        </div>
      </header>

      {/* Story Cards */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        <div className="space-y-8">
          {/* Pinned Story */}
          <section>
            <h2 className="text-xl font-semibold text-earth-800 mb-4">Pinned Story (Today)</h2>
            <StoryCard
              story={sampleStories[0]}
              isPinned={true}
              onSave={handleSave}
              onShare={handleShare}
              isSaved={false}
            />
          </section>

          {/* Regular Stories */}
          <section>
            <h2 className="text-xl font-semibold text-earth-800 mb-4">
              Recent Stories (All Themes)
            </h2>
            <div className="space-y-6">
              {sampleStories.slice(1).map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onSave={handleSave}
                  onShare={handleShare}
                  isSaved={index === 1} // Demo: second story is saved
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-cream-200 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-earth-600">
          <p>
            This is a demo page for the StoryCard component. Visit{' '}
            <code className="bg-cream-100 px-2 py-1 rounded">/demo/story-card</code> to see this
            page.
          </p>
        </div>
      </footer>
    </div>
  );
}
