/**
 * Strapi CMS API Client
 * 
 * Functions for fetching story content from Strapi headless CMS
 */

import {
  Story,
  StoryAttributes,
  StoryFilters,
  StrapiSingleResponse,
  StrapiCollectionResponse,
  Result,
  ApiError,
} from './types/story';

// Environment variables
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Base fetch wrapper with error handling
 */
async function fetchStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<Result<T, ApiError>> {
  try {
    const url = `${STRAPI_URL}/api${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization if token is available
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      return {
        success: false,
        error: {
          code: errorData.error?.name || 'STRAPI_ERROR',
          message: errorData.error?.message || `Strapi API error: ${response.status}`,
          statusCode: response.status,
          details: errorData.error?.details,
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    // Handle network errors, timeouts, etc.
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        return {
          success: false,
          error: {
            code: 'TIMEOUT_ERROR',
            message: 'Request to Strapi CMS timed out',
            statusCode: 0,
          },
        };
      }

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect to Strapi CMS',
          statusCode: 0,
          details: { originalError: error.message },
        },
      };
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        statusCode: 0,
      },
    };
  }
}

/**
 * Transform Strapi story attributes to Story interface
 */
function transformStoryAttributes(id: number, attributes: StoryAttributes): Story {
  return {
    id: String(id),
    headline: attributes.headline,
    narrative: attributes.narrative,
    subjectName: attributes.subjectName,
    subjectIdentifier: attributes.subjectIdentifier,
    theme: attributes.theme,
    sourceUrl: attributes.sourceUrl,
    sourceAttribution: attributes.sourceAttribution,
    publishDate: new Date(attributes.publishDate),
    scheduledDate: new Date(attributes.scheduledDate),
    status: attributes.status,
    featuredImage: attributes.featuredImage?.data?.attributes,
    commentsEnabled: attributes.commentsEnabled,
    createdAt: new Date(attributes.createdAt),
    updatedAt: new Date(attributes.updatedAt),
  };
}

/**
 * Build query string from filters
 */
function buildQueryString(filters: StoryFilters): string {
  const params = new URLSearchParams();

  // Pagination
  if (filters.page) {
    params.append('pagination[page]', String(filters.page));
  }
  if (filters.pageSize) {
    params.append('pagination[pageSize]', String(filters.pageSize));
  }

  // Filters
  if (filters.theme) {
    params.append('filters[theme][$eq]', filters.theme);
  }
  if (filters.status) {
    params.append('filters[status][$eq]', filters.status);
  }
  if (filters.dateFrom) {
    params.append('filters[publishDate][$gte]', filters.dateFrom);
  }
  if (filters.dateTo) {
    params.append('filters[publishDate][$lte]', filters.dateTo);
  }

  // Search (searches in headline and narrative)
  if (filters.search) {
    params.append('filters[$or][0][headline][$containsi]', filters.search);
    params.append('filters[$or][1][narrative][$containsi]', filters.search);
  }

  // Sorting
  if (filters.sort) {
    params.append('sort', filters.sort);
  } else {
    // Default sort by publish date descending (newest first)
    params.append('sort', 'publishDate:desc');
  }

  // Always populate featured image
  params.append('populate', 'featuredImage');

  return params.toString();
}

/**
 * Get paginated list of stories with optional filters
 * 
 * @param filters - Optional filters for theme, status, date range, search, pagination
 * @returns Result with array of stories and pagination metadata
 */
export async function getStories(
  filters: StoryFilters = {}
): Promise<Result<{ stories: Story[]; pagination: { page: number; pageSize: number; pageCount: number; total: number } }, ApiError>> {
  const queryString = buildQueryString(filters);
  const result = await fetchStrapi<StrapiCollectionResponse<StoryAttributes>>(
    `/stories?${queryString}`
  );

  if (!result.success) {
    return result;
  }

  const stories = result.data.data.map((item) =>
    transformStoryAttributes(item.id, item.attributes)
  );

  return {
    success: true,
    data: {
      stories,
      pagination: result.data.meta.pagination,
    },
  };
}

/**
 * Get today's daily story based on user's timezone
 * 
 * @param timezone - User's timezone (e.g., 'America/New_York', 'UTC')
 * @returns Result with today's story or error if no story is scheduled
 */
export async function getDailyStory(
  timezone: string = 'UTC'
): Promise<Result<Story, ApiError>> {
  // Calculate today's date in the user's timezone
  const now = new Date();
  const todayInTimezone = new Date(
    now.toLocaleString('en-US', { timeZone: timezone })
  );
  
  // Format as YYYY-MM-DD for Strapi date filter
  const todayDate = todayInTimezone.toISOString().split('T')[0];
  
  // Query for published story with publishDate matching today
  const queryParams = new URLSearchParams({
    'filters[status][$eq]': 'published',
    'filters[publishDate][$gte]': `${todayDate}T00:00:00.000Z`,
    'filters[publishDate][$lte]': `${todayDate}T23:59:59.999Z`,
    'pagination[pageSize]': '1',
    'sort': 'publishDate:desc',
    'populate': 'featuredImage',
  });

  const result = await fetchStrapi<StrapiCollectionResponse<StoryAttributes>>(
    `/stories?${queryParams.toString()}`
  );

  if (!result.success) {
    return result;
  }

  if (result.data.data.length === 0) {
    return {
      success: false,
      error: {
        code: 'NO_DAILY_STORY',
        message: 'No story is scheduled for today',
        statusCode: 404,
      },
    };
  }

  const story = transformStoryAttributes(
    result.data.data[0].id,
    result.data.data[0].attributes
  );

  return {
    success: true,
    data: story,
  };
}

/**
 * Get a single story by ID
 * 
 * @param id - Story ID
 * @returns Result with story details or error if not found
 */
export async function getStoryById(
  id: string
): Promise<Result<Story, ApiError>> {
  const queryParams = new URLSearchParams({
    'populate': 'featuredImage',
  });

  const result = await fetchStrapi<StrapiSingleResponse<StoryAttributes>>(
    `/stories/${id}?${queryParams.toString()}`
  );

  if (!result.success) {
    return result;
  }

  const story = transformStoryAttributes(
    result.data.data.id,
    result.data.data.attributes
  );

  return {
    success: true,
    data: story,
  };
}

/**
 * Check if Strapi CMS is available
 * 
 * @returns Result indicating if CMS is reachable
 */
export async function checkStrapiHealth(): Promise<Result<{ available: boolean }, ApiError>> {
  try {
    const response = await fetch(`${STRAPI_URL}/_health`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    return {
      success: true,
      data: { available: response.ok },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'CMS_UNAVAILABLE',
        message: 'Strapi CMS is not available',
        statusCode: 0,
      },
    };
  }
}
