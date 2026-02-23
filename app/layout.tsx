import type { Metadata, Viewport } from 'next';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';

export const metadata: Metadata = {
  title: 'Hang In There - Daily Stories of Grit, Grace & Human Connection',
  description:
    'One curated, verified story each day about real people who demonstrated extraordinary grit, tenacity, and hope.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hang In There',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192x192.svg',
    apple: '/icons/icon-192x192.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6B9AC4', // Soft blue matching PWA theme
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-cream-50 text-gray-900">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
