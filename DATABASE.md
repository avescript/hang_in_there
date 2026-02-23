# Database Setup Guide

This document explains how to set up and manage the PostgreSQL database for Hang In There.

## Prerequisites

- PostgreSQL 15 or higher installed and running
- Node.js and npm installed
- Access to a PostgreSQL server (local or remote)

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file and configure your database credentials:

```bash
cp .env.example .env
```

Edit `.env` and set your PostgreSQL connection details:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=hang_in_there
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/hang_in_there
```

### 2. Run the Setup Script

The setup script will create the database and run all migrations:

```bash
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

Alternatively, you can run the steps manually:

```bash
# Create the database (if using psql)
createdb hang_in_there

# Run migrations
npm run migrate:up
```

## Database Schema

The database consists of 13 tables organized into several functional groups:

### Authentication Tables (NextAuth.js)

- **users**: User accounts with email, name, and profile image
- **accounts**: OAuth provider accounts linked to users
- **sessions**: Active user sessions
- **verification_tokens**: Email verification tokens

### User Preferences

- **user_settings**: Notification preferences, timezone, theme filters, streak visibility

### Story Engagement

- **saved_stories**: Stories bookmarked by users
- **reading_streaks**: Reading streak tracking (current and longest streaks)
- **story_reads**: History of story reads with timestamps and duration

### Community Features

- **reactions**: Story reactions (❤️ heart, ✊ fist, 🌱 seedling, 😢 tear)
- **comments**: User comments on stories (max depth: 2 levels)
- **comment_flags**: Flagged comments for moderation review

### Notifications & Payments

- **push_subscriptions**: Web Push notification subscriptions with VAPID keys
- **donations**: Stripe donation records with amount, frequency, and Community Wall opt-in

## Migration Management

### Running Migrations

```bash
# Run all pending migrations
npm run migrate:up

# Rollback the last migration
npm run migrate:down

# Create a new migration
npm run migrate:create my-migration-name
```

### Migration Files

Migrations are located in the `migrations/` directory and are executed in order:

1. `1709000000001_create-users-and-auth-tables.js` - Users and NextAuth tables
2. `1709000000002_create-user-settings-and-saved-stories.js` - User preferences and saved content
3. `1709000000003_create-reactions-and-comments.js` - Community engagement features
4. `1709000000004_create-push-subscriptions-and-donations.js` - Notifications and payments

### Creating New Migrations

When you need to modify the database schema:

```bash
npm run migrate:create add-new-feature
```

This creates a new migration file in the `migrations/` directory. Edit the file to define your schema changes:

```javascript
exports.up = (pgm) => {
  // Add your schema changes here
  pgm.createTable('my_table', {
    id: { type: 'uuid', primaryKey: true },
    // ... more columns
  });
};

exports.down = (pgm) => {
  // Rollback changes here
  pgm.dropTable('my_table');
};
```

## Database Indexes

The following indexes are created for performance:

### Users & Auth
- `users.email` - Fast user lookup by email
- `accounts.user_id` - Fast account lookup by user
- `sessions.user_id`, `sessions.session_token` - Fast session validation

### Story Engagement
- `saved_stories.user_id`, `saved_stories.story_id` - Fast saved story queries
- `story_reads.user_id`, `story_reads.story_id`, `story_reads.read_at` - Streak calculation and analytics

### Community Features
- `reactions.story_id`, `reactions.user_id` - Fast reaction counts and user reaction lookup
- `comments.story_id`, `comments.user_id`, `comments.parent_id`, `comments.status` - Efficient comment threading and moderation
- `comment_flags.comment_id`, `comment_flags.status` - Moderation queue queries

### Notifications & Payments
- `push_subscriptions.user_id` - Fast subscription lookup
- `donations.user_id`, `donations.stripe_payment_id`, `donations.display_on_wall` - Payment tracking and Community Wall

## Data Validation

The database enforces several constraints:

### Check Constraints
- `reactions.reaction_type` - Must be one of: 'heart', 'fist', 'seedling', 'tear'
- `comments.content` - Maximum 500 characters
- `comments.status` - Must be one of: 'visible', 'hidden', 'flagged', 'deleted'
- `comment_flags.status` - Must be one of: 'pending', 'reviewed', 'dismissed'
- `donations.frequency` - Must be one of: 'once', 'monthly'
- `donations.status` - Must be one of: 'pending', 'succeeded', 'failed', 'refunded'

### Unique Constraints
- `users.email` - One account per email address
- `accounts.(provider, provider_account_id)` - One OAuth account per provider
- `sessions.session_token` - Unique session tokens
- `saved_stories.(user_id, story_id)` - Users can save each story only once
- `reactions.(user_id, story_id, reaction_type)` - One reaction type per user per story
- `comment_flags.(comment_id, flagged_by)` - Users can flag each comment only once
- `push_subscriptions.endpoint` - One subscription per endpoint
- `donations.stripe_payment_id` - Unique Stripe payment IDs

## Backup and Restore

### Creating a Backup

```bash
pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -F c -f backup.dump
```

### Restoring from Backup

```bash
pg_restore -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -c backup.dump
```

## Troubleshooting

### Connection Issues

If you can't connect to the database:

1. Check that PostgreSQL is running: `pg_isready`
2. Verify your credentials in `.env`
3. Check PostgreSQL logs for errors
4. Ensure the database exists: `psql -l`

### Migration Errors

If a migration fails:

1. Check the error message in the console
2. Verify the migration file syntax
3. Rollback if needed: `npm run migrate:down`
4. Fix the migration and try again: `npm run migrate:up`

### Permission Errors

If you get permission errors:

1. Ensure your PostgreSQL user has CREATE DATABASE privileges
2. Grant necessary permissions: `GRANT ALL PRIVILEGES ON DATABASE hang_in_there TO your_user;`

## Production Considerations

### Security

- Use strong passwords for database users
- Enable SSL/TLS for database connections (configured in `database.json` for production)
- Restrict database access to application servers only
- Regularly update PostgreSQL to the latest version

### Performance

- Monitor slow queries using `pg_stat_statements`
- Consider adding additional indexes based on query patterns
- Set up connection pooling (e.g., using PgBouncer)
- Configure appropriate `work_mem` and `shared_buffers` settings

### Backups

- Set up automated daily backups
- Test restore procedures regularly
- Store backups in a separate location
- Retain backups according to your data retention policy

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-pg-migrate Documentation](https://salsita.github.io/node-pg-migrate/)
- [NextAuth.js Database Adapters](https://next-auth.js.org/adapters/overview)
