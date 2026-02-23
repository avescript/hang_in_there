# Authentication Quick Reference

## Setup Checklist

- [x] Install NextAuth.js and dependencies
- [x] Configure NextAuth with PostgreSQL adapter
- [x] Implement email/password provider
- [x] Configure Google OAuth provider
- [x] Configure Apple OAuth provider
- [x] Create authentication API routes
- [x] Set up session management
- [ ] Run database migration for password field
- [ ] Configure OAuth providers in their respective consoles
- [ ] Set environment variables

## Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Generate NextAuth secret:

```bash
openssl rand -base64 32
```

### 2. Run Migration

```bash
npm run migrate:up
```

### 3. Start Development Server

```bash
npm run dev
```

## Common Code Patterns

### Protect a Page (Server Component)

```typescript
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/signin');
  }
  
  return <div>Welcome {user.name}</div>;
}
```

### Protect an API Route

```typescript
import { requireAuth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    // Handle authenticated request
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

### Client-Side Auth Check

```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Please sign in</div>;
  
  return <div>Hello {session.user.name}</div>;
}
```

### Sign In Form

```typescript
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      alert('Sign in failed');
    } else {
      window.location.href = '/';
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### Sign Up Form

```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create account
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    
    if (response.ok) {
      // Sign in after successful signup
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
      });
    } else {
      const data = await response.json();
      alert(data.error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password (min 8 characters)"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### OAuth Buttons

```typescript
'use client';

import { signIn } from 'next-auth/react';

export default function OAuthButtons() {
  return (
    <div>
      <button onClick={() => signIn('google', { callbackUrl: '/' })}>
        Sign in with Google
      </button>
      <button onClick={() => signIn('apple', { callbackUrl: '/' })}>
        Sign in with Apple
      </button>
    </div>
  );
}
```

### Sign Out Button

```typescript
'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })}>
      Sign Out
    </button>
  );
}
```

## File Structure

```
app/
├── api/
│   └── auth/
│       ├── [...nextauth]/
│       │   └── route.ts          # NextAuth configuration
│       ├── signup/
│       │   └── route.ts          # Sign up endpoint
│       └── session/
│           └── route.ts          # Session endpoint
├── layout.tsx                    # Root layout with SessionProvider
└── ...

components/
└── SessionProvider.tsx           # Client-side session provider

lib/
├── auth.ts                       # Server-side auth utilities
└── types/
    └── next-auth.d.ts           # TypeScript type extensions

migrations/
└── 1709000000005_add-password-to-users.js  # Password field migration

docs/
├── authentication-setup.md       # Full documentation
└── auth-quick-reference.md      # This file
```

## Environment Variables Reference

```env
# Required
DATABASE_URL=postgresql://user:pass@host:port/db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-32-char-string>

# Optional (for OAuth)
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
APPLE_CLIENT_ID=<from-apple-developer>
APPLE_CLIENT_SECRET=<from-apple-developer>
```

## Testing Endpoints

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Get session
curl http://localhost:3000/api/auth/session
```

## Next Steps

1. Create authentication UI pages (`/auth/signin`, `/auth/signup`)
2. Add password reset functionality
3. Implement email verification
4. Add user profile management
5. Create protected routes and API endpoints

## Related Documentation

- [Full Authentication Setup](./authentication-setup.md)
- [Database Schema](./database-quick-reference.md)
- [NextAuth.js Docs](https://next-auth.js.org/)
