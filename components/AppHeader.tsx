'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import AuthModal from './AuthModal';
import Image from 'next/image';

export default function AppHeader() {
  const { data: session, status } = useSession();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openSignIn = () => {
    setAuthMode('signin');
    setShowAuth(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-cream-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo / Wordmark */}
          <a
            href="/"
            className="text-lg font-bold text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors"
          >
            Hang In There
          </a>

          {/* Archive nav link */}
          <a
            href="/archive"
            className="text-sm text-earth-700 hover:text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors"
          >
            Archive
          </a>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {status === 'loading' ? (
              <div className="h-8 w-20 bg-cream-100 rounded-lg animate-pulse" aria-hidden="true" />
            ) : session?.user ? (
              <>
                <a
                  href="/saved"
                  className="text-sm text-earth-700 hover:text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors"
                >
                  Saved
                </a>
                <a
                  href="/settings"
                  className="text-sm text-earth-700 hover:text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors"
                >
                  Settings
                </a>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-earth-600 hover:text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors"
                >
                  Sign out
                </button>
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User avatar'}
                    width={32}
                    height={32}
                    className="rounded-full border border-cream-200"
                  />
                ) : (
                  <span
                    className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold"
                    aria-hidden="true"
                  >
                    {(session.user.name ?? session.user.email ?? '?')[0].toUpperCase()}
                  </span>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={openSignIn}
                className="px-4 py-1.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onModeChange={setAuthMode}
        />
      )}
    </>
  );
}
