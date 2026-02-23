import 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session types to include user ID
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }

  /**
   * Extends the built-in user types
   */
  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    emailVerified?: boolean | null;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT types
   */
  interface JWT {
    id: string;
  }
}
