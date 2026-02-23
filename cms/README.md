# Hang In There - Strapi CMS

This directory contains the Strapi 4 headless CMS for managing story content.

## Setup

### 1. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update the database credentials to match your PostgreSQL setup.

### 2. Build the Admin Panel

```bash
npm run build
```

### 3. Start Strapi

Development mode (with auto-reload):
```bash
npm run develop
```

Production mode:
```bash
npm start
```

The admin panel will be available at `http://localhost:1337/admin`

## First Time Setup

1. When you first access the admin panel, you'll be prompted to create an admin user
2. Fill in your details to create the first administrator account
3. Log in with your new credentials

## Story Content Type

The Story content type has been pre-configured with the following fields:

- **headline** (string, required): Story headline (max 12 words)
- **narrative** (text, required): Story narrative (250-400 words)
- **subjectName** (string, required): Name of the story subject
- **subjectIdentifier** (string, required): Brief identifier (e.g., "fisherwoman, Brazil")
- **theme** (enum, required): One of: grit, love, community, environment, balance, care
- **sourceUrl** (string, required): URL to the original source
- **sourceAttribution** (string, required): Attribution text for the source
- **publishDate** (datetime): When the story was published
- **scheduledDate** (datetime, required): When the story should be published
- **status** (enum, required): One of: draft, scheduled, published (default: draft)
- **featuredImage** (media): Optional featured image
- **commentsEnabled** (boolean, required): Whether comments are enabled (default: true)

## Editorial Workflow

1. **Create Story**: Create a new story in draft status
2. **Write/Edit**: Fill in all required fields
3. **Schedule**: Set the scheduledDate and change status to "scheduled"
4. **Publish**: A cron job will automatically publish stories when their scheduledDate arrives

## API Access

The Strapi API is available at `http://localhost:1337/api`

### Get All Stories
```
GET /api/stories
```

### Get Single Story
```
GET /api/stories/:id
```

### Filter by Status
```
GET /api/stories?filters[status][$eq]=published
```

### Filter by Theme
```
GET /api/stories?filters[theme][$eq]=grit
```

## Media Library

Featured images are stored in the `public/uploads` directory. The media library is accessible through the Strapi admin panel.

## Database

Strapi uses the same PostgreSQL database as the main application. It creates its own tables with the `strapi_` prefix to avoid conflicts.

## Security Notes

- Change all secret keys in `.env` before deploying to production
- Use strong passwords for admin accounts
- Enable SSL for database connections in production
- Restrict API access using Strapi's built-in permissions system

## Troubleshooting

### Cannot connect to database
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure the database exists

### Admin panel not loading
- Run `npm run build` to rebuild the admin panel
- Clear browser cache
- Check console for errors

### Permission errors
- Ensure your PostgreSQL user has CREATE TABLE privileges
- Check Strapi logs in the console

## Documentation

- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi Content Type Builder](https://docs.strapi.io/user-docs/content-type-builder)
- [Strapi API Reference](https://docs.strapi.io/dev-docs/api/rest)
