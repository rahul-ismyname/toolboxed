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
    Search,
    Languages,
    Map,
    MousePointer2,
    Keyboard,
    Smartphone,
    Monitor,
    CreditCard,
    AtSign,
    Lock,
    Globe,
    Zap,
    Cpu,
    Database,
    Cloud,
    Layout,
    Box,
    Sparkles,
    Settings,
    Music,
    Video,
    Mic,
    Scissors,
    Layers,
    Move,
    Maximize2,
    Plus,
    Minus,
    Trash2,
    History,
    FileImage,
    FileVideo,
    FileAudio,
    Gamepad2,
    Atom,
    Ratio,
    Tag,
    Workflow,
    Network,
    Columns,
    Accessibility,
    LucideIcon
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
        slug: 'invoice-builder',
        name: 'Professional Invoice & Proposal',
        description: 'Build professional, branded invoices and proposals with live calculations and premium PDF patterns.',
        category: 'Business',
        icon: Receipt,
        path: '/invoice-builder'
    },
    {
        slug: 'bmi-calculator',
        name: 'Advanced BMI Calculator',
        description: 'Professional health analysis with BMI, BMR, and Body Fat calculations.',
        category: 'Health',
        icon: Scale,
        path: '/bmi-calculator'
    },
    {
        slug: 'password-generator',
        name: 'Secure Password Guru',
        description: 'Generate unbreakable passwords with custom security parameters.',
        category: 'Developer',
        icon: Shield,
        path: '/password-generator'
    },
    {
        slug: 'unit-converter',
        name: 'Scientific Unit Converter',
        description: 'Convert any measurement across 50+ categories with live precision.',
        category: 'Utility',
        icon: ArrowRightLeft,
        path: '/unit-converter'
    },
    {
        slug: 'currency-converter',
        name: 'Real-time FX Converter',
        description: 'Global currency conversion with live exchange rates and historical data.',
        category: 'Business',
        icon: DollarSign,
        path: '/currency-converter'
    },
    {
        slug: 'json-formatter',
        name: 'JSON Forge & Validator',
        description: 'Format, validate, and beautify JSON data with deep scanning.',
        category: 'Developer',
        icon: FileJson,
        path: '/json-formatter'
    },
    {
        slug: 'qr-code-generator',
        name: 'Dynamic QR Studio',
        description: 'Create professional, branded QR codes for URLs, WiFi, and more.',
        category: 'Business',
        icon: QrCode,
        path: '/qr-code-generator'
    },
    {
        slug: 'aspect-ratio-calculator',
        name: 'Aspect Ratio Master',
        description: 'Calculate and visualize perfect dimensions for web and social media.',
        category: 'Design',
        icon: Ratio,
        path: '/aspect-ratio-calculator'
    },
    {
        slug: 'image-editor',
        name: 'Visual Image Studio',
        description: 'Crop, rotate, and filter images directly in your browser.',
        category: 'Design',
        icon: Palette,
        path: '/image-editor'
    },
    {
        slug: 'markdown-previewer',
        name: 'MD Evolution Preview',
        description: 'Write and preview GitHub-flavored markdown with professional styling.',
        category: 'Developer',
        icon: FileText,
        path: '/markdown-previewer'
    },
    {
        slug: 'text-converter',
        name: 'Elite Text Processor',
        description: 'Transform text across myriad formats: Case, Base64, Slug and more.',
        category: 'Utility',
        icon: Type,
        path: '/text-converter'
    },
    {
        slug: 'crypto-price-tracker',
        name: 'Crypto Market Pulse',
        description: 'Live cryptocurrency market tracker with real-time price evolution.',
        category: 'Business',
        icon: TrendingUp,
        path: '/crypto-price-tracker'
    },
    {
        slug: 'color-palette-generator',
        name: 'Chroma Design Studio',
        description: 'Generate stunning, harmonious color palettes for your next project.',
        category: 'Design',
        icon: Palette,
        path: '/color-palette-generator'
    },
    {
        slug: 'lorem-ipsum-generator',
        name: 'Professional Text Mock',
        description: 'Generate placeholder text with custom lengths and structures.',
        category: 'Developer',
        icon: AlignLeft,
        path: '/lorem-ipsum-generator'
    },
    {
        slug: 'pomodoro-timer',
        name: 'Deep Focus Engine',
        description: 'Boost productivity with our advanced customizable Pomodoro timer.',
        category: 'Utility',
        icon: Hourglass,
        path: '/pomodoro-timer'
    },
    {
        slug: 'percent-calculator',
        name: 'Percent Master Plus',
        description: 'Solve any percentage problem instantly with interactive logic.',
        category: 'Utility',
        icon: Percent,
        path: '/percent-calculator'
    },
    {
        slug: 'compound-interest-calculator',
        name: 'Wealth Projection Lab',
        description: 'Calculate long-term investment growth with deep compounding logic.',
        category: 'Business',
        icon: Coins,
        path: '/compound-interest-calculator'
    },
    {
        slug: 'loan-calculator',
        name: 'Financial Debt Engine',
        description: 'Comprehensive loan and mortgage analysis with amortization schedules.',
        category: 'Business',
        icon: Landmark,
        path: '/loan-calculator'
    },
    {
        slug: 'stopwatch',
        name: 'Precision Time Keeper',
        description: 'High-precision stopwatch with lap times and visual tracking.',
        category: 'Utility',
        icon: Clock,
        path: '/stopwatch'
    },
    {
        slug: 'world-clock',
        name: 'Global Time Horizon',
        description: 'Monitor time across multiple cities with visual day/night tracking.',
        category: 'Utility',
        icon: Globe,
        path: '/world-clock'
    },
    {
        slug: 'password-strength-checker',
        name: 'Vault Security Auditor',
        description: 'Deep analysis of your password security with entropy calculation.',
        category: 'Developer',
        icon: ShieldCheck,
        path: '/password-strength-checker'
    },
    {
        slug: 'base64-encoder-decoder',
        name: 'Base64 Stream Forge',
        description: 'Encode and decode Base64 data with high-performance stream logic.',
        category: 'Developer',
        icon: Binary,
        path: '/base64-encoder-decoder'
    },
    {
        slug: 'url-encoder-decoder',
        name: 'URL Protocol Studio',
        description: 'Safe encoding and decoding of URLs with parameter analysis.',
        category: 'Developer',
        icon: Link2,
        path: '/url-encoder-decoder'
    },
    {
        slug: 'html-entities-converter',
        name: 'HTML Entity Encoder',
        description: 'Convert special characters to HTML entities and back instantly.',
        category: 'Developer',
        icon: Codesandbox,
        path: '/html-entities-converter'
    },
    {
        slug: 'diff-checker',
        name: 'Logic Stream Diff',
        description: 'Compare text and code to find deep differences in real-time.',
        category: 'Developer',
        icon: Diff,
        path: '/diff-checker'
    },
    {
        slug: 'random-number-generator',
        name: 'Entropy Source Gen',
        description: 'Generate true random numbers within custom ranges and constraints.',
        category: 'Utility',
        icon: Shuffle,
        path: '/random-number-generator'
    },
    {
        slug: 'case-converter',
        name: 'Text Case Harmonizer',
        description: 'Transform text between camelCase, PascalCase, kebab-case and more.',
        category: 'Utility',
        icon: Type,
        path: '/case-converter'
    },
    {
        slug: 'word-counter',
        name: 'Lexical Analysis Kit',
        description: 'Detailed analysis of text: words, characters, and reading time.',
        category: 'Utility',
        icon: AlignLeft,
        path: '/word-counter'
    },
    {
        slug: 'image-to-pdf',
        name: 'Visual PDF Architect',
        description: 'Convert and merge images into professional PDF documents.',
        category: 'Design',
        icon: FileText,
        path: '/image-to-pdf'
    },
    {
        slug: 'image-compressor',
        name: 'Neural Image Shrinker',
        description: 'Compress images with perfect quality-to-size ratio using AI.',
        category: 'Design',
        icon: Maximize,
        path: '/image-compressor'
    },
    {
        slug: 'binary-calculator',
        name: 'Binary Logic Engine',
        description: 'Perform complex arithmetic on binary, octal and hex values.',
        category: 'Developer',
        icon: Binary,
        path: '/binary-calculator'
    },
    {
        slug: 'hex-to-rgb',
        name: 'Color Vector Studio',
        description: 'Convert between HEX, RGB, and HSL with visual feedback.',
        category: 'Design',
        icon: Palette,
        path: '/hex-to-rgb'
    },
    {
        slug: 'css-gradient-generator',
        name: 'Prism Gradient Forge',
        description: 'Design beautiful CSS gradients with advanced visual controls.',
        category: 'Design',
        icon: Wand2,
        path: '/css-gradient-generator'
    },
    {
        slug: 'html-minifier',
        name: 'DOM Stream Shrinker',
        description: 'Minify and optimize HTML code for high-performance delivery.',
        category: 'Developer',
        icon: Codesandbox,
        path: '/html-minifier'
    },
    {
        slug: 'css-minifier',
        name: 'Style Logic Refiner',
        description: 'Optimize CSS files for maximum loading speed and performance.',
        category: 'Developer',
        icon: Palette,
        path: '/css-minifier'
    },
    {
        slug: 'js-minifier',
        name: 'Script Logic Forge',
        description: 'Minify JavaScript code to reduce payload size and speed up execution.',
        category: 'Developer',
        icon: FileJson,
        path: '/js-minifier'
    },
    {
        slug: 'pixel-converter',
        name: 'Fluid Layout Master',
        description: 'Quickly convert between PX, EM, REM and percentage values.',
        category: 'Developer',
        icon: Maximize,
        path: '/pixel-converter'
    },
    {
        slug: 'svg-editor',
        name: 'Vector Logic Studio',
        description: 'Real-time visual editor for SVG graphics and animations.',
        category: 'Design',
        icon: Wand2,
        path: '/svg-editor'
    },
    {
        slug: 'csv-to-json',
        name: 'Data Format Bridge',
        description: 'Convert CSV data to JSON format with custom mapping logic.',
        category: 'Developer',
        icon: FileJson,
        path: '/csv-to-json'
    },
    {
        slug: 'image-resizer',
        name: 'Dimension Architect',
        description: 'Resize images with high precision and multiple aspect ratios.',
        category: 'Design',
        icon: Maximize2,
        path: '/image-resizer'
    },
    {
        slug: 'link-shortener',
        name: 'Clean Link Studio',
        description: 'Create short, clean, and trackable aliases for long URLs.',
        category: 'Utility',
        icon: Link2,
        path: '/link-shortener'
    },
    {
        slug: 'text-statistics',
        name: 'Advanced Text Statistics',
        description: 'Analyze text complexity, readability scores and word frequency.',
        category: 'Utility',
        icon: BarChart3,
        path: '/text-statistics'
    },
    {
        slug: 'mockup-studio',
        name: 'Professional Device Mockup',
        description: 'Create premium device mockups for your SaaS and apps instantly.',
        category: 'Design',
        icon: Monitor,
        path: '/mockup-studio'
    },
    {
        slug: 'barcode-generator',
        name: 'Precision Barcode Gen',
        description: 'Generate professional barcodes in multiple industrial formats.',
        category: 'Business',
        icon: QrCode,
        path: '/barcode-generator'
    },
    {
        slug: 'signature-pad',
        name: 'Legal Signature Studio',
        description: 'Create and export professional hand-drawn digital signatures.',
        category: 'Business',
        icon: Wand2,
        path: '/signature-pad'
    },
    {
        slug: 'css-clip-path',
        name: 'Visual CSS Path Gen',
        description: 'Design complex CSS clip-paths visually with real-time preview.',
        category: 'Developer',
        icon: Scissors,
        path: '/css-clip-path'
    },
    {
        slug: 'meta-tag-generator',
        name: 'Ultimate SEO Architect',
        description: 'Generate high-performance meta tags for search and social media.',
        category: 'Business',
        icon: Tag,
        path: '/meta-tag-generator'
    },
    {
        slug: 'image-pdf-compressor',
        name: 'Ultimate Asset Optimizer',
        description: 'Professional-grade compression for Images and PDFs with AI precision.',
        category: 'Design',
        icon: Maximize,
        path: '/image-pdf-compressor'
    },
    {
        slug: 'advanced-pdf-editor',
        name: 'Pro PDF Workspace',
        description: 'Merge, split, and rotate PDFs directly in your browser with zero server uploads.',
        category: 'Business',
        icon: Layers,
        path: '/advanced-pdf-editor'
    },
    {
        slug: 'video-compressor',
        name: 'HD Video Optimizer',
        description: 'Compress and resize videos with pro-grade quality using on-device FFmpeg power.',
        category: 'Utility',
        icon: Video,
        path: '/video-compressor'
    },
    {
        slug: 'type-racer',
        name: 'Typing Speed Engine',
        description: 'Test and improve your typing speed with real-time lexical tracking.',
        category: 'Utility',
        icon: Keyboard,
        path: '/type-racer'
    },
    {
        slug: 'physics-sim',
        name: 'Universe Sandbox',
        description: '3b1b-style interactive physics and math simulator. Test inertia, acceleration, and complex functions.',
        category: 'Utility',
        icon: Atom,
        path: '/physics-sim'
    },
    {
        slug: 'background-remover',
        name: 'AI Background Remover',
        description: 'Remove backgrounds from images instantly and privately using on-device AI.',
        category: 'Design',
        icon: Wand2,
        path: '/background-remover'
    }
];
