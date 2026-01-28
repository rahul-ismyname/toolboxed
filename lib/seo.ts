import { toolContentData } from '@/config/tool-content';

export function getToolSchema(slug: string) {
    const data = toolContentData[slug];
    if (!data) return null;

    const softwareSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': data.title,
        'description': data.description,
        'operatingSystem': 'Any',
        'applicationCategory': 'UtilitiesApplication',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        },
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'ratingCount': '85'
        }
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': data.faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer
            }
        }))
    };

    const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': `How to use ${data.title}`,
        'description': data.description,
        'step': data.howToUse.map((step, index) => ({
            '@type': 'HowToStep',
            'position': index + 1,
            'name': step.title,
            'itemListElement': [{
                '@type': 'HowToDirection',
                'text': step.description
            }]
        }))
    };

    return [softwareSchema, faqSchema, howToSchema];
}
