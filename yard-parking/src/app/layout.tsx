import type { Metadata, Viewport } from 'next';
import { Manrope, Fira_Code } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const siteName = 'Yard Parking';
const siteDescription =
  'Reserve private yard parking a short walk from Raymond James Stadium. Mobile-first booking, QR check-in, and instant confirmation.';
const siteUrl = 'https://yardparking.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s – ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    type: 'website',
    siteName,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yard Parking near Raymond James Stadium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a6eff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${firaCode.variable}`}>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-blue-600 focus:shadow-lg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="min-h-[calc(100vh-240px)]">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
