# StoryCard Component

A responsive, accessible React component for displaying story cards in the Hang In There daily inspiration platform.

## Features

- **Complete Story Display**: Shows all required fields (headline, narrative, subject, theme, source, date)
- **Theme Badges**: Color-coded badges for each story theme (grit, love, community, environment, balance, care)
- **Responsive Design**: Optimized layouts for mobile (<640px), tablet (640-1024px), and desktop (>1024px)
- **Interactive Elements**: Save and Share buttons with hover states and animations
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support
- **Read More/Less**: Expandable narratives for longer stories
- **Pinned Stories**: Special styling for daily featured stories
- **Human-Readable Dates**: Smart date formatting (Today, Yesterday, X days ago, or full date)

## Usage

```tsx
import StoryCard from '@/components/StoryCard';
import { Story } from '@/lib/types/story';

const story: Story = {
  id: '1',
  headline: 'A Fisherwoman Who Rebuilt Her Community',
  narrative: 'Maria Santos had been fishing...',
  subjectName: 'Maria Santos',
  subjectIdentifier: 'fisherwoman, Brazil',
  theme: 'community',
  sourceUrl: 'https://example.com/story',
  sourceAttribution: 'The Guardian',
  publishDate: new Date('2024-01-15'),
  scheduledDate: new Date('2024-01-15'),
  status: 'published',
  commentsEnabled: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function MyPage() {
  const handleSave = (storyId: string) => {
    console.log('Save story:', storyId);
  };

  const handleShare = (storyId: string) => {
    console.log('Share story:', storyId);
  };

  return (
    <StoryCard
      story={story}
      isPinned={true}
      onSave={handleSave}
      onShare={handleShare}
      isSaved={false}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `story` | `Story` | Yes | - | The story object to display |
| `isPinned` | `boolean` | No | `false` | Whether to show the "Today's Story" badge |
| `onSave` | `(storyId: string) => void` | No | - | Callback when save button is clicked |
| `onShare` | `(storyId: string) => void` | No | - | Callback when share button is clicked |
| `isSaved` | `boolean` | No | `false` | Initial saved state |

## Theme Colors

The component uses the following color scheme for theme badges:

- **Grit & Tenacity**: Earth green (`earth-500`)
- **Universal Love & Grace**: Soft blue (`primary-400`)
- **Community & Mutual Support**: Dark earth green (`earth-600`)
- **Environmental Stewardship**: Medium earth green (`earth-400`)
- **Work/Life Balance**: Cream (`cream-500`)
- **Care for All Living Beings**: Light blue (`primary-300`)

## Accessibility Features

- Semantic HTML (`<article>`, `<h2>`, `<time>`)
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators on all focusable elements
- Screen reader friendly date formatting
- External links with `rel="noopener noreferrer"`
- Proper heading hierarchy

## Responsive Breakpoints

- **Mobile** (<640px): Stacked layout, full-width buttons
- **Tablet** (640-1024px): Optimized spacing, inline button text
- **Desktop** (>1024px): Maximum width constraints, enhanced hover states

## Design Principles

- **Warm & Grounded**: Uses the platform's warm color palette (soft blues, creams, earthy greens)
- **Spacious & Clean**: Generous padding and whitespace for comfortable reading
- **Subtle Animations**: Smooth transitions on hover and interaction
- **Non-Sensationalized**: Plain, warm language without hype or urgency

## Requirements Validated

This component validates the following requirements from the spec:

- **5.1.1**: Headline display (max 12 words)
- **5.1.2**: Narrative display (250-400 words)
- **5.1.3**: Subject name and identifier
- **5.1.4**: Theme tag badge
- **5.1.5**: Source attribution with hyperlink
- **5.1.6**: Publication date
- **5.1.7**: Share button (placeholder)
- **5.1.8**: Save button (placeholder)

## Future Enhancements

- Audio player integration (Task 9.1)
- Reaction bar (Task 8.1)
- Comment section (Task 8.3)
- Featured image display
- Social media share integration
