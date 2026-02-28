'use client';

import { Story } from '@/lib/types/story';
import { useState } from 'react';

interface StoryCardProps {
  story: Story;
  isPinned?: boolean;
  onSave?: (storyId: string) => void;
  onShare?: (storyId: string) => void;
  isSaved?: boolean;
}

// Theme color mapping for badges
const themeColors: Record<Story['theme'], { bg: string; text: string; label: string }> = {
  grit: { bg: 'bg-earth-500', text: 'text-white', label: 'Grit & Tenacity' },
  love: { bg: 'bg-primary-400', text: 'text-white', label: 'Universal Love & Grace' },
  community: { bg: 'bg-earth-600', text: 'text-white', label: 'Community & Mutual Support' },
  environment: {
    bg: 'bg-earth-400',
    text: 'text-earth-900',
    label: 'Environmental Stewardship',
  },
  balance: { bg: 'bg-cream-500', text: 'text-earth-900', label: 'Work/Life Balance' },
  care: { bg: 'bg-primary-300', text: 'text-primary-900', label: 'Care for All Living Beings' },
};

/**
 * StoryCard Component
 *
 * Displays a single story with all required fields:
 * - Headline (max 12 words)
 * - Narrative (250-400 words)
 * - Subject name and identifier
 * - Theme tag badge
 * - Source attribution link
 * - Publication date
 * - Share and Save buttons
 *
 * Responsive design with mobile, tablet, and desktop breakpoints.
 * Accessible with semantic HTML and ARIA labels.
 */
export default function StoryCard({
  story,
  isPinned = false,
  onSave,
  onShare,
  isSaved = false,
}: StoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSaved, setLocalSaved] = useState(isSaved);

  // Format date in human-readable format
  const formatDate = (date: Date): string => {
    const storyDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - storyDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return storyDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const handleSave = () => {
    setLocalSaved(!localSaved);
    onSave?.(story.id);
  };

  const handleShare = () => {
    onShare?.(story.id);
  };

  const themeStyle = themeColors[story.theme];

  return (
    <article
      className={`
        bg-white rounded-lg shadow-sm border border-cream-200
        transition-all duration-300 ease-in-out
        hover:shadow-md hover:border-cream-300
        ${isPinned ? 'ring-2 ring-primary-400 ring-offset-2' : ''}
      `}
      aria-label={`Story: ${story.headline}`}
    >
      {/* Pinned Badge */}
      {isPinned && (
        <div className="bg-primary-500 text-white text-sm font-medium px-4 py-2 rounded-t-lg">
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Today's Story
          </span>
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Theme Badge */}
        <div className="mb-4">
          <span
            className={`
              inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${themeStyle.bg} ${themeStyle.text}
              transition-transform duration-200 hover:scale-105
            `}
            aria-label={`Theme: ${themeStyle.label}`}
          >
            #{story.theme}
          </span>
        </div>

        {/* Headline */}
        <h2
          className="
            text-2xl sm:text-3xl font-bold text-earth-900 mb-4
            leading-tight tracking-tight
          "
        >
          {story.headline}
        </h2>

        {/* Subject Information */}
        <div className="mb-4 text-earth-700">
          <p className="text-base sm:text-lg font-medium">
            {story.subjectName}
            {story.subjectIdentifier && (
              <span className="text-earth-600 font-normal ml-2">
                — {story.subjectIdentifier}
              </span>
            )}
          </p>
        </div>

        {/* Narrative */}
        <div className="prose prose-lg max-w-none mb-6">
          <p
            className={`
              text-earth-800 leading-relaxed whitespace-pre-line
              ${!isExpanded && story.narrative.length > 400 ? 'line-clamp-6' : ''}
            `}
          >
            {story.narrative}
          </p>
          {story.narrative.length > 400 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="
                text-primary-600 hover:text-primary-700 font-medium mt-2
                transition-colors duration-200 focus:outline-none focus:ring-2
                focus:ring-primary-500 focus:ring-offset-2 rounded
              "
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Show less' : 'Read more'}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Source Attribution */}
        <div className="mb-6 pb-6 border-b border-cream-200">
          <p className="text-sm text-earth-600">
            <span className="font-medium">Source:</span>{' '}
            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-primary-600 hover:text-primary-700 underline
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-primary-500
                focus:ring-offset-2 rounded
              "
              aria-label={`Read original source: ${story.sourceAttribution}`}
            >
              {story.sourceAttribution}
            </a>
          </p>
        </div>

        {/* Footer: Date and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Publication Date */}
          <time
            dateTime={new Date(story.publishDate).toISOString()}
            className="text-sm text-earth-600"
          >
            {formatDate(story.publishDate)}
          </time>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg
                font-medium text-sm transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  localSaved
                    ? 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500'
                    : 'bg-cream-200 text-earth-800 hover:bg-cream-300 focus:ring-cream-400'
                }
              `}
              aria-label={localSaved ? 'Unsave story' : 'Save story'}
              aria-pressed={localSaved}
            >
              <svg
                className="w-5 h-5"
                fill={localSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span className="hidden sm:inline">{localSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="
                flex items-center gap-2 px-4 py-2 rounded-lg
                bg-cream-200 text-earth-800 hover:bg-cream-300
                font-medium text-sm transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-cream-400 focus:ring-offset-2
              "
              aria-label="Share story"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
