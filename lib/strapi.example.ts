/**
 * Strapi API Client Usage Examples
 * 
 * This file demonstrates how to use the Strapi API client functions.
 * These examples can be used in API routes or server components.
 */

import { getStories, getDailyStory, getStoryById, checkStrapiHealth } from './strapi';

/**
 * Example 1: Get all published stories with pagination
 */
async function exampleGetAllStories() {
  const result = await getStories({
    status: 'published',
    page: 1,
    pageSize: 20,
  });

  if (result.success) {
    console.log(`Found ${result.data.stories.length} stories`);
    console.log(`Total: ${result.data.pagination.total}`);
    result.data.stories.forEach((story) => {
      console.log(`- ${story.headline} (${story.theme})`);
    });
  } else {
    console.error('Error fetching stories:', result.error.message);
  }
}

/**
 * Example 2: Get stories filtered by theme
 */
async function exampleGetStoriesByTheme() {
  const result = await getStories({
    status: 'published',
    theme: 'grit',
    pageSize: 10,
  });

  if (result.success) {
    console.log(`Found ${result.data.stories.length} stories about grit`);
  } else {
    console.error('Error:', result.error.message);
  }
}

/**
 * Example 3: Search stories by keyword
 */
async function exampleSearchStories() {
  const result = await getStories({
    status: 'published',
    search: 'community',
    pageSize: 10,
  });

  if (result.success) {
    console.log(`Found ${result.data.stories.length} stories matching "community"`);
  } else {
    console.error('Error:', result.error.message);
  }
}

/**
 * Example 4: Get stories within a date range
 */
async function exampleGetStoriesByDateRange() {
  const result = await getStories({
    status: 'published',
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    sort: 'publishDate:asc',
  });

  if (result.success) {
    console.log(`Found ${result.data.stories.length} stories from 2024`);
  } else {
    console.error('Error:', result.error.message);
  }
}

/**
 * Example 5: Get today's daily story
 */
async function exampleGetDailyStory() {
  // Get daily story for user in New York timezone
  const result = await getDailyStory('America/New_York');

  if (result.success) {
    console.log("Today's story:", result.data.headline);
    console.log('Theme:', result.data.theme);
    console.log('Subject:', result.data.subjectName);
  } else {
    if (result.error.code === 'NO_DAILY_STORY') {
      console.log('No story scheduled for today');
    } else {
      console.error('Error:', result.error.message);
    }
  }
}

/**
 * Example 6: Get a specific story by ID
 */
async function exampleGetStoryById() {
  const result = await getStoryById('1');

  if (result.success) {
    console.log('Story:', result.data.headline);
    console.log('Narrative:', result.data.narrative);
    console.log('Source:', result.data.sourceAttribution);
    console.log('Comments enabled:', result.data.commentsEnabled);
    
    if (result.data.featuredImage) {
      console.log('Featured image:', result.data.featuredImage.url);
    }
  } else {
    console.error('Error:', result.error.message);
  }
}

/**
 * Example 7: Check if Strapi CMS is available
 */
async function exampleCheckHealth() {
  const result = await checkStrapiHealth();

  if (result.success) {
    console.log('CMS is available:', result.data.available);
  } else {
    console.error('CMS health check failed:', result.error.message);
  }
}

/**
 * Example 8: Error handling pattern
 */
async function exampleErrorHandling() {
  const result = await getDailyStory();

  if (!result.success) {
    // Handle different error types
    switch (result.error.code) {
      case 'NO_DAILY_STORY':
        console.log('No story available today');
        break;
      case 'NETWORK_ERROR':
        console.error('Cannot connect to CMS');
        break;
      case 'TIMEOUT_ERROR':
        console.error('Request timed out');
        break;
      case 'CMS_UNAVAILABLE':
        console.error('CMS is down');
        break;
      default:
        console.error('Unexpected error:', result.error.message);
    }
    return;
  }

  // Success case
  console.log('Story loaded:', result.data.headline);
}

/**
 * Example 9: Using in a Next.js API route
 */
export async function GET(request: Request) {
  // Extract timezone from query params or headers
  const { searchParams } = new URL(request.url);
  const timezone = searchParams.get('timezone') || 'UTC';

  const result = await getDailyStory(timezone);

  if (!result.success) {
    return Response.json(
      { error: result.error.message },
      { status: result.error.statusCode || 500 }
    );
  }

  return Response.json({ story: result.data });
}

/**
 * Example 10: Using in a Next.js Server Component
 */
export async function DailyStoryComponent() {
  const result = await getDailyStory();

  if (!result.success) {
    return (
      <div>
        <p>Unable to load today's story</p>
        <p>{result.error.message}</p>
      </div>
    );
  }

  const story = result.data;

  return (
    <article>
      <h1>{story.headline}</h1>
      <p>{story.narrative}</p>
      <footer>
        <span>{story.subjectName}</span>
        <span>{story.theme}</span>
      </footer>
    </article>
  );
}
