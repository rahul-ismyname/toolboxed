import {
    Calculator,
    FileJson,
    DollarSign,
    Maximize,
    Shield,
    Key,
    TrendingUp,
    QrCode,
    Type,
    Link2,
    Coins,
    Scale,
    Palette,
    Activity,
    Clock,
    ShieldCheck,
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
        slug: 'qr-generator',
        name: 'QR Code Generator',
        description: 'Generate customizable QR codes for URLs, text, and Wi-Fi instanty.',
        category: 'Utility',
        icon: QrCode,
        path: '/qr-generator'
    },
    {
        slug: 'lorem-ipsum',
        name: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text for your designs in paragraphs, sentences, or words.',
        category: 'Developer',
        icon: Type,
        path: '/lorem-ipsum'
    },
    {
        slug: 'url-encoder',
        name: 'URL Encoder / Decoder',
        description: 'Safely encode or decode URLs to handle special characters correctly.',
        category: 'Developer',
        icon: Link2,
        path: '/url-encoder'
    },
    {
        slug: 'currency-converter',
        name: 'Currency Converter',
        description: 'Real-time exchange rates for 150+ global currencies.',
        category: 'Business',
        icon: Coins,
        path: '/currency-converter'
    },
    {
        slug: 'unit-converter',
        name: 'Unit Converter',
        description: 'Convert between Metric and Imperial units for length, weight, and temperature.',
        category: 'Utility',
        icon: Scale,
        path: '/unit-converter'
    },
    {
        slug: 'color-converter',
        name: 'Color Converter',
        description: 'Convert HEX color codes to RGB, HSL, and CMYK formats.',
        category: 'Developer',
        icon: Palette,
        path: '/color-converter'
    },
    {
        slug: 'bmi-calculator',
        name: 'BMI Calculator',
        description: 'Calculate your Body Mass Index and check your health category.',
        category: 'Health',
        icon: Activity,
        path: '/bmi-calculator'
    },
    {
        slug: 'unix-timestamp',
        name: 'Unix Timestamp',
        description: 'Convert between Epoch time and human-readable dates.',
        category: 'Developer',
        icon: Clock,
        path: '/unix-timestamp'
    },
    {
        slug: 'password-generator',
        name: 'Password Generator',
        description: 'Create strong, secure, and random passwords instantly.',
        category: 'Utility',
        icon: ShieldCheck,
        path: '/password-generator'
    },
    {
        slug: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Format, validate, and minify your JSON data.',
        category: 'Developer',
        icon: FileJson,
        path: '/json-formatter'
    },
    {
        slug: 'keto-calc',
        name: 'Keto Calorie Calculator',
        description: 'Scientific macro calculator for Ketogenic diets with specialized inputs.',
        category: 'Health',
        icon: Calculator,
        path: '/keto-calc'
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
    },
    {
        slug: 'roi-calculator',
        name: 'ROI Calculator',
        description: 'Calculate Return on Investment for marketing campaigns or business projects.',
        category: 'Business',
        icon: TrendingUp,
        path: '/roi-calculator'
    }
];
