# Strapi CMS Setup Guide

This document provides comprehensive instructions for setting up and configuring the Strapi 4 CMS for the Hang In There platform.

## Overview

The Strapi CMS is installed in the `cms/` directory and provides:
- Editorial interface for managing story content
- Story content type with all required fields
- Media library for featured images
- PostgreSQL database integration
- RESTful API for the Next.js frontend

## Prerequisites

- Node.js 18.x or 20.x (Strapi 4 requirement)
- PostgreSQL 15+ running and accessible
- Database credentials from the main application setup

## Installation

The CMS has been pre-configured with all necessary files. To complete the setup:

### 1. Configure Environment Variables

Navigate to the cms directory and create a `.env` file:

```bash
cd cms
cp .env.example .env
```

Edit the `.env` file with your database credentials (should match the main app):

```env
# Server
HOST=0.0.0.0
PORT=1337

# Secrets - GENERATE NEW VALUES FOR PRODUCTION!
APP_KEYS=your-app-key-1,your-app-key-2
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database (use same credentials as main app)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=hang_in_there
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
```

**Important**: Generate secure random strings for all secret keys in production. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Build the Admin Panel

```bash
npm run build
```

This compiles the Strapi admin interface. It may take a few minutes.

### 3. Start Strapi

For development (with auto-reload):
```bash
npm run develop
```

For production:
```bash
npm start
```

The CMS will be available at:
- Admin Panel: `http://localhost:1337/admin`
- API: `http://localhost:1337/api`

### 4. Create Admin User

On first launch, Strapi will prompt you to create an administrator account:

1. Navigate to `http://localhost:1337/admin`
2. Fill in the registration form:
   - First name
   - Last name
   - Email
   - Password (minimum 8 characters)
3. Click "Let's start"

## Story Content Type

The Story content type has been pre-configured with the following schema:

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| headline | String | Yes | Story headline (max 12 words, 255 chars) |
| narrative | Text | Yes | Story narrative (250-400 words) |
| subjectName | String | Yes | Name of the story subject |
| subjectIdentifier | String | Yes | Brief identifier (e.g., "fisherwoman, Brazil") |
| theme | Enum | Yes | One of: grit, love, community, environment, balance, care |
| sourceUrl | String | Yes | URL to the original source |
| sourceAttribution | String | Yes | Attribution text for the source |
| publishDate | DateTime | No | When the story was published (auto-set by cron) |
| scheduledDate | DateTime | Yes | When the story should be published |
| status | Enum | Yes | One of: draft, scheduled, published (default: draft) |
| featuredImage | Media | No | Optional featured image (images only) |
| commentsEnabled | Boolean | Yes | Whether comments are enabled (default: true) |

### Validation Rules

The following validation should be enforced editorially:
- Headline: 1-12 words
- Narrative: 250-400 words
- All URLs must be valid and publicly accessible
- Scheduled date must be in the future for new stories

## Editorial Workflow

### Creating a Story

1. Log in to the admin panel
2. Navigate to Content Manager → Story
3. Click "Create new entry"
4. Fill in all required fields:
   - Write a compelling headline (max 12 words)
   - Write or adapt the narrative (250-400 words)
   - Enter subject name and identifier
   - Select the primary theme
   - Add source URL and attribution
   - Set scheduled date (at least 2 weeks in advance)
   - Upload featured image (optional)
   - Set comments enabled (default: true)
5. Save as draft

### Scheduling a Story

1. Review the draft story
2. Ensure all fields are complete and accurate
3. Verify the scheduled date is correct
4. Change status from "draft" to "scheduled"
5. Save

### Publishing Process

Stories are automatically published by a cron job when:
- Status is "scheduled"
- Scheduled date/time has passed

The cron job will:
- Update status to "published"
- Set publishDate to current timestamp
- Trigger push notifications to subscribers

### Maintaining the Backlog

**Target**: Maintain a minimum of 30 unpublished stories at all times

To check backlog:
1. Navigate to Content Manager → Story
2. Filter by status: "draft" or "scheduled"
3. Count total entries

If backlog falls below 30:
- Prioritize story discovery and creation
- Review editorial calendar
- Adjust scheduling if needed

## Media Library

### Uploading Featured Images

1. Navigate to Media Library in the admin panel
2. Click "Add new assets"
3. Upload images (recommended: 1200x630px, JPEG or PNG)
4. Add alt text for accessibility
5. Images are stored in `cms/public/uploads/`

### Image Guidelines

- Format: JPEG or PNG
- Recommended size: 1200x630px (2:1 aspect ratio)
- Maximum file size: 2MB
- Always include descriptive alt text
- Use high-quality, relevant images

## API Access

### Authentication

The Strapi API requires authentication for write operations. Read operations can be configured as public.

To configure public read access:
1. Navigate to Settings → Users & Permissions Plugin → Roles
2. Select "Public" role
3. Under Permissions → Story:
   - Enable "find" (get all stories)
   - Enable "findOne" (get single story)
4. Save

### API Endpoints

**Get all stories:**
```
GET /api/stories
```

**Get single story:**
```
GET /api/stories/:id
```

**Filter by status:**
```
GET /api/stories?filters[status][$eq]=published
```

**Filter by theme:**
```
GET /api/stories?filters[theme][$eq]=grit
```

**Filter by scheduled date:**
```
GET /api/stories?filters[scheduledDate][$lte]=2026-02-23
```

**Sort by scheduled date:**
```
GET /api/stories?sort=scheduledDate:desc
```

**Pagination:**
```
GET /api/stories?pagination[page]=1&pagination[pageSize]=20
```

**Include featured image:**
```
GET /api/stories?populate=featuredImage
```

### Response Format

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "headline": "Against All Odds: The Fisherwoman Who Saved Her Village",
        "narrative": "Maria Santos spent 30 years fishing...",
        "subjectName": "Maria Santos",
        "subjectIdentifier": "fisherwoman, Brazil",
        "theme": "community",
        "sourceUrl": "https://example.com/story",
        "sourceAttribution": "The Guardian",
        "publishDate": "2026-02-23T08:00:00.000Z",
        "scheduledDate": "2026-02-23T08:00:00.000Z",
        "status": "published",
        "commentsEnabled": true,
        "createdAt": "2026-02-01T10:00:00.000Z",
        "updatedAt": "2026-02-23T08:00:00.000Z",
        "featuredImage": {
          "data": {
            "id": 1,
            "attributes": {
              "url": "/uploads/maria_santos_123.jpg",
              "alternativeText": "Maria Santos on her fishing boat"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

## User Roles and Permissions

### Recommended Roles

1. **Editor**: Can create, edit, and schedule stories
   - Create stories
   - Edit own stories
   - Schedule stories
   - Upload media

2. **Reviewer**: Can review and approve stories
   - View all stories
   - Edit all stories
   - Change story status
   - Manage media

3. **Admin**: Full access
   - All permissions
   - User management
   - Settings configuration

### Setting Up Roles

1. Navigate to Settings → Administration Panel → Roles
2. Create new role or edit existing
3. Configure permissions for each content type
4. Assign users to roles

## Database Integration

Strapi creates its own tables in the PostgreSQL database with the `strapi_` prefix:

- `strapi_core_store_settings`
- `strapi_database_schema`
- `strapi_migrations`
- `strapi_webhooks`
- `stories` (your content type)
- `files` (media library)
- `upload_folders`
- And others...

These tables coexist with the main application tables without conflicts.

## Backup and Restore

### Backup Story Content

```bash
# Export all stories to JSON
curl http://localhost:1337/api/stories?pagination[pageSize]=1000 > stories-backup.json
```

### Backup Media Files

```bash
# Copy uploads directory
cp -r cms/public/uploads cms-uploads-backup
```

### Backup Database

```bash
# Backup entire database (includes Strapi tables)
pg_dump -h localhost -U postgres -d hang_in_there -F c -f strapi-backup.dump
```

## Troubleshooting

### Cannot connect to database

**Symptoms**: Error on startup about database connection

**Solutions**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check credentials in `cms/.env`
3. Ensure database exists: `psql -l | grep hang_in_there`
4. Test connection: `psql -h localhost -U postgres -d hang_in_there`

### Admin panel not loading

**Symptoms**: Blank page or 404 error

**Solutions**:
1. Rebuild admin panel: `npm run build`
2. Clear browser cache
3. Check console for JavaScript errors
4. Verify Strapi is running: `curl http://localhost:1337/admin`

### Permission errors

**Symptoms**: Cannot create tables or write files

**Solutions**:
1. Check PostgreSQL user permissions
2. Verify file system permissions on `cms/public/uploads`
3. Run with appropriate user privileges

### Node version mismatch

**Symptoms**: Warnings about unsupported Node version

**Solutions**:
1. Install Node 18.x or 20.x (Strapi 4 requirement)
2. Use nvm to switch versions: `nvm use 20`
3. Verify version: `node --version`

### Build fails

**Symptoms**: Errors during `npm run build`

**Solutions**:
1. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear Strapi cache: `rm -rf .cache build`
3. Check for conflicting dependencies

## Production Deployment

### Security Checklist

- [ ] Generate new secret keys (APP_KEYS, JWT secrets, etc.)
- [ ] Enable database SSL: `DATABASE_SSL=true`
- [ ] Use strong admin passwords
- [ ] Configure CORS for your frontend domain
- [ ] Set up HTTPS/TLS
- [ ] Restrict API permissions appropriately
- [ ] Enable rate limiting
- [ ] Set up regular backups

### Environment Variables for Production

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# Generate new secrets!
APP_KEYS=<generate-new>
API_TOKEN_SALT=<generate-new>
ADMIN_JWT_SECRET=<generate-new>
TRANSFER_TOKEN_SALT=<generate-new>
JWT_SECRET=<generate-new>

# Production database with SSL
POSTGRES_HOST=your-db-host
POSTGRES_PORT=5432
POSTGRES_DB=hang_in_there
POSTGRES_USER=your-user
POSTGRES_PASSWORD=your-secure-password
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true
```

### Running in Production

```bash
# Build for production
NODE_ENV=production npm run build

# Start in production mode
NODE_ENV=production npm start
```

Consider using a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "strapi-cms" -- start
pm2 save
pm2 startup
```

## Integration with Next.js Frontend

The Next.js application will consume the Strapi API. Create an API client in the main app:

```typescript
// lib/strapi.ts
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function getStories(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  const res = await fetch(`${STRAPI_URL}/api/stories?${queryString}`);
  return res.json();
}

export async function getStoryById(id: string) {
  const res = await fetch(`${STRAPI_URL}/api/stories/${id}?populate=featuredImage`);
  return res.json();
}
```

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Content Type Builder](https://docs.strapi.io/user-docs/content-type-builder)
- [Media Library](https://docs.strapi.io/user-docs/media-library)
- [Users & Permissions](https://docs.strapi.io/user-docs/users-roles-permissions)

## Support

For issues specific to this setup, refer to:
- Strapi GitHub: https://github.com/strapi/strapi
- Strapi Discord: https://discord.strapi.io/
- Strapi Forum: https://forum.strapi.io/
