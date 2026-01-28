
import { type LucideIcon, Shield, Zap, WifiOff, FileCode, Search, MousePointerClick } from 'lucide-react';

export interface ComparisonFeature {
    name: string;
    toolboxed: boolean | string;
    competitors: boolean | string;
    icon?: LucideIcon;
}

export interface ComparisonPageData {
    id: string;
    slug: string;
    title: string;
    description: string;
    heroTitle: string;
    heroSubtitle: string;
    relatedToolSlug: string; // To embed the tool
    features: ComparisonFeature[];
    pros: string[];
    cons: string[]; // Competitor cons
    faq: { question: string; answer: string }[];
}

export const comparisonData: ComparisonPageData[] = [
    {
        id: 'json-formatter',
        slug: 'json-formatter-privacy-vs-online-tools',
        title: 'Private JSON Formatter vs Online Tools | Toolboxed',
        description: 'Why you should use a client-side JSON Formatter instead of sending data to a server. Compare privacy, speed, and security.',
        heroTitle: 'Stop sending your data to random servers.',
        heroSubtitle: 'The majority of online JSON formatters process your data on their backend. Toolboxed runs 100% in your browser.',
        relatedToolSlug: 'json-formatter',
        features: [
            {
                name: 'Data Privacy',
                toolboxed: '100% Client-side (Local)',
                competitors: 'Usually Server-side',
                icon: Shield
            },
            {
                name: 'Works Offline',
                toolboxed: true,
                competitors: false,
                icon: WifiOff
            },
            {
                name: 'Performance',
                toolboxed: 'Instant (Zero Latency)',
                competitors: 'Dependent on Network',
                icon: Zap
            },
            {
                name: 'Ads & Tracking',
                toolboxed: 'None',
                competitors: 'Heavy Ad Tracking',
                icon: Search
            }
        ],
        pros: [
            'Your data never leaves your device',
            'Works without an internet connection',
            'No file size limits (depends on your RAM)',
            'Clean, distraction-free interface'
        ],
        cons: [
            'Potential data leaks to third-party servers',
            'Slow processing for large files',
            'Intrusive ads and popups',
            'Requires constant internet connection'
        ],
        faq: [
            {
                question: 'Is my JSON data safe?',
                answer: 'Yes. Unlike other tools, Toolboxed processes everything locally in your browser using JavaScript. No data is ever sent to our servers.'
            },
            {
                question: 'Can I handle large JSON files?',
                answer: 'Absolutely. Since we don\'t have to upload the file, the only limit is your computer\'s memory. We routinely handle 100MB+ files that crash other tools.'
            }
        ]
    }
];
