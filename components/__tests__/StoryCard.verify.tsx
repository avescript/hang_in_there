/**
 * Simple verification file to ensure StoryCard component
 * can be imported and type-checked correctly.
 * 
 * This file is not meant to be run, just type-checked.
 */

import StoryCard from '../StoryCard';
import { Story } from '@/lib/types/story';

// Create a valid story object
const testStory: Story = {
  id: '1',
  headline: 'Test Story Headline',
  narrative: 'This is a test narrative that is long enough to meet the requirements.',
  subjectName: 'Test Subject',
  subjectIdentifier: 'test identifier',
  theme: 'community',
  sourceUrl: 'https://example.com',
  sourceAttribution: 'Test Source',
  publishDate: new Date(),
  scheduledDate: new Date(),
  status: 'published',
  commentsEnabled: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Verify component can be used with all props
const ComponentWithAllProps = () => (
  <StoryCard
    story={testStory}
    isPinned={true}
    onSave={(id) => console.log('Save', id)}
    onShare={(id) => console.log('Share', id)}
    isSaved={false}
  />
);

// Verify component can be used with minimal props
const ComponentWithMinimalProps = () => <StoryCard story={testStory} />;

// Verify all theme types work
const themes: Array<Story['theme']> = ['grit', 'love', 'community', 'environment', 'balance', 'care'];
const ComponentsWithAllThemes = () => (
  <>
    {themes.map((theme) => (
      <StoryCard key={theme} story={{ ...testStory, theme }} />
    ))}
  </>
);

export { ComponentWithAllProps, ComponentWithMinimalProps, ComponentsWithAllThemes };
