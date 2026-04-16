'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { signIn } from 'next-auth/react';

interface AuthModalProps {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onModeChange: (mode: 'signin' | 'signup') => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  general?: string;
}

export default function AuthModal({ mode, onClose, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus trap and Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstFocusableRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          setErrors({ general: data.error || 'Sign up failed. Please try again.' });
          return;
        }
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ general: 'Invalid email or password.' });
      } else {
        onClose();
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-earth-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Close button */}
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-earth-500 hover:text-earth-800 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2
          id="auth-modal-title"
          className="text-2xl font-bold text-earth-900 mb-2"
        >
          {mode === 'signin' ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="text-earth-600 mb-6 text-sm">
          {mode === 'signin'
            ? 'Sign in to save stories and track your streak.'
            : 'Join to save stories and track your reading streak.'}
        </p>

        {/* OAuth buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-cream-300 rounded-lg text-earth-800 font-medium hover:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => signIn('apple')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-cream-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-earth-500">or continue with email</span>
          </div>
        </div>

        {/* Credentials form */}
        <form onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.general}
            </div>
          )}

          {mode === 'signup' && (
            <div className="mb-4">
              <label htmlFor="auth-name" className="block text-sm font-medium text-earth-800 mb-1">
                Full name
              </label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'auth-name-error' : undefined}
                className={`w-full px-3 py-2 border rounded-lg text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.name ? 'border-red-400' : 'border-cream-300'}`}
                placeholder="Your name"
              />
              {errors.name && (
                <p id="auth-name-error" role="alert" className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="auth-email" className="block text-sm font-medium text-earth-800 mb-1">
              Email address
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'auth-email-error' : undefined}
              className={`w-full px-3 py-2 border rounded-lg text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-400' : 'border-cream-300'}`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="auth-email-error" role="alert" className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="auth-password" className="block text-sm font-medium text-earth-800">
                Password
              </label>
              {mode === 'signin' && (
                <a
                  href="/auth/forgot-password"
                  className="text-xs text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'auth-password-error' : undefined}
              className={`w-full px-3 py-2 border rounded-lg text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-red-400' : 'border-cream-300'}`}
              placeholder={mode === 'signup' ? 'At least 8 characters' : ''}
            />
            {errors.password && (
              <p id="auth-password-error" role="alert" className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-earth-600">
          {mode === 'signin' ? (
            <>
              No account?{' '}
              <button
                type="button"
                onClick={() => onModeChange('signup')}
                className="text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onModeChange('signin')}
                className="text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
