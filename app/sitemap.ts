import { MetadataRoute } from 'next';
import { tools } from '@/config/tools';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://toolboxed.online';

    const toolUrls = tools.map((tool) => ({
        url: `${baseUrl}${tool.path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...toolUrls,
    ];
}
