# Hang In There 🐱

**Daily Stories of Grit, Grace & Human Connection**

A Progressive Web Application that delivers one curated, verified story each day about real people who demonstrated extraordinary grit, tenacity, and hope.

## Tech Stack

- **Frontend**: React 18 + Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3
- **Database**: PostgreSQL 15
- **Language**: TypeScript (strict mode)
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 15+ (installed and running)

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up the database**

Copy the environment example file and configure your database:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=hang_in_there
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
```

3. **Run database migrations**

```bash
# Option 1: Use the setup script (creates database + runs migrations)
npm run db:setup

# Option 2: Run migrations manually (database must exist)
npm run migrate:up
```

4. **Verify database setup**

```bash
npm run db:check
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

### Database Management

```bash
# Run migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down

# Create new migration
npm run migrate:create my-migration-name

# Check database health
npm run db:check
```

For detailed database documentation, see [DATABASE.md](./DATABASE.md).

## Project Structure

```
hang-in-there/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles
├── components/          # React components (to be added)
├── lib/                 # Utility functions and database connection
│   ├── db.ts           # PostgreSQL connection pool
│   └── types/          # TypeScript type definitions
│       └── database.ts # Database model types
├── migrations/          # Database migration scripts
├── scripts/            # Utility scripts
│   ├── setup-database.sh   # Database setup script
│   └── check-database.js   # Database health check
├── docs/               # Documentation
│   └── database-quick-reference.md
├── public/             # Static assets (to be added)
├── database.json       # Database configuration
├── DATABASE.md         # Database setup guide
└── ...config files
```

## Design Principles

- **Accessibility First**: WCAG 2.1 AA compliance
- **Privacy by Default**: Minimal data collection, GDPR/CCPA compliant
- **Progressive Enhancement**: Core reading experience works without JavaScript
- **Hosting Agnostic**: No vendor-specific APIs

## Color Palette

The application uses a warm color palette:

- **Soft Blues** (Primary): Calming and trustworthy
- **Creams**: Warm and inviting backgrounds
- **Earthy Greens**: Natural and grounding accents

## License

MIT

## Contributing

This project is in active development. More information coming soon.
