import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const appUrl = 'https://toolboxed.online';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'Toolboxed - Professional Utility Tools',
    template: '%s | Toolboxed',
  },
  description: 'A suite of high-performance utility tools for developers and creators. Free calculators, converters, and generators.',
  keywords: ['utility tools', 'developer tools', 'calculator', 'converter', 'json formatter', 'b2b tools'],
  authors: [{ name: 'Toolboxed Team' }],
  creator: 'Toolboxed',
  publisher: 'Toolboxed',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    title: 'Toolboxed - Professional Utility Tools',
    description: 'Boost your productivity with our suite of free, high-performance developer and business tools.',
    siteName: 'Toolboxed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolboxed - Utility Micro-Tools',
    description: 'Free, fast, and secure utility tools for everyone.',
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
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-white text-slate-900 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
