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
    LucideIcon,
    Brush,
    PieChart,
    Code,
    Film
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
        slug: 'qr-generator',
        name: 'Dynamic QR Studio',
        description: 'Create professional, branded QR codes for URLs, WiFi, and more.',
        category: 'Business',
        icon: QrCode,
        path: '/qr-generator'
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
        slug: 'markdown-previewer',
        name: 'MD Evolution Preview',
        description: 'Write and preview GitHub-flavored markdown with professional styling.',
        category: 'Developer',
        icon: FileText,
        path: '/markdown-previewer'
    },
    {
        slug: 'lorem-ipsum',
        name: 'Professional Text Mock',
        description: 'Generate placeholder text with custom lengths and structures.',
        category: 'Developer',
        icon: AlignLeft,
        path: '/lorem-ipsum'
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
        slug: 'percentage-calculator',
        name: 'Percent Master Plus',
        description: 'Solve any percentage problem instantly with interactive logic.',
        category: 'Utility',
        icon: Percent,
        path: '/percentage-calculator'
    },
    {
        slug: 'compound-interest',
        name: 'Wealth Projection Lab',
        description: 'Calculate long-term investment growth with deep compounding logic.',
        category: 'Business',
        icon: Coins,
        path: '/compound-interest'
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
        slug: 'stopwatch-timer',
        name: 'Precision Time Keeper',
        description: 'High-precision stopwatch with lap times and visual tracking.',
        category: 'Utility',
        icon: Clock,
        path: '/stopwatch-timer'
    },
    {
        slug: 'base64',
        name: 'Base64 Stream Forge',
        description: 'Encode and decode Base64 data with high-performance stream logic.',
        category: 'Developer',
        icon: Binary,
        path: '/base64'
    },
    {
        slug: 'url-converter',
        name: 'URL Protocol Studio',
        description: 'Safe encoding and decoding of URLs with parameter analysis.',
        category: 'Developer',
        icon: Link2,
        path: '/url-converter'
    },
    {
        slug: 'html-entities',
        name: 'HTML Entity Encoder',
        description: 'Convert special characters to HTML entities and back instantly.',
        category: 'Developer',
        icon: Codesandbox,
        path: '/html-entities'
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
        slug: 'image-pdf-compressor',
        name: 'Ultimate Asset Optimizer',
        description: 'Professional-grade compression for Images and PDFs with AI precision.',
        category: 'Design',
        icon: Maximize,
        path: '/image-pdf-compressor'
    },
    {
        slug: 'pix-rem',
        name: 'Fluid Layout Master',
        description: 'Quickly convert between PX, EM, REM and percentage values.',
        category: 'Developer',
        icon: Maximize,
        path: '/pix-rem'
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
        slug: 'json-to-csv',
        name: 'JSON to CSV Converter',
        description: 'Transform structured data into spreadsheets effortlessly.',
        category: 'Developer',
        icon: FileJson,
        path: '/json-to-csv'
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
        description: '3b1b-style interactive physics and math simulator.',
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
    },
    {
        slug: 'age-calculator',
        name: 'Precise Age Calculator',
        description: 'Calculate your exact age in years, months, days, minutes, and seconds.',
        category: 'Utility',
        icon: Calendar,
        path: '/age-calculator'
    },
    {
        slug: 'animated-patterns',
        name: 'CSS Pattern Animator',
        description: 'Create mesmerizing, looped animated backgrounds with CSS.',
        category: 'Design',
        icon: Sparkles,
        path: '/animated-patterns'
    },
    {
        slug: 'api-playground',
        name: 'REST API Playground',
        description: 'Test API endpoints with a clean, powerful interface.',
        category: 'Developer',
        icon: Zap,
        path: '/api-playground'
    },
    {
        slug: 'base-converter',
        name: 'Radix Base Converter',
        description: 'Convert numbers between Binary, Octal, Decimal, and Hexadecimal.',
        category: 'Developer',
        icon: Hash,
        path: '/base-converter'
    },
    {
        slug: 'bmr-calculator',
        name: 'BMR Health Monitor',
        description: 'Calculate your Basal Metabolic Rate and daily calorie needs.',
        category: 'Health',
        icon: Activity,
        path: '/bmr-calculator'
    },
    {
        slug: 'box-shadow-generator',
        name: 'CSS Shadow Generator',
        description: 'Create layered, smooth box-shadows for modern web design.',
        category: 'Design',
        icon: Layers,
        path: '/box-shadow-generator'
    },
    {
        slug: 'code-playground',
        name: 'Live Code Sandbox',
        description: 'Write and execute HTML, CSS, and JS in real-time.',
        category: 'Developer',
        icon: Code,
        path: '/code-playground'
    },
    {
        slug: 'color-converter',
        name: 'Color Format Bridge',
        description: 'Convert between HEX, RGB, HSL, and CMYK instantly.',
        category: 'Design',
        icon: Palette,
        path: '/color-converter'
    },
    {
        slug: 'family-spending-analyzer',
        name: 'Family Budget Tracker',
        description: 'Track and analyze household expenses with visual charts.',
        category: 'Business',
        icon: PieChart,
        path: '/family-spending-analyzer'
    },
    {
        slug: 'freelance-rate',
        name: 'Freelance Rate Calc',
        description: 'Calculate your ideal hourly rate based on expenses and goals.',
        category: 'Business',
        icon: DollarSign,
        path: '/freelance-rate'
    },
    {
        slug: 'glassmorphism-generator',
        name: 'Glassmorphism Studio',
        description: 'Generate frosted glass effects with CSS backdrop-filter.',
        category: 'Design',
        icon: Layout,
        path: '/glassmorphism-generator'
    },
    {
        slug: 'jwt-decoder',
        name: 'JWT Debugger',
        description: 'Decode and inspect JSON Web Tokens without verification.',
        category: 'Developer',
        icon: Key,
        path: '/jwt-decoder'
    },
    {
        slug: 'keto-calc',
        name: 'Keto Diet Calculator',
        description: 'Calculate macronutrients for a ketogenic lifestyle.',
        category: 'Health',
        icon: Activity,
        path: '/keto-calc'
    },
    {
        slug: 'mermaid-visualizer',
        name: 'Mermaid Diagram Preview',
        description: 'Render Mermaid.js diagrams from text definitions instantly.',
        category: 'Developer',
        icon: Workflow,
        path: '/mermaid-visualizer'
    },
    {
        slug: 'morse-code',
        name: 'Morse Code Translator',
        description: 'Translate text to Morse code and play the audio.',
        category: 'Utility',
        icon: Radio,
        path: '/morse-code'
    },
    {
        slug: 'paint-app',
        name: 'Paint App',
        description: 'Create masterpieces directly in your browser with digital art tools.',
        category: 'Design',
        icon: Brush,
        path: '/paint-app'
    },
    {
        slug: 'placeholder-generator',
        name: 'Placeholder Image Gen',
        description: 'Create custom placeholder images with specific dimensions and colors.',
        category: 'Design',
        icon: Image,
        path: '/placeholder-generator'
    },
    {
        slug: 'privacy-policy-gen',
        name: 'Privacy Policy Maker',
        description: 'Generate standard privacy policies for your apps and websites.',
        category: 'Business',
        icon: ShieldCheck,
        path: '/privacy-policy-gen'
    },
    {
        slug: 'random-choice',
        name: 'Random Choice Maker',
        description: 'Let fate decide with a fun, animated picker.',
        category: 'Utility',
        icon: Shuffle,
        path: '/random-choice'
    },
    {
        slug: 'regex-tester',
        name: 'RegEx Lab',
        description: 'Test and debug regular expressions with live highlighting.',
        category: 'Developer',
        icon: Search,
        path: '/regex-tester'
    },
    {
        slug: 'roi-calculator',
        name: 'ROI Analyzer',
        description: 'Calculate Return on Investment for marketing campaigns.',
        category: 'Business',
        icon: TrendingUp,
        path: '/roi-calculator'
    },
    {
        slug: 'sales-tax',
        name: 'Sales Tax Calculator',
        description: 'Calculate final price including sales tax/VAT.',
        category: 'Business',
        icon: Receipt,
        path: '/sales-tax'
    },
    {
        slug: 'sql-formatter',
        name: 'SQL Beautifier',
        description: 'Format and beautify SQL queries for better readability.',
        category: 'Developer',
        icon: Database,
        path: '/sql-formatter'
    },
    {
        slug: 'stickman-animator',
        name: 'Stickman Animator',
        description: 'Create simple stickman animations and export them.',
        category: 'Design',
        icon: Film,
        path: '/stickman-animator'
    },
    {
        slug: 'time-block-planner',
        name: 'Time Block Planner',
        description: 'Plan your day using the time-blocking productivity method.',
        category: 'Utility',
        icon: Calendar,
        path: '/time-block-planner'
    },
    {
        slug: 'unix-timestamp',
        name: 'Unix Timestamp Converter',
        description: 'Convert between Unix timestamps and human-readable dates.',
        category: 'Developer',
        icon: Clock,
        path: '/unix-timestamp'
    },
    {
        slug: 'uuid-generator',
        name: 'UUID/GUID Generator',
        description: 'Generate version 4 UUIDs (Universally Unique Identifiers).',
        category: 'Developer',
        icon: Fingerprint,
        path: '/uuid-generator'
    },
    {
        slug: 'pdf-master',
        name: 'PDF Master Studio',
        description: 'Merge, split, protect, and sign PDFs entirely in your browser.',
        category: 'Utility',
        icon: FileText,
        path: '/pdf-master'
    },
    {
        slug: 'css-gradient-generator',
        name: 'CSS Gradient Generator',
        description: 'Create beautiful linear and radial gradients visually and copy the CSS instantly.',
        category: 'Design',
        icon: Palette,
        path: '/css-gradient-generator'
    }
];
