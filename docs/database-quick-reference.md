# Database Quick Reference

Quick reference for common database operations in Hang In There.

## Connection

```typescript
import { query, getClient, getPool } from '@/lib/db';

// Simple query
const result = await query('SELECT * FROM users WHERE email = $1', [email]);

// Transaction
const client = await getClient();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO users ...');
  await client.query('INSERT INTO user_settings ...');
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

## Common Queries

### Users

```typescript
// Get user by email
const { rows } = await query<User>(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// Create user
const { rows } = await query<User>(
  `INSERT INTO users (email, name, email_verified) 
   VALUES ($1, $2, $3) 
   RETURNING *`,
  [email, name, false]
);

// Update user
await query(
  'UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2',
  [name, userId]
);
```

### User Settings

```typescript
// Get user settings
const { rows } = await query<UserSettings>(
  'SELECT * FROM user_settings WHERE user_id = $1',
  [userId]
);

// Create or update settings (upsert)
await query(
  `INSERT INTO user_settings (user_id, notification_enabled, notification_time, timezone)
   VALUES ($1, $2, $3, $4)
   ON CONFLICT (user_id) 
   DO UPDATE SET 
     notification_enabled = $2,
     notification_time = $3,
     timezone = $4,
     updated_at = NOW()`,
  [userId, enabled, time, timezone]
);
```

### Saved Stories

```typescript
// Save a story
await query(
  'INSERT INTO saved_stories (user_id, story_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
  [userId, storyId]
);

// Unsave a story
await query(
  'DELETE FROM saved_stories WHERE user_id = $1 AND story_id = $2',
  [userId, storyId]
);

// Get user's saved stories
const { rows } = await query<SavedStory>(
  'SELECT * FROM saved_stories WHERE user_id = $1 ORDER BY saved_at DESC',
  [userId]
);

// Check if user saved a story
const { rows } = await query(
  'SELECT 1 FROM saved_stories WHERE user_id = $1 AND story_id = $2',
  [userId, storyId]
);
const hasSaved = rows.length > 0;
```

### Reading Streaks

```typescript
// Get user's streak
const { rows } = await query<ReadingStreak>(
  'SELECT * FROM reading_streaks WHERE user_id = $1',
  [userId]
);

// Record a story read
await query(
  `INSERT INTO story_reads (user_id, story_id, read_duration)
   VALUES ($1, $2, $3)
   ON CONFLICT (user_id, story_id, DATE(read_at)) DO NOTHING`,
  [userId, storyId, duration]
);

// Update streak (after recording read)
await query(
  `INSERT INTO reading_streaks (user_id, current_streak, longest_streak, last_read_date)
   VALUES ($1, 1, 1, CURRENT_DATE)
   ON CONFLICT (user_id) DO UPDATE SET
     current_streak = CASE
       WHEN reading_streaks.last_read_date = CURRENT_DATE - INTERVAL '1 day' 
       THEN reading_streaks.current_streak + 1
       WHEN reading_streaks.last_read_date = CURRENT_DATE
       THEN reading_streaks.current_streak
       ELSE 1
     END,
     longest_streak = GREATEST(
       reading_streaks.longest_streak,
       CASE
         WHEN reading_streaks.last_read_date = CURRENT_DATE - INTERVAL '1 day'
         THEN reading_streaks.current_streak + 1
         ELSE 1
       END
     ),
     last_read_date = CURRENT_DATE,
     updated_at = NOW()`,
  [userId]
);
```

### Reactions

```typescript
// Add reaction
await query(
  `INSERT INTO reactions (user_id, story_id, reaction_type)
   VALUES ($1, $2, $3)
   ON CONFLICT (user_id, story_id, reaction_type) DO NOTHING`,
  [userId, storyId, reactionType]
);

// Remove reaction
await query(
  'DELETE FROM reactions WHERE user_id = $1 AND story_id = $2 AND reaction_type = $3',
  [userId, storyId, reactionType]
);

// Get reaction counts for a story
const { rows } = await query(
  `SELECT reaction_type, COUNT(*) as count
   FROM reactions
   WHERE story_id = $1
   GROUP BY reaction_type`,
  [storyId]
);

// Get user's reaction for a story
const { rows } = await query<Reaction>(
  'SELECT * FROM reactions WHERE user_id = $1 AND story_id = $2',
  [userId, storyId]
);
```

### Comments

```typescript
// Create comment
const { rows } = await query<Comment>(
  `INSERT INTO comments (user_id, story_id, parent_id, content)
   VALUES ($1, $2, $3, $4)
   RETURNING *`,
  [userId, storyId, parentId, content]
);

// Get comments for a story (with user info)
const { rows } = await query(
  `SELECT c.*, u.name, u.image
   FROM comments c
   JOIN users u ON c.user_id = u.id
   WHERE c.story_id = $1 AND c.status = 'visible' AND c.parent_id IS NULL
   ORDER BY c.created_at DESC
   LIMIT 20 OFFSET $2`,
  [storyId, offset]
);

// Get replies to a comment
const { rows } = await query(
  `SELECT c.*, u.name, u.image
   FROM comments c
   JOIN users u ON c.user_id = u.id
   WHERE c.parent_id = $1 AND c.status = 'visible'
   ORDER BY c.created_at ASC`,
  [parentId]
);

// Flag a comment
await query(
  `INSERT INTO comment_flags (comment_id, flagged_by, reason)
   VALUES ($1, $2, $3)
   ON CONFLICT (comment_id, flagged_by) DO NOTHING`,
  [commentId, userId, reason]
);

// Update comment status when flagged
await query(
  "UPDATE comments SET status = 'flagged' WHERE id = $1",
  [commentId]
);
```

### Push Subscriptions

```typescript
// Subscribe to push notifications
await query(
  `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, timezone, preferred_time)
   VALUES ($1, $2, $3, $4, $5, $6)
   ON CONFLICT (endpoint) DO UPDATE SET
     user_id = $1,
     p256dh = $3,
     auth = $4,
     timezone = $5,
     preferred_time = $6,
     updated_at = NOW()`,
  [userId, endpoint, p256dh, auth, timezone, preferredTime]
);

// Get subscriptions for notification time
const { rows } = await query<PushSubscription>(
  `SELECT * FROM push_subscriptions
   WHERE preferred_time = $1 AND timezone = $2`,
  [time, timezone]
);

// Unsubscribe
await query(
  'DELETE FROM push_subscriptions WHERE user_id = $1',
  [userId]
);
```

### Donations

```typescript
// Create donation record
await query(
  `INSERT INTO donations (
     user_id, stripe_payment_id, stripe_customer_id, 
     amount, currency, frequency, status, 
     display_on_wall, display_name
   )
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
  [userId, paymentId, customerId, amount, currency, frequency, status, displayOnWall, displayName]
);

// Update donation status (webhook)
await query(
  'UPDATE donations SET status = $1, updated_at = NOW() WHERE stripe_payment_id = $2',
  [status, paymentId]
);

// Get Community Wall donors
const { rows } = await query(
  `SELECT display_name, created_at
   FROM donations
   WHERE display_on_wall = true AND status = 'succeeded'
   ORDER BY created_at DESC`,
  []
);
```

## Indexes

All tables have appropriate indexes for common queries:

- **users**: `email`
- **accounts**: `user_id`, `(provider, provider_account_id)`
- **sessions**: `user_id`, `session_token`
- **saved_stories**: `user_id`, `story_id`, `(user_id, story_id)`
- **story_reads**: `user_id`, `story_id`, `read_at`
- **reactions**: `story_id`, `user_id`, `(user_id, story_id, reaction_type)`
- **comments**: `story_id`, `user_id`, `parent_id`, `status`
- **comment_flags**: `comment_id`, `status`, `(comment_id, flagged_by)`
- **push_subscriptions**: `user_id`, `endpoint`
- **donations**: `user_id`, `stripe_payment_id`, `display_on_wall`

## Best Practices

1. **Always use parameterized queries** to prevent SQL injection
2. **Use transactions** for operations that modify multiple tables
3. **Handle errors gracefully** and rollback transactions on failure
4. **Use ON CONFLICT** for upsert operations
5. **Add indexes** for columns used in WHERE, JOIN, and ORDER BY clauses
6. **Limit result sets** with LIMIT and OFFSET for pagination
7. **Use connection pooling** (already configured in `lib/db.ts`)
8. **Log slow queries** in development (automatically done in `lib/db.ts`)
9. **Release clients** after transactions
10. **Use TypeScript types** from `lib/types/database.ts`
