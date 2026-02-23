import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hang In There - Daily Stories of Grit, Grace & Human Connection',
  description:
    'One curated, verified story each day about real people who demonstrated extraordinary grit, tenacity, and hope.',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-cream-50 text-gray-900">{children}</body>
    </html>
  );
}
