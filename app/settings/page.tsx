import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import SettingsForm, { UserSettings } from '@/components/SettingsForm';

const DEFAULT_SETTINGS: UserSettings = {
  notification_enabled: false,
  notification_time: '08:00',
  timezone: 'UTC',
  theme_filters: [],
  streak_visible: true,
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/');
  }

  let settings: UserSettings = DEFAULT_SETTINGS;

  try {
    const result = await query<{
      notification_enabled: boolean;
      notification_time: string;
      timezone: string;
      theme_filters: string[] | null;
      streak_visible: boolean;
    }>('SELECT * FROM user_settings WHERE user_id = $1', [user.id]);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      // notification_time may come back as HH:MM:SS from postgres TIME type
      const rawTime = row.notification_time ?? '08:00';
      const notificationTime = rawTime.length > 5 ? rawTime.slice(0, 5) : rawTime;
      settings = {
        notification_enabled: row.notification_enabled,
        notification_time: notificationTime,
        timezone: row.timezone,
        theme_filters: row.theme_filters ?? [],
        streak_visible: row.streak_visible,
      };
    }
  } catch {
    // DB unavailable — use defaults
  }

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-earth-900 mb-8">Settings</h1>
      <SettingsForm initialSettings={settings} />
    </main>
  );
}
