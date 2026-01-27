'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export function GoogleAnalytics() {
    // Access environment variable
    const gaId = process.env.NEXT_PUBLIC_GA_ID;

    // Log a warning in development if missing (helpful for debugging)
    useEffect(() => {
        if (!gaId && process.env.NODE_ENV === 'development') {
            console.warn('Google Analytics: NEXT_PUBLIC_GA_ID is missing');
        }
    }, [gaId]);

    // Don't render anything if no ID is present
    if (!gaId) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
            </Script>
        </>
    );
}
