import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Providers from './providers';
import { Navigation } from '@/components/Navigation';
import { AppInitializer } from '@/components/AppInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PulseFit AI - Your Personal Workout Companion',
  description: 'Get personalized AI-powered workout plans, track your progress, and achieve your fitness goals with our intelligent fitness companion.',
  keywords: ['fitness', 'AI', 'workout', 'exercise', 'health', 'training', 'personal trainer'],
  authors: [{ name: 'PulseFit AI Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0284c7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AppInitializer>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </AppInitializer>
        </Providers>
      </body>
    </html>
  );
}