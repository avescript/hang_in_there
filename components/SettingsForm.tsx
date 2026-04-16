'use client';

import { useState, FormEvent } from 'react';

export interface UserSettings {
  notification_enabled: boolean;
  notification_time: string;
  timezone: string;
  theme_filters: string[];
  streak_visible: boolean;
}

const THEMES = ['grit', 'love', 'community', 'environment', 'balance', 'care'] as const;

interface SettingsFormProps {
  initialSettings: UserSettings;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleTheme = (theme: string) => {
    setSettings((prev) => ({
      ...prev,
      theme_filters: prev.theme_filters.includes(theme)
        ? prev.theme_filters.filter((t) => t !== theme)
        : [...prev.theme_filters, theme],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMsg('');

    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Notifications */}
      <section aria-labelledby="notifications-heading">
        <h2 id="notifications-heading" className="text-lg font-semibold text-earth-900 mb-4">
          Notifications
        </h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notification_enabled}
              onChange={(e) => setSettings({ ...settings, notification_enabled: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-earth-800">Enable daily story notifications</span>
          </label>

          {settings.notification_enabled && (
            <div>
              <label htmlFor="notification-time" className="block text-sm font-medium text-earth-700 mb-1">
                Notification time
              </label>
              <input
                id="notification-time"
                type="time"
                value={settings.notification_time}
                onChange={(e) => setSettings({ ...settings, notification_time: e.target.value })}
                className="px-3 py-2 border border-cream-300 rounded-lg text-earth-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      </section>

      {/* Theme filters */}
      <section aria-labelledby="themes-heading">
        <h2 id="themes-heading" className="text-lg font-semibold text-earth-900 mb-1">
          Theme filters
        </h2>
        <p className="text-sm text-earth-600 mb-4">
          Select themes you want to see. Leave all unchecked to see every theme.
        </p>
        <fieldset>
          <legend className="sr-only">Story themes</legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEMES.map((theme) => (
              <label key={theme} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.theme_filters.includes(theme)}
                  onChange={() => toggleTheme(theme)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-earth-800 capitalize">{theme}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {/* Streak visibility */}
      <section aria-labelledby="streak-heading">
        <h2 id="streak-heading" className="text-lg font-semibold text-earth-900 mb-4">
          Reading streak
        </h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.streak_visible}
            onChange={(e) => setSettings({ ...settings, streak_visible: e.target.checked })}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="text-earth-800">Show reading streak counter</span>
        </label>
      </section>

      {/* Feedback */}
      {status === 'success' && (
        <p role="status" className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          Settings saved.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'saving' ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  );
}
