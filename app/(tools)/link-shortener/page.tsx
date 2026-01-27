import { Metadata } from 'next';
import LinkShortener from '@/components/tools/utility/LinkShortener';
import { ToolContent } from '@/components/tools/ToolContent';

export const metadata: Metadata = {
    title: 'Free Link Shortener | Toolboxed',
    description: 'Shorten long URLs into clean, shareable links. Track clicks and manage your links for free.',
};

export default function LinkShortenerPage() {
    return (
        <>
            <LinkShortener />
            <ToolContent slug="link-shortener" />

            {/* Structured Data for Rich Snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        'name': 'Toolboxed Link Shortener',
                        'applicationCategory': 'UtilityApplication',
                        'operatingSystem': 'Any',
                        'offers': {
                            '@type': 'Offer',
                            'price': '0',
                            'priceCurrency': 'USD'
                        },
                        'description': 'A free, permanent URL shortener with analytics and instant redirects.',
                        'featureList': 'Short Links, Click Tracking, QR Codes, Custom Domains'
                    })
                }}
            />
        </>
    );
}
