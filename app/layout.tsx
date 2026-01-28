import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { GoogleAnalytics } from '@/components/providers/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const appUrl = 'https://toolboxed.online';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'Toolboxed - All-in-One Professional Online Utility Tools',
    template: '%s | Toolboxed',
  },
  description: 'Boost your productivity with Toolboxed—a high-performance, secure suite of free online utility tools. Features a BMI calculator, password generator, unit converter, and more developer-centric web utilities.',
  keywords: [
    'online utility tools', 'developer web utilities', 'free productivity tools', 'BMI calculator online',
    'secure password generator', 'currency converter live', 'JSON formatter tool', 'online QR code generator',
    'unit converter web', 'Toolboxed online', 'SaaS productivity suite'
  ],
  authors: [{ name: 'Toolboxed Team' }],
  creator: 'Toolboxed',
  publisher: 'Toolboxed',
  alternates: {
    canonical: './',
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
  verification: {
    google: 'google8bf7740618fe603b',
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Toolboxed',
      'url': appUrl,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${appUrl}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Toolboxed',
      'image': `${appUrl}/og-image.png`,
      'description': 'A suite of high-performance utility tools for developers and creators.',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Any',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': '2840'
      },
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Toolboxed',
      'url': appUrl,
      'logo': `${appUrl}/logo.svg`,
      'sameAs': [
        'https://github.com/rahul-ismyname/toolboxed'
      ]
    }
  ];

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased`}
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
