import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Chelsea Dental Clinic - Modern Dental Care',
  description: 'Chelsea Dental Clinic provides comprehensive dental services including general dentistry, cosmetic dentistry, orthodontics, implants, and emergency care. Book your appointment today.',
  keywords: ['dental clinic', 'dentist', 'teeth whitening', 'dental implants', 'orthodontics', 'Chelsea', 'London'],
  authors: [{ name: 'Chelsea Dental Clinic' }],
  openGraph: {
    title: 'Chelsea Dental Clinic',
    description: 'Modern dental clinic management system',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
