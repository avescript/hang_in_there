# Library Documentation

This directory contains core library code for the Hang In There application.

## Files

### `strapi.ts`
Strapi CMS API client with functions for fetching story content.

**Functions:**
- `getStories(filters)` - Get paginated list of stories with optional filters
- `getDailyStory(timezone)` - Get today's published story for a specific timezone
- `getStoryById(id)` - Get a single story by ID
- `checkStrapiHealth()` - Check if Strapi CMS is available

**Features:**
- Automatic error handling for network failures and CMS unavailability
- 10-second timeout on all requests to prevent hanging
- Type-safe Result pattern for error handling
- Automatic transformation of Strapi responses to application types

**Usage:**
See `strapi.example.ts` for detailed usage examples.

### `types/story.ts`
TypeScript type definitions for Story content from Strapi CMS.

**Key Types:**
- `Story` - Core story interface matching Strapi schema
- `StoryTheme` - Union type for story themes (grit, love, community, etc.)
- `StoryStatus` - Union type for story status (draft, scheduled, published)
- `StoryFilters` - Query filters for story API
- `Result<T, E>` - Type-safe result pattern for API calls

### `types/database.ts`
TypeScript type definitions for PostgreSQL database tables.

**Key Types:**
- User and authentication types (User, Account, Session)
- User preferences (UserSettings)
- Story engagement (SavedStory, ReadingStreak, StoryRead)
- Community features (Reaction, Comment, CommentFlag)
- Notifications and payments (PushSubscription, Donation)

### `db.ts`
PostgreSQL database connection pool and query utilities.

### `auth.ts`
NextAuth.js authentication configuration.

## Environment Variables

Required environment variables for Strapi integration:

```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token_here
```

See `.env.example` for complete list of environment variables.

## Error Handling

All Strapi API functions return a `Result<T, ApiError>` type:

```typescript
type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };
```

This pattern ensures type-safe error handling:

```typescript
const result = await getDailyStory();

if (!result.success) {
  // Handle error
  console.error(result.error.message);
  return;
}

// Use data
const story = result.data;
```

## Error Codes

Common error codes returned by the Strapi client:

- `NO_DAILY_STORY` - No story is scheduled for today
- `NETWORK_ERROR` - Unable to connect to Strapi CMS
- `TIMEOUT_ERROR` - Request to Strapi CMS timed out
- `CMS_UNAVAILABLE` - Strapi CMS is not available
- `STRAPI_ERROR` - Generic Strapi API error
- `UNKNOWN_ERROR` - Unexpected error occurred

## Testing

Testing infrastructure will be set up in task 16.1. Property-based tests for story data models will be implemented in task 2.3.
