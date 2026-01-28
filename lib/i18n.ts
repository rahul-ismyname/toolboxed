import { toolContentData } from '@/config/tool-content';

export function getLocalizedMetadata(slug: string) {
    const data = toolContentData[slug];
    if (!data) return null;

    const { localizedMetadata, title, description } = data;

    // Default English metadata
    const result = {
        title,
        description,
        alternates: {
            languages: {} as Record<string, string>,
        }
    };

    // If we have localized metadata, we can't easily do subpaths yet,
    // but we can append localized keywords to the main title/description 
    // to rank for them in those regions, or just return them for use in generateMetadata.

    return {
        ...result,
        localized: localizedMetadata || {}
    };
}

export function getCombinedTitle(slug: string) {
    const data = toolContentData[slug];
    if (!data) return '';

    const { title, localizedMetadata } = data;
    if (!localizedMetadata) return title;

    // For low-effort, we append the primary localized terms to the title
    // e.g. "BMI Calculator | Calculadora de IMC | बीएमआई कैलकुलेटर"
    const terms = Object.values(localizedMetadata).map(m => m.title.split(' - ')[0].split(' | ')[0]);
    const uniqueTerms = Array.from(new Set(terms)).slice(0, 2); // Take top 2 localizations

    return `${title} | ${uniqueTerms.join(' | ')}`;
}
