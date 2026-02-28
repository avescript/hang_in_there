import { render, screen, fireEvent } from '@testing-library/react';
import StoryCard from '../StoryCard';
import { Story } from '@/lib/types/story';

// Mock story data for testing
const mockStory: Story = {
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
  publishDate: new Date('2024-01-15'),
  scheduledDate: new Date('2024-01-15'),
  status: 'published',
  commentsEnabled: true,
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-10'),
};

describe('StoryCard', () => {
  it('renders all required fields', () => {
    render(<StoryCard story={mockStory} />);

    // Check headline
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(mockStory.headline);

    // Check subject name and identifier
    expect(screen.getByText(mockStory.subjectName)).toBeInTheDocument();
    expect(screen.getByText(/fisherwoman, Brazil/)).toBeInTheDocument();

    // Check narrative
    expect(screen.getByText(/Maria Santos had been fishing/)).toBeInTheDocument();

    // Check theme badge
    expect(screen.getByText('#community')).toBeInTheDocument();

    // Check source attribution
    expect(screen.getByText(/The Guardian - Upside Series/)).toBeInTheDocument();

    // Check buttons
    expect(screen.getByRole('button', { name: /save story/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share story/i })).toBeInTheDocument();
  });

  it('displays pinned badge when isPinned is true', () => {
    render(<StoryCard story={mockStory} isPinned={true} />);

    expect(screen.getByText("Today's Story")).toBeInTheDocument();
  });

  it('toggles save state when save button is clicked', () => {
    const onSave = jest.fn();
    render(<StoryCard story={mockStory} onSave={onSave} />);

    const saveButton = screen.getByRole('button', { name: /save story/i });
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith(mockStory.id);
    expect(screen.getByRole('button', { name: /unsave story/i })).toBeInTheDocument();
  });

  it('calls onShare when share button is clicked', () => {
    const onShare = jest.fn();
    render(<StoryCard story={mockStory} onShare={onShare} />);

    const shareButton = screen.getByRole('button', { name: /share story/i });
    fireEvent.click(shareButton);

    expect(onShare).toHaveBeenCalledWith(mockStory.id);
  });

  it('displays saved state when isSaved prop is true', () => {
    render(<StoryCard story={mockStory} isSaved={true} />);

    expect(screen.getByRole('button', { name: /unsave story/i })).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    const today = new Date();
    const storyToday: Story = { ...mockStory, publishDate: today };

    render(<StoryCard story={storyToday} />);

    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('renders all theme types with correct styling', () => {
    const themes: Array<Story['theme']> = [
      'grit',
      'love',
      'community',
      'environment',
      'balance',
      'care',
    ];

    themes.forEach((theme) => {
      const storyWithTheme: Story = { ...mockStory, theme };
      const { unmount } = render(<StoryCard story={storyWithTheme} />);

      expect(screen.getByText(`#${theme}`)).toBeInTheDocument();

      unmount();
    });
  });

  it('has proper accessibility attributes', () => {
    render(<StoryCard story={mockStory} />);

    // Check article has aria-label
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-label', `Story: ${mockStory.headline}`);

    // Check buttons have aria-labels
    expect(screen.getByRole('button', { name: /save story/i })).toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: /share story/i })).toHaveAttribute('aria-label');

    // Check source link has proper attributes
    const sourceLink = screen.getByRole('link', { name: /read original source/i });
    expect(sourceLink).toHaveAttribute('target', '_blank');
    expect(sourceLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('expands and collapses long narratives', () => {
    const longNarrative = 'A'.repeat(500);
    const longStory: Story = { ...mockStory, narrative: longNarrative };

    render(<StoryCard story={longStory} />);

    // Initially should show "Read more" button
    const readMoreButton = screen.getByRole('button', { name: /read more/i });
    expect(readMoreButton).toBeInTheDocument();

    // Click to expand
    fireEvent.click(readMoreButton);
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();

    // Click to collapse
    const showLessButton = screen.getByRole('button', { name: /show less/i });
    fireEvent.click(showLessButton);
    expect(screen.getByRole('button', { name: /read more/i })).toBeInTheDocument();
  });
});
