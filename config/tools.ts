import {
    Calculator,
    FileJson,
    DollarSign,
    Maximize,
    Shield,
    Key,
    TrendingUp,
    QrCode,
    Coins,
    Scale,
    Palette,
    Activity,
    Clock,
    ShieldCheck,
    FileText,
    Binary,
    Calendar,
    Landmark,
    Percent,
    Eye,
    Wand2,
    Diff,
    Receipt,
    Image,
    Codesandbox,
    Flame,
    Type,
    Link2,
    AlignLeft,
    Hourglass,
    ArrowRightLeft,
    Radio,
    Shuffle,
    BarChart3,
    Hash,
    Fingerprint,
    Lock,
    Ratio,
    Scissors,
    Tag,
    PenTool,
    Layers,
    ImagePlus,
    Timer,
    LucideIcon,
    Wallet,
    Database,
    ScanSearch,
    Workflow,
    Layout,
    Network,
    Columns
} from 'lucide-react';

export type ToolCategory = 'Health' | 'Developer' | 'Business' | 'Utility' | 'Design';


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
        slug: 'landing-page-builder',
        name: 'Visual Landing Page Builder',
        description: 'Design professional SaaS landing pages visually and export the code instantly.',
        category: 'Business',
        icon: Layout,
        path: '/landing-page-builder'
    },
    {
        slug: 'mind-map',
        name: 'Mind Map Builder',
        description: 'Infinite canvas for brainstorming, planning, and organizing ideas.',
        category: 'Design',
        icon: Network,
        path: '/mind-map'
    },
    {
        slug: 'kanban-board',
        name: 'Project Kanban Board',
        description: 'Manage tasks and projects with a drag-and-drop sticky board.',
        category: 'Business',
        icon: Columns,
        path: '/kanban-board'
    },
    {
        slug: 'resume-builder',
        name: 'Ultimate Resume Builder',
        description: 'Build professional, ATS-friendly resumes with live preview and PDF export.',
        category: 'Business',
        icon: FileText,
        path: '/resume-builder'
    },
    {
        slug: 'sql-formatter',
        name: 'SQL Formatter',
        description: 'Beautify and validate SQL queries for multiple dialects (MySQL, Postgres, etc).',
        category: 'Developer',
        icon: Database,
        path: '/sql-formatter'
    },
    {
        slug: 'regex-tester',
        name: 'RegEx Tester',
        description: 'Test and debug regular expressions with real-time highlighting.',
        category: 'Developer',
        icon: ScanSearch,
        path: '/regex-tester'
    },
    {
        slug: 'mermaid-visualizer',
        name: 'Mermaid Visualizer',
        description: 'Create flowcharts, sequence diagrams, and more with text.',
        category: 'Design',
        icon: Workflow,
        path: '/mermaid-visualizer'
    },
    {
        slug: 'box-shadow-generator',
        name: 'Box Shadow Generator',
        description: 'Create layered, smooth CSS box-shadows with a visual editor.',
        category: 'Design',
        icon: Layers,
        path: '/box-shadow-generator'
    },
    {
        slug: 'image-converter',
        name: 'Image Converter & Compressor',
        description: 'Convert and compress images (WebP, PNG, JPG) to reduce file size.',
        category: 'Utility',
        icon: ImagePlus,
        path: '/image-converter'
    },
    {
        slug: 'pomodoro-timer',
        name: 'Pomodoro Timer',
        description: 'Stay focused with customizable 25-minute work intervals.',
        category: 'Health',
        icon: Timer,
        path: '/pomodoro-timer'
    },
    {
        slug: 'css-clip-path',
        name: 'CSS Clip Path Generator',
        description: 'Create complex shapes and polygons with interactive CSS clip-path builder.',
        category: 'Design',
        icon: Scissors,
        path: '/css-clip-path'
    },
    {
        slug: 'meta-tag-generator',
        name: 'Meta Tag Generator',
        description: 'Generate SEO and Social Media meta tags with live Google/Facebook preview.',
        category: 'Developer',
        icon: Tag,
        path: '/meta-tag-generator'
    },
    {
        slug: 'signature-pad',
        name: 'Digital Signature Pad',
        description: 'Draw, save, and download your digital signature as transparent PNG.',
        category: 'Business',
        icon: PenTool,
        path: '/signature-pad'
    },
    {
        slug: 'uuid-generator',
        name: 'UUID Generator',
        description: 'Generate version 1, 3, 4, and 5 UUIDs instantly with bulk options.',
        category: 'Developer',
        icon: Fingerprint,
        path: '/uuid-generator'
    },
    {
        slug: 'jwt-decoder',
        name: 'JWT Decoder',
        description: 'Decode and inspect JSON Web Tokens (headers, payload, signature).',
        category: 'Developer',
        icon: Lock,
        path: '/jwt-decoder'
    },
    {
        slug: 'aspect-ratio-calculator',
        name: 'Aspect Ratio Calculator',
        description: 'Calculate dimensions and ratios for images, video, and screens.',
        category: 'Design',
        icon: Ratio,
        path: '/aspect-ratio-calculator'
    },
    {
        slug: 'stopwatch-timer',
        name: 'Stopwatch & Timer',
        description: 'Track time with high-precision stopwatch or countdown timer.',
        category: 'Utility',
        icon: Hourglass,
        path: '/stopwatch-timer'
    },
    {
        slug: 'json-to-csv',
        name: 'JSON to CSV',
        description: 'Convert JSON arrays to CSV format and download as Spreadsheet.',
        category: 'Developer',
        icon: ArrowRightLeft,
        path: '/json-to-csv'
    },
    {
        slug: 'sales-tax',
        name: 'Sales Tax Calculator',
        description: 'Calculate sales tax, GST, or VAT for any transaction.',
        category: 'Business',
        icon: Receipt,
        path: '/sales-tax'
    },
    {
        slug: 'case-converter',
        name: 'Case Converter',
        description: 'Transform text into UPPERCASE, lowercase, Title Case, and more.',
        category: 'Utility',
        icon: Type,
        path: '/case-converter'
    },
    {
        slug: 'url-converter',
        name: 'URL Encoder / Decoder',
        description: 'Safely encode and decode URLs and query parameters.',
        category: 'Developer',
        icon: Link2,
        path: '/url-converter'
    },
    {
        slug: 'lorem-ipsum',
        name: 'Lorem Ipsum Generator',
        description: 'Generate custom placeholder text for your designs and layouts.',
        category: 'Utility',
        icon: AlignLeft,
        path: '/lorem-ipsum'
    },
    {
        slug: 'placeholder-generator',
        name: 'Image Placeholder',
        description: 'Generate custom dummy image URLs for your web prototypes.',
        category: 'Utility',
        icon: Image,
        path: '/placeholder-generator'
    },
    {
        slug: 'html-entities',
        name: 'HTML Entities',
        description: 'Safely encode and decode HTML special characters.',
        category: 'Developer',
        icon: Codesandbox,
        path: '/html-entities'
    },
    {
        slug: 'bmr-calculator',
        name: 'BMR Calculator',
        description: 'Calculate your metabolic rate and daily calorie needs.',
        category: 'Health',
        icon: Flame,
        path: '/bmr-calculator'
    },
    {
        slug: 'loan-calculator',
        name: 'Loan / EMI Calculator',
        description: 'Calculate monthly payments and total interest for any loan or mortgage.',
        category: 'Business',
        icon: Landmark,
        path: '/loan-calculator'
    },
    {
        slug: 'glassmorphism-generator',
        name: 'Glassmorphism Generator',
        description: 'Create beautiful frosted-glass UI effects with auto-generated CSS.',
        category: 'Developer',
        icon: Wand2,
        path: '/glassmorphism-generator'
    },
    {
        slug: 'diff-checker',
        name: 'Text Diff Checker',
        description: 'Compare two blocks of text side-by-side and highlight differences.',
        category: 'Developer',
        icon: Diff,
        path: '/diff-checker'
    },
    {
        slug: 'markdown-previewer',
        name: 'Markdown Previewer',
        description: 'Live side-by-side markdown editor and real-time previewer.',
        category: 'Developer',
        icon: Eye,
        path: '/markdown-previewer'
    },
    {
        slug: 'percentage-calculator',
        name: 'Percentage Calculator',
        description: 'Solve any percentage problem: increases, decreases, and ratios.',
        category: 'Utility',
        icon: Percent,
        path: '/percentage-calculator'
    },
    {
        slug: 'color-converter-new',
        name: 'Color Converter',
        description: 'Advanced HEX, RGB, and HSL color conversion with visual picker.',
        category: 'Developer',
        icon: Palette,
        path: '/color-converter'
    },
    {
        slug: 'base64',
        name: 'Base64 Encoder / Decoder',
        description: 'Convert text to Base64 and vice versa with instant client-side processing.',
        category: 'Developer',
        icon: Binary,
        path: '/base64'
    },
    {
        slug: 'age-calculator',
        name: 'Age Calculator',
        description: 'Calculate your exact age in years, months, and days instantly.',
        category: 'Utility',
        icon: Calendar,
        path: '/age-calculator'
    },
    {
        slug: 'compound-interest',
        name: 'Compound Interest',
        description: 'Visualize the power of exponential growth on your investments.',
        category: 'Business',
        icon: Landmark,
        path: '/compound-interest'
    },
    {
        slug: 'qr-generator',
        name: 'QR Code Generator',
        description: 'Generate customizable QR codes for URLs, text, and Wi-Fi instanty.',
        category: 'Utility',
        icon: QrCode,
        path: '/qr-generator'
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
        slug: 'word-counter',
        name: 'Word Counter',
        description: 'Check word, character, sentence, and paragraph counts instantly.',
        category: 'Utility',
        icon: FileText,
        path: '/word-counter'
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
    },
    {
        slug: 'morse-code',
        name: 'Morse Code Converter',
        description: 'Convert text to Morse code and back with real-time audio playback.',
        category: 'Utility',
        icon: Radio,
        path: '/morse-code'
    },
    {
        slug: 'base-converter',
        name: 'Base Converter',
        description: 'Instant conversion between Binary, Decimal, Hex, and Octal bases.',
        category: 'Developer',
        icon: Hash,
        path: '/base-converter'
    },
    {
        slug: 'random-choice',
        name: 'Random Choice Maker',
        description: 'Pick a random item from a list with a fun shuffle animation.',
        category: 'Utility',
        icon: Shuffle,
        path: '/random-choice'
    },
    {
        slug: 'text-statistics',
        name: 'Advanced Text Statistics',
        description: 'Analyze reading time, character frequency, and readability scores.',
        category: 'Utility',
        icon: BarChart3,
        path: '/text-statistics'
    },
    {
        slug: 'family-spending-analyzer',
        name: 'Family Spending Analyzer',
        description: 'Track income, expenses, and analyze family budget with PDF/CSV export.',
        category: 'Business',
        icon: Wallet,
        path: '/family-spending-analyzer'
    },
    {
        slug: 'paint-app',
        name: 'Paint App',
        description: 'A full-featured digital canvas for sketching and drawing.',
        category: 'Design',
        icon: Palette,
        path: '/paint-app'
    }
];
