import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const appUrl = 'https://toolboxed.online';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'Toolboxed - Professional Utility Tools',
    template: '%s | Toolboxed',
  },
  description: 'Boost your productivity with Toolboxed—a high-performance suite of free utility tools. Features a BMI calculator, secure password generator, currency converter, JSON formatter, and developer-centric utilities.',
  keywords: [
    'utility tools', 'developer tools', 'free online tools', 'calculator', 'converter',
    'json formatter', 'bmi calculator online', 'qr code generator', 'currency converter live',
    'unix timestamp converter', 'secure password generator', 'color converter', 'unit converter'
  ],
  authors: [{ name: 'Toolboxed Team' }],
  creator: 'Toolboxed',
  publisher: 'Toolboxed',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    title: 'Toolboxed | Free Professional Utility Tools for Everyone',
    description: 'Fast, secure, and free online tools for developers, creators, and professionals. From calculators to converters, all in one place.',
    siteName: 'Toolboxed',
    images: [{
      url: `${appUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'Toolboxed - Professional Utility Tools',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolboxed | Professional Utility Tools',
    description: 'The ultimate suite of free, high-performance web utilities. Secure, fast, and easy to use.',
    images: [`${appUrl}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Toolboxed',
    image: `${appUrl}/og-image.png`,
    description: 'A suite of high-performance utility tools for developers and creators.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
