'use client';

import { useEffect, useState } from 'react';

interface StreakBadgeProps {
  streakVisible: boolean;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
}

export default function StreakBadge({ streakVisible }: StreakBadgeProps) {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!streakVisible) {
      setLoading(false);
      return;
    }
    fetch('/api/user/streak')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch streak');
        return res.json() as Promise<StreakData>;
      })
      .then((data) => setStreak(data))
      .catch(() => setStreak(null))
      .finally(() => setLoading(false));
  }, [streakVisible]);

  if (!streakVisible) return null;
  if (loading) {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-100 rounded-full text-sm animate-pulse"
        aria-label="Loading streak"
      >
        <span>🔥</span>
        <span className="w-4 h-4 bg-cream-300 rounded" aria-hidden="true" />
      </div>
    );
  }
  if (!streak) return null;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-100 rounded-full text-sm font-medium text-earth-800"
      title={`Longest streak: ${streak.longestStreak} day${streak.longestStreak !== 1 ? 's' : ''}`}
      aria-label={`Reading streak: ${streak.currentStreak} day${streak.currentStreak !== 1 ? 's' : ''}`}
    >
      <span aria-hidden="true">🔥</span>
      <span>{streak.currentStreak}</span>
    </div>
  );
}
