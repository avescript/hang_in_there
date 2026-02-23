# Authentication Setup Documentation

## Overview

This application uses NextAuth.js v4 for authentication with support for:
- Email/password authentication
- Google OAuth
- Apple OAuth
- PostgreSQL session storage

## Configuration

### Environment Variables

Add the following to your `.env` file (see `.env.example` for template):

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/hang_in_there

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Apple OAuth
APPLE_CLIENT_ID=<your-apple-client-id>
APPLE_CLIENT_SECRET=<your-apple-client-secret>
```

### Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

### Database Migration

Run the password field migration:

```bash
npm run migrate:up
```

This adds the `password` field to the `users` table for email/password authentication.

## OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env`

For production, add: `https://yourdomain.com/api/auth/callback/google`

### Apple OAuth

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create an App ID with Sign in with Apple capability
3. Create a Services ID
4. Configure Sign in with Apple
5. Add redirect URI: `http://localhost:3000/api/auth/callback/apple`
6. Generate a private key
7. Copy Service ID and configure client secret

For production, add: `https://yourdomain.com/api/auth/callback/apple`

## API Routes

### Authentication Endpoints

- `POST /api/auth/signin` - Sign in with credentials or OAuth
- `POST /api/auth/signup` - Create new account with email/password
- `POST /api/auth/signout` - Sign out current user
- `GET /api/auth/session` - Get current session
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/callback/apple` - Apple OAuth callback

### Sign Up

Create a new user account:

```typescript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123',
    name: 'John Doe', // optional
  }),
});

const data = await response.json();
```

### Sign In with Credentials

```typescript
import { signIn } from 'next-auth/react';

const result = await signIn('credentials', {
  email: 'user@example.com',
  password: 'securepassword123',
  redirect: false,
});

if (result?.error) {
  console.error('Sign in failed:', result.error);
} else {
  console.log('Signed in successfully');
}
```

### Sign In with OAuth

```typescript
import { signIn } from 'next-auth/react';

// Google
await signIn('google', { callbackUrl: '/' });

// Apple
await signIn('apple', { callbackUrl: '/' });
```

### Sign Out

```typescript
import { signOut } from 'next-auth/react';

await signOut({ callbackUrl: '/' });
```

### Get Session (Client)

```typescript
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Not signed in</div>;
  }

  return <div>Signed in as {session.user.email}</div>;
}
```

### Get Session (Server)

```typescript
import { getSession, getCurrentUser, requireAuth } from '@/lib/auth';

// In Server Component
async function MyServerComponent() {
  const session = await getSession();
  const user = await getCurrentUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return <div>Hello {user.name}</div>;
}

// In API Route
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(); // Throws if not authenticated
    // ... handle authenticated request
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255), -- Nullable for OAuth-only users
  email_verified BOOLEAN DEFAULT FALSE,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Accounts Table (OAuth)

Stores OAuth provider account information:

```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(50),
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);
```

### Sessions Table

Stores active user sessions:

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
);
```

### Verification Tokens Table

Stores email verification tokens:

```sql
CREATE TABLE verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);
```

## Security Features

### Password Hashing

Passwords are hashed using bcrypt with 10 salt rounds before storage.

### Session Management

- Sessions stored in PostgreSQL
- 30-day session expiration
- Session updated every 24 hours
- Automatic session cleanup on sign out

### Account Linking

OAuth accounts can be linked to existing email accounts using `allowDangerousEmailAccountLinking: true`. This allows users to sign in with multiple providers using the same email.

### CSRF Protection

NextAuth.js includes built-in CSRF protection for all authentication requests.

## Error Handling

### Common Errors

- `Email and password are required` - Missing credentials
- `No user found with this email` - User doesn't exist
- `Invalid password` - Wrong password
- `Please sign in with your OAuth provider` - User registered with OAuth, no password set
- `User with this email already exists` - Email already registered

### Error Responses

All authentication errors return appropriate HTTP status codes:

- `400` - Bad request (validation errors)
- `401` - Unauthorized (authentication failed)
- `409` - Conflict (user already exists)
- `500` - Internal server error

## Testing

### Test User Creation

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  }'
```

### Test Sign In

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### Test Session

```bash
curl http://localhost:3000/api/auth/session \
  -H "Cookie: next-auth.session-token=<session-token>"
```

## Production Considerations

### Environment Variables

- Use strong, randomly generated `NEXTAUTH_SECRET`
- Set `NEXTAUTH_URL` to production domain
- Use HTTPS for all OAuth redirect URIs
- Store secrets securely (e.g., Vercel Environment Variables)

### OAuth Redirect URIs

Update OAuth provider configurations with production URLs:

- Google: `https://yourdomain.com/api/auth/callback/google`
- Apple: `https://yourdomain.com/api/auth/callback/apple`

### Database

- Use connection pooling for production
- Enable SSL for database connections
- Regular backup of user data
- Monitor session table size and cleanup expired sessions

### Security Headers

Configure security headers in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## Troubleshooting

### "Database connection failed"

- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Verify database exists and migrations are run

### "OAuth provider not configured"

- Check OAuth client ID and secret are set
- Verify redirect URIs match in provider console
- Ensure OAuth provider is enabled in provider console

### "Session not persisting"

- Check `NEXTAUTH_SECRET` is set
- Verify cookies are enabled in browser
- Check session table exists in database

### "Password authentication not working"

- Ensure password migration is run
- Check password field exists in users table
- Verify bcrypt is installed

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [PostgreSQL Adapter](https://authjs.dev/reference/adapter/pg)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Setup](https://developer.apple.com/sign-in-with-apple/)
