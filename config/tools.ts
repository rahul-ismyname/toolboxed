import {
    Calculator,
    FileJson,
    DollarSign,
    Maximize,
    Shield,
    LucideIcon
} from 'lucide-react';

export type ToolCategory = 'Health' | 'Developer' | 'Business' | 'Utility';

export interface Tool {
    slug: string;
    name: string;
    description: string;
    category: ToolCategory;
    icon: LucideIcon;
    path: string;
}

export const tools: Tool[] = [
    {
        slug: 'keto-calc',
        name: 'Keto Calorie Calculator',
        description: 'Scientific macro calculator for Ketogenic diets with specialized inputs.',
        category: 'Health',
        icon: Calculator,
        path: '/keto-calc'
    },
    {
        slug: 'json-tool',
        name: 'JSON Formatter',
        description: 'Validate, prettify, and minify your JSON data instantly.',
        category: 'Developer',
        icon: FileJson,
        path: '/json-tool'
    },
    {
        slug: 'freelance-rate',
        name: 'Freelance Rate Calculator',
        description: 'Determine your ideal hourly rate based on income goals and overhead.',
        category: 'Business',
        icon: DollarSign,
        path: '/freelance-rate'
    },
    {
        slug: 'pix-rem',
        name: 'Pixel to Rem Converter',
        description: 'Convert PX to REM values for modern responsive web development.',
        category: 'Developer',
        icon: Maximize,
        path: '/pix-rem'
    },
    {
        slug: 'privacy-policy-gen',
        name: 'Privacy Policy Generator',
        description: 'Create standard privacy policies for your apps and websites.',
        category: 'Utility',
        icon: Shield,
        path: '/privacy-policy-gen'
    }
];
