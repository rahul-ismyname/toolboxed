'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Layout, Type, Image as ImageIcon, MousePointer2, Move, CreditCard,
    MessageSquare, HelpCircle, Phone, Code, Eye, Monitor, Smartphone,
    Laptop, Settings2, Plus, Trash2, ArrowUp, ArrowDown, ChevronUp,
    ChevronDown, Layers, Box, Check, Copy, X, LayoutTemplate,
    AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

// --- TYPES ---

type SectionType = 'hero' | 'features' | 'pricing' | 'stats' | 'testimonials' | 'faq' | 'cta' | 'footer' | 'logos';

interface LandingSection {
    id: string;
    type: SectionType;
    data: any;
    style?: {
        bg?: string;
        padding?: string;
        textAlign?: 'left' | 'center' | 'right';
        textColor?: string;
    };
}

interface GlobalSettings {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    borderRadius: string; // '0px', '4px', '8px', '9999px'
    metaTitle?: string;
    metaDescription?: string;
}

const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
    primaryColor: '#2563eb', // blue-600
    secondaryColor: '#475569', // slate-600
    backgroundColor: '#ffffff',
    textColor: '#0f172a', // slate-900
    fontFamily: 'font-sans',
    borderRadius: '1rem', // rounded-2xl
};

const FONTS = [
    { label: 'Inter (Sans)', value: 'font-sans' },
    { label: 'Roboto (Sans)', value: 'font-mono' }, // Using mono as placeholder for distinct look
    { label: 'Merriweather (Serif)', value: 'font-serif' },
];

// --- TEMPLATES ---

const TEMPLATES = [
    {
        id: 'saas',
        label: 'SaaS Launch',
        description: 'Modern, high-conversion layout for software products.',
        settings: {
            primaryColor: '#2563eb', // Blue
            secondaryColor: '#64748b', // Slate
            backgroundColor: '#ffffff',
            textColor: '#0f172a',
            fontFamily: 'font-sans',
            borderRadius: '0.5rem',
            metaTitle: 'Launch Your SaaS - The Best Platform',
            metaDescription: 'Start building your dream software today with our powerful platform.'
        },
        sections: [
            { id: 't1-hero', type: 'hero', data: { title: 'Ship your SaaS in days, not months', subtitle: 'The ultimate boilerplate for React developers. Includes authentication, payments, and database setup.', primaryBtn: 'Get Started', secondaryBtn: 'Live Demo', alignment: 'center', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop' }, style: { padding: 'py-32' } },
            { id: 't1-logos', type: 'logos', data: { title: 'Trusted by innovative teams', logos: ['https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'] }, style: { padding: 'py-12', bg: 'bg-slate-50' } },
            { id: 't1-features', type: 'features', data: { title: 'Everything you need to scale', items: [{ title: 'Authentication', desc: 'Secure user login and registration.' }, { title: 'Database', desc: 'Postgres database with Prisma ORM.' }, { title: 'Payments', desc: 'Stripe integration ready to go.' }] }, style: { padding: 'py-24' } },
            { id: 't1-stats', type: 'stats', data: { items: [{ label: 'Developers', value: '10,000+' }, { label: 'Time Saved', value: '500hrs' }, { label: 'Revenue', value: '$2M+' }] }, style: { padding: 'py-20', bg: 'bg-slate-900', textColor: '#ffffff' } },
            { id: 't1-pricing', type: 'pricing', data: { title: 'Simple Pricing', plans: [{ name: 'Starter', price: '$29', features: ['Core features', '5 Projects', 'Community Support'], cta: 'Start Free' }, { name: 'Pro', price: '$99', features: ['Everything in Starter', 'Unlimited Projects', 'Priority Support'], cta: 'Go Pro', popular: true }] }, style: { padding: 'py-24' } },
            { id: 't1-cta', type: 'cta', data: { title: 'Ready to launch?', subtitle: 'Join thousands of developers building the future.', btn: 'Get Access Now' }, style: { padding: 'py-24' } },
            { id: 't1-footer', type: 'footer', data: { text: '© 2026 SaaS Inc. All rights reserved.', links: ['Twitter', 'GitHub', 'Discord'] }, style: { padding: 'py-12', bg: 'bg-slate-50' } }
        ] as LandingSection[]
    },
    {
        id: 'mobile',
        label: 'Mobile App',
        description: 'Clean, vibrant showcase for iOS and Android apps.',
        settings: {
            primaryColor: '#8b5cf6', // Violet
            secondaryColor: '#c4b5fd',
            backgroundColor: '#0f172a', // Dark Mode default
            textColor: '#f8fafc', // Light text
            fontFamily: 'font-sans',
            borderRadius: '1rem',
            metaTitle: 'Download Our New App',
            metaDescription: 'Experience the future of mobile productivity.'
        },
        sections: [
            { id: 't2-hero', type: 'hero', data: { title: 'Your life, organized.', subtitle: 'The most intuitive productivity app ever made. Available now on iOS and Android.', primaryBtn: 'Download for iOS', secondaryBtn: 'Get on Play Store', alignment: 'center', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop' }, style: { padding: 'py-32' } },
            { id: 't2-features', type: 'features', data: { title: 'Why users love us', items: [{ title: 'Dark Mode', desc: 'Easy on the eyes, day or night.' }, { title: 'Cloud Sync', desc: 'Access your data from anywhere.' }, { title: 'Offline First', desc: 'Works perfectly without internet.' }] }, style: { padding: 'py-24', bg: 'bg-transparent' } },
            { id: 't2-testimonials', type: 'testimonials', data: { title: '5-Star Reviews', items: [{ name: 'Jane Doe', role: 'Designer', quote: 'I literally cannot live without this app anymore.', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' }, { name: 'John Smith', role: 'CEO', quote: 'The interface is stunning and smooth.', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' }] }, style: { padding: 'py-24', bg: 'bg-slate-800' } },
            { id: 't2-faq', type: 'faq', data: { title: 'Questions?', items: [{ q: 'Is it free?', a: 'Yes, with optional premium features.' }, { q: 'Does it work on iPad?', a: 'Yes, fully optimized for tablets.' }] }, style: { padding: 'py-24' } },
            { id: 't2-footer', type: 'footer', data: { text: '© 2026 App Co.', links: ['Press', 'Support', 'Privacy'] }, style: { padding: 'py-8' } }
        ] as LandingSection[]
    },
    {
        id: 'portfolio',
        label: 'Personal Portfolio',
        description: 'Minimalist and classy, perfect for freelancers.',
        settings: {
            primaryColor: '#10b981', // Emerald
            secondaryColor: '#34d399',
            backgroundColor: '#ffffff',
            textColor: '#334155', // Slate 700
            fontFamily: 'font-serif', // Merriweather
            borderRadius: '0px', // Sharp
            metaTitle: 'My Portfolio - Designer & Developer',
            metaDescription: 'Showcase of my latest work and projects.'
        },
        sections: [
            { id: 't3-hero', type: 'hero', data: { title: 'Hello, I\'m Alex.', subtitle: 'A digital product designer and creative director based in NYC.', primaryBtn: 'View Work', secondaryBtn: 'Contact Me', alignment: 'left', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop' }, style: { padding: 'py-40' } },
            { id: 't3-stats', type: 'stats', data: { items: [{ label: 'Years Exp', value: '08' }, { label: 'Projects', value: '140+' }, { label: 'Awards', value: '12' }] }, style: { padding: 'py-16', bg: 'bg-slate-50' } },
            { id: 't3-features', type: 'features', data: { title: 'My Expertise', items: [{ title: 'UI/UX Design', desc: 'Crafting intuitive digital experiences.' }, { title: 'Brand Identity', desc: 'Building memorable visual systems.' }, { title: 'Development', desc: 'Bringing designs to life with React.' }] }, style: { padding: 'py-32' } },
            { id: 't3-cta', type: 'cta', data: { title: 'Let\'s work together', subtitle: 'Currently accepting new projects for Q3 2026.', btn: 'Email Me' }, style: { padding: 'py-32' } },
            { id: 't3-footer', type: 'footer', data: { text: 'Designed & Built by Alex.', links: ['Dribbble', 'LinkedIn', 'Instagram'] }, style: { padding: 'py-12' } }
        ] as LandingSection[]
    }
];


const DEFAULT_SECTIONS: LandingSection[] = [
    {
        id: 'hero-1',
        type: 'hero',
        data: {
            title: 'Build faster with our premium components',
            subtitle: 'The ultimate toolkit for modern web developers. Create stunning landing pages in minutes.',
            primaryBtn: 'Get Started',
            secondaryBtn: 'View Demo',
            alignment: 'center'
        }
    },
    {
        id: 'features-1',
        type: 'features',
        data: {
            title: 'Everything you need',
            items: [
                { title: 'Lightning Fast', desc: 'Optimized for speed and performance.' },
                { title: 'Fully Responsive', desc: 'Looks great on any device.' },
                { title: 'Modern Design', desc: 'Sleek and professional aesthetics.' }
            ]
        }
    }
];

export function LandingPageBuilder() {
    const [sections, setSections] = useState<LandingSection[]>(DEFAULT_SECTIONS);
    const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS);
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [showGlobalSettings, setShowGlobalSettings] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [copied, setCopied] = useState(false);

    // --- ACTIONS ---

    const addSection = (type: SectionType) => {
        const newSection: LandingSection = {
            id: `section-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type,
            data: getInitialData(type),
            style: { bg: 'bg-transparent', padding: 'py-20' }
        };
        setSections([...sections, newSection]);
        setActiveSectionId(newSection.id);
    };

    const removeSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
        if (activeSectionId === id) setActiveSectionId(null);
    };

    const moveSection = (id: string, dir: number) => {
        const idx = sections.findIndex(s => s.id === id);
        if ((dir === -1 && idx === 0) || (dir === 1 && idx === sections.length - 1)) return;
        const newSections = [...sections];
        const temp = newSections[idx];
        newSections[idx] = newSections[idx + dir];
        newSections[idx + dir] = temp;
        setSections(newSections);
    };

    const updateSectionData = (id: string, partial: Partial<LandingSection>) => {
        setSections(sections.map(s => {
            if (s.id !== id) return s;
            // If 'data' is present in partial, merge it with existing data
            const newData = partial.data ? { ...s.data, ...partial.data } : s.data;
            // If 'style' is present in partial, merge it with existing style
            const newStyle = partial.style ? { ...s.style, ...partial.style } : s.style;

            return {
                ...s,
                ...partial,
                data: newData,
                style: newStyle
            };
        }));
    };

    const getInitialData = (type: SectionType) => {
        const baseStyle = { bg: 'bg-transparent', padding: 'py-20', textAlign: 'center' };

        switch (type) {
            case 'hero': return {
                title: 'Build faster with our premium components',
                subtitle: 'The ultimate toolkit for modern web developers. Create stunning landing pages in minutes.',
                primaryBtn: 'Get Started',
                secondaryBtn: 'View Demo',
                image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
                alignment: 'center'
            };
            case 'features': return {
                title: 'Everything you need',
                items: [
                    { title: 'Lightning Fast', desc: 'Optimized for speed and performance.' },
                    { title: 'Fully Responsive', desc: 'Looks great on any device.' },
                    { title: 'Modern Design', desc: 'Sleek and professional aesthetics.' }
                ]
            };
            case 'pricing': return {
                title: 'Pricing Plans',
                plans: [
                    { name: 'Starter', price: '$19', features: ['Feature A', 'Feature B'], cta: 'Get Started' },
                    { name: 'Pro', price: '$49', features: ['All Starter features', 'Unlimited projects'], cta: 'Upgrade Now', popular: true }
                ]
            };
            case 'testimonials': return {
                title: 'Trusted by Developers',
                items: [
                    { name: 'Alex Johnson', role: 'CTO at TechCorp', quote: 'This tool saved us weeks of development time. Highly recommended!', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                    { name: 'Sarah Smith', role: 'Freelancer', quote: 'The best landing page builder I have ever used. Simple and powerful.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
                ]
            };
            case 'logos': return {
                title: 'Trusted by industry leaders',
                logos: [
                    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
                    'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
                    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
                    'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg'
                ]
            };
            case 'faq': return {
                title: 'Frequently Asked Questions',
                items: [
                    { q: 'Is this free to use?', a: 'Yes, this tool is completely free and open source.' },
                    { q: 'Can I export the code?', a: 'Absolutely! You can export clean React/Tailwind code instantly.' }
                ]
            };
            case 'cta': return { title: 'Ready to transform your workflow?', subtitle: 'Join 10,000+ developers building with our platform.', btn: 'Get Started for Free' };
            case 'stats': return { items: [{ label: 'Active Users', value: '10k+' }, { label: 'Countries', value: '50+' }, { label: 'Revenue', value: '$1M+' }] };
            case 'footer': return { text: '© 2026 Your Company. All rights reserved.', links: ['Privacy', 'Terms', 'Contact'] };
            default: return { title: 'New Section' };
        }
    };

    // --- RENDERERS ---

    const renderPreview = () => {
        return (
            <div
                style={{
                    width: viewMode === 'mobile' ? '375px' : viewMode === 'tablet' ? '768px' : '100%',
                    transition: 'width 0.3s ease',
                    '--bg-color': globalSettings.backgroundColor,
                    '--text-color': globalSettings.textColor,
                    '--primary-color': globalSettings.primaryColor,
                    '--radius': globalSettings.borderRadius,
                } as React.CSSProperties}
                className={`bg-[var(--bg-color)] text-[var(--text-color)] shadow-2xl transition-all duration-300 min-h-[800px] ${viewMode !== 'desktop' ? 'rounded-[3rem] border-8 border-slate-800 overflow-hidden' : 'rounded-xl'}`}
            >
                {sections.map(section => (
                    <div
                        key={section.id}
                        onClick={() => { setActiveSectionId(section.id); setShowGlobalSettings(false); }}
                        className={`relative group ${activeSectionId === section.id ? 'ring-2 ring-blue-500 z-10' : 'hover:ring-1 hover:ring-blue-300'}`}
                    >
                        <SectionRenderer section={section} />

                        {/* Section Overlay Actions */}
                        <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, -1); }} className="p-1.5 bg-white shadow-lg border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronUp size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 1); }} className="p-1.5 bg-white shadow-lg border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronDown size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); removeSection(section.id); }} className="p-1.5 bg-white shadow-lg border border-slate-200 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };


    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-[800px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            {/* Sidebar Left: Components & Blocks */}
            <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                        <Layers size={18} className="text-blue-500" />
                        Sections
                    </h3>
                </div>
                <div className="p-4 flex flex-col gap-2 overflow-y-auto">
                    {(['hero', 'features', 'pricing', 'stats', 'testimonials', 'faq', 'cta', 'footer'] as SectionType[]).map(type => (
                        <button
                            key={type}
                            onClick={() => addSection(type)}
                            className="flex items-center gap-3 p-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                        >
                            <div className="w-10 h-10 flex-shrink-0 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                {type === 'hero' && <Monitor size={16} />}
                                {type === 'features' && <Box size={16} />}
                                {type === 'pricing' && <Check size={16} />}
                                {type === 'cta' && <Plus size={16} />}
                                {type === 'logos' && <Layers size={16} />}
                                {(type !== 'hero' && type !== 'features' && type !== 'pricing' && type !== 'cta' && type !== 'logos') && <Layers size={16} />}
                            </div>
                            <span className="capitalize">{type}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Canvas Toolbar */}
                <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white dark:bg-slate-700 shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Laptop size={18} /></button>
                        <button onClick={() => setViewMode('tablet')} className={`p-1.5 rounded-md transition-all ${viewMode === 'tablet' ? 'bg-white dark:bg-slate-700 shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Laptop size={18} className="rotate-90" /></button>
                        <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white dark:bg-slate-700 shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Smartphone size={18} /></button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button
                                onClick={() => setShowTemplates(true)}
                                className={`p-2 rounded-lg transition-all ${showTemplates ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Templates"
                            >
                                <LayoutTemplate size={18} />
                            </button>
                            <div className="w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                            <button
                                onClick={() => setShowGlobalSettings(true)}
                                className={`p-2 rounded-lg transition-all ${showGlobalSettings ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Global Settings"
                            >
                                <Settings2 size={18} />
                            </button>
                        </div>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <button
                            onClick={() => setIsPreviewing(true)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                        >
                            <Monitor size={16} />
                            Preview
                        </button>
                        <button
                            onClick={() => setIsExporting(true)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                            <Code size={16} />
                            Get Code
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto scrollbar-hide bg-slate-100/50 dark:bg-slate-950/50">
                    {renderPreview()}
                </div>
            </div>

            {/* Sidebar Right: Active Section Props */}
            <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                        <Settings2 size={18} className="text-blue-500" />
                        Settings
                    </h3>
                </div>

                <div className="p-6 flex flex-col gap-6 overflow-y-auto">

                    {showGlobalSettings ? (
                        <div className="animate-in slide-in-from-right-4 duration-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-lg">Global Theme</h3>
                                <button onClick={() => setShowGlobalSettings(false)} className="text-xs font-bold text-blue-600 hover:underline">Close</button>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <label className="text-xs font-bold text-slate-400 mb-3 block uppercase tracking-wider">Page Metadata (SEO)</label>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">Page Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. My Awesome Landing Page"
                                                value={globalSettings.metaTitle || ''}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, metaTitle: e.target.value })}
                                                className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">Description</label>
                                            <textarea
                                                rows={3}
                                                placeholder="Brief description for search engines..."
                                                value={globalSettings.metaDescription || ''}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, metaDescription: e.target.value })}
                                                className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-800 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-2 block">Brand Colors</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-4 h-4 rounded-full shadow border border-slate-200" style={{ backgroundColor: globalSettings.primaryColor }} />
                                                <span className="text-xs font-bold">Primary</span>
                                            </div>
                                            <input
                                                type="color"
                                                value={globalSettings.primaryColor}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, primaryColor: e.target.value })}
                                                className="w-full h-8 cursor-pointer rounded-lg overflow-hidden border-0 p-0"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-4 h-4 rounded-full shadow border border-slate-200" style={{ backgroundColor: globalSettings.secondaryColor }} />
                                                <span className="text-xs font-bold">Secondary</span>
                                            </div>
                                            <input
                                                type="color"
                                                value={globalSettings.secondaryColor}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, secondaryColor: e.target.value })}
                                                className="w-full h-8 cursor-pointer rounded-lg overflow-hidden border-0 p-0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-2 block">Base Colors</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-4 h-4 rounded-full shadow border border-slate-200" style={{ backgroundColor: globalSettings.backgroundColor }} />
                                                <span className="text-xs font-bold">Background</span>
                                            </div>
                                            <input
                                                type="color"
                                                value={globalSettings.backgroundColor}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, backgroundColor: e.target.value })}
                                                className="w-full h-8 cursor-pointer rounded-lg overflow-hidden border-0 p-0"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-4 h-4 rounded-full shadow border border-slate-200" style={{ backgroundColor: globalSettings.textColor }} />
                                                <span className="text-xs font-bold">Text</span>
                                            </div>
                                            <input
                                                type="color"
                                                value={globalSettings.textColor}
                                                onChange={(e) => setGlobalSettings({ ...globalSettings, textColor: e.target.value })}
                                                className="w-full h-8 cursor-pointer rounded-lg overflow-hidden border-0 p-0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-2 block">Typography</label>
                                    <select
                                        value={globalSettings.fontFamily}
                                        onChange={(e) => setGlobalSettings({ ...globalSettings, fontFamily: e.target.value })}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
                                    >
                                        {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-2 block">Component Roundness</label>
                                    <select
                                        value={globalSettings.borderRadius}
                                        onChange={(e) => setGlobalSettings({ ...globalSettings, borderRadius: e.target.value })}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
                                    >
                                        <option value="0px">Sharp (0px)</option>
                                        <option value="0.25rem">Slight (4px)</option>
                                        <option value="0.5rem">Soft (8px)</option>
                                        <option value="1rem">Friendly (16px)</option>
                                        <option value="9999px">Pill (Full)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : activeSectionId ? (
                        <div className="animate-in fade-in slide-in-from-right-2 duration-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-lg capitalize">{sections.find(s => s.id === activeSectionId)?.type} Section</h3>
                                <button onClick={() => removeSection(activeSectionId)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete Section">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <SectionEditor
                                section={sections.find(s => s.id === activeSectionId)!}
                                onUpdate={(data) => updateSectionData(activeSectionId, data)}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <Layers size={32} className="mx-auto mb-4 opacity-20" />
                            <p className="text-sm">Select a section on the canvas to edit its properties</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Templates Modal */}
            {showTemplates && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                                <h3 className="text-xl font-black dark:text-white">Choose a Template</h3>
                                <p className="text-sm text-slate-500">Kickstart your project with a professionally designed layout.</p>
                            </div>
                            <button onClick={() => setShowTemplates(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {TEMPLATES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            if (window.confirm('This will overwrite your current page. Are you sure?')) {
                                                setSections(JSON.parse(JSON.stringify(t.sections))); // Deep copy
                                                setGlobalSettings(t.settings);
                                                setShowTemplates(false);
                                                setActiveSectionId(null);
                                            }
                                        }}
                                        className="group relative flex flex-col items-start text-left p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 hover:ring-4 hover:ring-blue-500/10 transition-all shadow-sm hover:shadow-xl"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            {t.id === 'saas' && <Monitor size={24} />}
                                            {t.id === 'mobile' && <Smartphone size={24} />}
                                            {t.id === 'portfolio' && <LayoutTemplate size={24} />}
                                        </div>
                                        <h4 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{t.label}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">{t.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {isExporting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold dark:text-white">Generated Component</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generateCode(sections, globalSettings));
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy JSX'}
                                </button>
                                <button onClick={() => setIsExporting(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">Close</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-6 bg-slate-950 font-mono text-sm text-slate-300">
                            <pre>{generateCode(sections, globalSettings)}</pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Screen Preview */}
            {isPreviewing && (
                <div className="fixed inset-0 z-[5000] bg-white overflow-y-auto overscroll-contain">
                    <div className="min-h-screen relative" style={{
                        '--bg-color': globalSettings.backgroundColor,
                        '--text-color': globalSettings.textColor,
                        '--primary-color': globalSettings.primaryColor,
                        '--radius': globalSettings.borderRadius,
                        fontFamily: globalSettings.fontFamily === 'font-serif' ? 'Merriweather, serif' : globalSettings.fontFamily === 'font-mono' ? 'Roboto Mono, monospace' : 'Inter, sans-serif'
                    } as React.CSSProperties}>
                        <div className={`bg-[var(--bg-color)] text-[var(--text-color)] min-h-screen ${globalSettings.fontFamily} pb-32 flex flex-col w-full`}>
                            {sections.map(section => (
                                <SectionRenderer key={section.id} section={section} />
                            ))}
                        </div>
                    </div>

                    {/* Floating Close Button */}
                    <button
                        onClick={() => setIsPreviewing(false)}
                        className="fixed bottom-8 right-8 px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-2xl hover:scale-105 transition-all z-[5001] flex items-center gap-2 border border-slate-700 hover:bg-black"
                    >
                        <X size={20} />
                        Exit Preview
                    </button>
                </div>
            )}
        </div>
    );
}

// --- SUB-COMPONENTS ---

function SectionRenderer({ section }: { section: LandingSection }) {
    const { data, style } = section;

    // Default styles if not set
    const s = {
        bg: style?.bg?.startsWith('bg-') ? style.bg : (!style?.bg ? 'bg-transparent' : ''),
        padding: style?.padding?.startsWith('py-') ? style.padding : (!style?.padding ? 'py-24' : ''),
        textAlign: style?.textAlign === 'left' ? 'text-left' : style?.textAlign === 'right' ? 'text-right' : 'text-center',
        flexAlign: style?.textAlign === 'left' ? 'justify-start' : style?.textAlign === 'right' ? 'justify-end' : 'justify-center',
    };

    // Custom inline overrides
    const customStyle = {
        backgroundColor: style?.bg && !style.bg.startsWith('bg-') ? style.bg : undefined,
        paddingTop: style?.padding && !style.padding.startsWith('py-') ? style.padding : undefined,
        paddingBottom: style?.padding && !style.padding.startsWith('py-') ? style.padding : undefined,
        ...((style?.textColor) ? { color: style.textColor } : {})
    };

    // Helper for common dynamic styles
    const primaryStyle = { backgroundColor: 'var(--primary-color)', color: '#ffffff', borderRadius: 'var(--radius)' };
    const secondaryStyle = {
        backgroundColor: 'transparent',
        borderColor: 'var(--text-color)',
        color: 'var(--text-color)',
        borderRadius: 'var(--radius)',
        borderWidth: '1px',
        opacity: 0.8
    };
    const shapeStyle = { borderRadius: 'var(--radius)' };

    switch (section.type) {
        case 'hero':
            return (
                <div className={`${s.padding} px-8 ${s.bg} ${data.alignment === 'center' ? 'text-center' : 'text-left'} transition-all relative overflow-hidden`} style={customStyle}>
                    <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
                        <div className="max-w-4xl">
                            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight whitespace-pre-wrap tracking-tight" style={{ color: 'var(--text-color)' }}>
                                {data.title}
                            </h1>
                            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap opacity-80" style={{ color: 'var(--text-color)' }}>
                                {data.subtitle}
                            </p>
                            <div className={`flex flex-wrap gap-4 ${data.alignment === 'center' ? 'justify-center' : 'justify-start'} mb-16`}>
                                <button className="px-8 py-4 font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all" style={primaryStyle}>
                                    {data.primaryBtn}
                                </button>
                                {data.secondaryBtn && (
                                    <button className="px-8 py-4 font-black text-lg hover:opacity-100 transition-all" style={secondaryStyle}>
                                        {data.secondaryBtn}
                                    </button>
                                )}
                            </div>
                        </div>
                        {data.image && (
                            <div className="w-full max-w-5xl overflow-hidden shadow-2xl border-4 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800" style={{ borderRadius: 'calc(var(--radius) + 8px)' }}>
                                <img src={data.image} alt="Hero" className="w-full h-auto" />
                            </div>
                        )}
                    </div>
                </div>
            );
        case 'features':
            return (
                <div className={`${s.padding} px-8 ${s.bg}`} style={customStyle}>
                    <h2 className={`text-3xl font-black mb-16 ${s.textAlign}`} style={{ color: 'var(--text-color)' }}>{data.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.items.map((item: any, i: number) => (
                            <div key={i} className="p-8 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all" style={shapeStyle}>
                                <div className={`w-12 h-12 mb-6 flex items-center justify-center text-white`} style={{ ...primaryStyle, borderRadius: 'calc(var(--radius) - 4px)' }}>
                                    <Box size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>{item.title}</h3>
                                <p className="opacity-70 leading-relaxed" style={{ color: 'var(--text-color)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'pricing':
            return (
                <div className={`${s.padding} px-8 ${s.bg}`} style={customStyle}>
                    <h2 className={`text-4xl font-black mb-16 ${s.textAlign}`} style={{ color: 'var(--text-color)' }}>{data.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {data.plans.map((plan: any, i: number) => (
                            <div key={i} className={`p-10 border-2 transition-all relative ${plan.popular ? 'border-transparent shadow-2xl scale-105' : 'border-slate-100 dark:border-slate-800'}`}
                                style={{
                                    borderRadius: 'var(--radius)',
                                    borderColor: plan.popular ? 'var(--primary-color)' : ''
                                }}>
                                {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: 'var(--primary-color)' }}>Most Popular</span>}
                                <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--text-color)' }}>{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-black" style={{ color: 'var(--text-color)' }}>{plan.price}</span>
                                    <span className="opacity-60" style={{ color: 'var(--text-color)' }}>/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((f: string, j: number) => (
                                        <li key={j} className="flex items-center gap-3 opacity-80" style={{ color: 'var(--text-color)' }}>
                                            <Check size={16} className="text-emerald-500" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-4 font-bold transition-all" style={plan.popular ? primaryStyle : { ...secondaryStyle, backgroundColor: 'transparent' }}>
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'cta':
            return (
                <div className={`${s.padding} px-8 ${s.bg} transition-all`} style={customStyle}>
                    <div className="p-12 text-center text-white shadow-2xl shadow-blue-500/20" style={{ backgroundColor: 'var(--primary-color)', borderRadius: 'var(--radius)' }}>
                        <h2 className="text-4xl font-black mb-6" style={{ color: '#ffffff' }}>{data.title}</h2>
                        <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto" style={{ color: '#ffffff' }}>{data.subtitle}</p>
                        <button className="px-10 py-4 bg-white text-slate-900 font-black text-lg hover:scale-105 transition-all" style={{ borderRadius: 'var(--radius)', color: 'var(--primary-color)' }}>
                            {data.btn}
                        </button>
                    </div>
                </div>
            );
        case 'stats':
            return (
                <div className={`${s.padding} px-8 ${s.bg} border-y border-slate-100 dark:border-slate-800`} style={customStyle}>
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 ${s.textAlign}`}>
                        {data.items.map((item: any, i: number) => (
                            <div key={i}>
                                <div className="text-5xl font-black mb-2" style={{ color: 'var(--text-color)' }}>{item.value}</div>
                                <div className="font-bold uppercase tracking-wider text-sm opacity-60" style={{ color: 'var(--text-color)' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'testimonials':
            return (
                <div className={`${s.padding} px-8 ${s.bg}`} style={customStyle}>
                    <h2 className={`text-3xl font-black mb-16 ${s.textAlign}`} style={{ color: 'var(--text-color)' }}>{data.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {data.items.map((item: any, i: number) => (
                            <div key={i} className="p-8 bg-white/5 border border-slate-200 dark:border-slate-800 shadow-sm" style={{ borderRadius: 'var(--radius)' }}>
                                <p className="text-lg opacity-80 mb-6 italic" style={{ color: 'var(--text-color)' }}>"{item.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover bg-slate-200" />
                                    <div>
                                        <div className="font-bold" style={{ color: 'var(--text-color)' }}>{item.name}</div>
                                        <div className="text-sm opacity-60" style={{ color: 'var(--text-color)' }}>{item.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'logos':
            return (
                <div className={`${s.padding} px-8 ${s.bg} border-y border-slate-100 dark:border-slate-800`} style={customStyle}>
                    <p className={`text-sm font-bold opacity-50 uppercase tracking-widest mb-8 ${s.textAlign}`} style={{ color: 'var(--text-color)' }}>{data.title}</p>
                    <div className={`flex flex-wrap ${s.flexAlign} gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500`}>
                        {data.logos.map((logo: string, i: number) => (
                            <img key={i} src={logo} alt="Logo" className="h-8 md:h-10 object-contain invert dark:invert-0" />
                        ))}
                    </div>
                </div>
            );
        case 'faq':
            return (
                <div className={`${s.padding} px-8 ${s.bg} max-w-3xl mx-auto`} style={customStyle}>
                    <h2 className={`text-3xl font-black mb-16 ${s.textAlign}`} style={{ color: 'var(--text-color)' }}>{data.title}</h2>
                    <div className="space-y-4">
                        {data.items.map((item: any, i: number) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-800 p-6 hover:border-blue-500/50 transition-colors" style={{ borderRadius: 'var(--radius)' }}>
                                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-color)' }}>{item.q}</h3>
                                <p className="opacity-70 leading-relaxed" style={{ color: 'var(--text-color)' }}>{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'footer':
            return (
                <footer className={`${s.padding} px-8 ${s.bg} border-t border-slate-100 dark:border-slate-800 ${s.textAlign}`} style={customStyle}>
                    <div className={`flex ${s.flexAlign} gap-8 mb-10`}>
                        {data.links.map((l: string, i: number) => (
                            <a key={i} href="#" className="font-bold text-sm transition-colors opacity-60 hover:opacity-100" style={{ color: 'var(--text-color)' }}>{l}</a>
                        ))}
                    </div>
                    <p className="text-sm opacity-40 " style={{ color: 'var(--text-color)' }}>{data.text}</p>
                </footer>
            );
        default:
            return <div className="py-20 text-center text-slate-400 capitalize">Coming Soon: {section.type}</div>;
    }
}

function SectionEditor({ section, onUpdate }: { section: LandingSection, onUpdate: (partial: Partial<LandingSection>) => void }) {
    const { data, style } = section;
    const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

    const handleChange = (key: string, value: any) => {
        onUpdate({ data: { ...data, [key]: value } });
    };

    const handleFeatureChange = (index: number, key: string, value: string) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [key]: value };
        handleChange('items', newItems);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'content' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Content
                </button>
                <button
                    onClick={() => setActiveTab('style')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'style' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Style
                </button>
            </div>

            {activeTab === 'style' ? (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-2 duration-200">
                    <div>
                        <label className="text-xs font-bold text-slate-400 mb-2 block">Background</label>
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                {['bg-transparent', 'bg-white', 'bg-slate-50', 'bg-slate-900', 'bg-blue-600'].map(bg => (
                                    <button
                                        key={bg}
                                        onClick={() => onUpdate({ style: { ...style, bg } })}
                                        className={`w-8 h-8 rounded-full border-2 ${bg === 'bg-transparent' ? 'bg-white' : bg} ${bg.includes('slate-900') || bg.includes('blue') ? 'border-white/20' : 'border-slate-200'} ${(style?.bg || '') === bg ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
                                        title={bg}
                                    >
                                        {bg === 'bg-transparent' && <div className="w-full h-full border border-red-500 rounded-full flex items-center justify-center"><div className="w-full h-[1px] bg-red-500 rotate-45" /></div>}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={!style?.bg?.startsWith('bg-') ? style?.bg || '#ffffff' : '#ffffff'}
                                    onChange={(e) => onUpdate({ style: { ...style, bg: e.target.value } })}
                                    className="w-full h-8 cursor-pointer rounded-lg overflow-hidden border-0 p-0"
                                />
                                <span className="text-xs font-bold text-slate-500">Custom Hex</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 mb-2 block">Text Alignment</label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            {['left', 'center', 'right'].map((align) => (
                                <button
                                    key={align}
                                    onClick={() => onUpdate({ style: { ...style, textAlign: align as any } })}
                                    className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center ${style?.textAlign === align || (!style?.textAlign && align === 'center') ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {align === 'left' && <AlignLeft size={16} />}
                                    {align === 'center' && <AlignCenter size={16} />}
                                    {align === 'right' && <AlignRight size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 mb-2 block">Text Color Override</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={style?.textColor || '#000000'}
                                onChange={(e) => onUpdate({ style: { ...style, textColor: e.target.value } })}
                                className="w-full h-8 cursor-pointer rounded-lg overflow-hidden border-0 p-0"
                            />
                            <button
                                onClick={() => onUpdate({ style: { ...style, textColor: undefined } })}
                                className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-lg hover:bg-slate-200"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 mb-2 block">Vertical Padding</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="0"
                                max="100" // Corresponds to py-0 to py-xxx roughly or rems
                                step="4"
                                value={(() => {
                                    const p = style?.padding || 'py-24';
                                    if (p.startsWith('py-')) return parseInt(p.replace('py-', '')) * 4;
                                    if (p.endsWith('rem')) return parseFloat(p.replace('rem', '')) * 16;
                                    return 96;
                                })()}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    // Use rems for granular control if not matching standard tailwind classes
                                    const remVal = `${val / 4}rem`;
                                    onUpdate({ style: { ...style, padding: remVal } });
                                }}
                                className="w-full accent-blue-600"
                            />
                            <span className="text-xs font-mono w-12 text-right">{style?.padding || '6rem'}</span>
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase">
                            <span>Tight</span>
                            <span>Spacious</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-2 duration-200">
                    {section.type === 'hero' && (
                        <>
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Title</label>
                                <textarea
                                    value={data.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Subtitle</label>
                                <textarea
                                    value={data.subtitle}
                                    onChange={(e) => handleChange('subtitle', e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Image URL</label>
                                <input
                                    value={data.image || ''}
                                    onChange={(e) => handleChange('image', e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-2 block">Primary CTA</label>
                                    <input
                                        value={data.primaryBtn}
                                        onChange={(e) => handleChange('primaryBtn', e.target.value)}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-2 block">Secondary CTA</label>
                                    <input
                                        value={data.secondaryBtn}
                                        onChange={(e) => handleChange('secondaryBtn', e.target.value)}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {section.type === 'features' && (
                        <>
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Main Title</label>
                                <input
                                    value={data.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-xs font-bold text-slate-400 block">Features List</label>
                                {data.items.map((item: any, i: number) => (
                                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <input
                                            value={item.title}
                                            onChange={(e) => handleFeatureChange(i, 'title', e.target.value)}
                                            className="w-full bg-transparent font-bold mb-1 outline-none text-sm"
                                            placeholder="Feature Title"
                                        />
                                        <textarea
                                            value={item.desc}
                                            onChange={(e) => handleFeatureChange(i, 'desc', e.target.value)}
                                            className="w-full bg-transparent text-xs text-slate-500 outline-none resize-none"
                                            rows={2}
                                            placeholder="Feature Description"
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {section.type === 'pricing' && (
                        <>
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Main Title</label>
                                <input value={data.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            {data.plans.map((plan: any, i: number) => (
                                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                                    <input value={plan.name} onChange={(e) => {
                                        const newPlans = [...data.plans];
                                        newPlans[i] = { ...newPlans[i], name: e.target.value };
                                        handleChange('plans', newPlans);
                                    }} className="w-full bg-transparent font-bold mb-2 outline-none text-sm" placeholder="Plan Name" />
                                    <input value={plan.price} onChange={(e) => {
                                        const newPlans = [...data.plans];
                                        newPlans[i] = { ...newPlans[i], price: e.target.value };
                                        handleChange('plans', newPlans);
                                    }} className="w-full bg-transparent text-2xl font-black mb-4 outline-none" placeholder="Price" />
                                    <div className="flex items-center gap-2 mb-2">
                                        <input type="checkbox" checked={!!plan.popular} onChange={(e) => {
                                            const newPlans = [...data.plans];
                                            newPlans[i] = { ...newPlans[i], popular: e.target.checked };
                                            handleChange('plans', newPlans);
                                        }} className="rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 h-4 w-4" />
                                        <label className="text-xs font-bold text-slate-500">Popular Tag</label>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {section.type === 'testimonials' && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Title</label>
                                <input value={data.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none" />
                            </div>
                            {data.items.map((item: any, i: number) => (
                                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <input value={item.name} onChange={(e) => {
                                        const newItems = [...data.items];
                                        newItems[i] = { ...newItems[i], name: e.target.value };
                                        handleChange('items', newItems);
                                    }} className="w-full bg-transparent font-bold text-sm mb-1 outline-none" placeholder="Name" />
                                    <input value={item.role} onChange={(e) => {
                                        const newItems = [...data.items];
                                        newItems[i] = { ...newItems[i], role: e.target.value };
                                        handleChange('items', newItems);
                                    }} className="w-full bg-transparent text-xs text-slate-500 mb-2 outline-none" placeholder="Role" />
                                    <textarea value={item.quote} onChange={(e) => {
                                        const newItems = [...data.items];
                                        newItems[i] = { ...newItems[i], quote: e.target.value };
                                        handleChange('items', newItems);
                                    }} className="w-full bg-transparent text-xs italic text-slate-600 dark:text-slate-400 outline-none resize-none" rows={3} placeholder="Quote" />
                                    <input value={item.avatar} onChange={(e) => {
                                        const newItems = [...data.items];
                                        newItems[i] = { ...newItems[i], avatar: e.target.value };
                                        handleChange('items', newItems);
                                    }} className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 outline-none mt-2" placeholder="Avatar URL" />
                                </div>
                            ))}
                        </div>
                    )}

                    {section.type === 'logos' && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Title</label>
                                <input value={data.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none" />
                            </div>
                            <label className="text-xs font-bold text-slate-400 block">Logo URLs</label>
                            {data.logos.map((logo: string, i: number) => (
                                <input key={i} value={logo} onChange={(e) => {
                                    const newLogos = [...data.logos];
                                    newLogos[i] = e.target.value;
                                    handleChange('logos', newLogos);
                                }} className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 outline-none" placeholder="Logo URL" />
                            ))}
                        </div>
                    )}

                    {section.type === 'faq' && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Main Title</label>
                                <input value={data.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none" />
                            </div>
                            {data.items.map((item: any, i: number) => (
                                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <input value={item.q} onChange={(e) => {
                                        const newItems = [...data.items];
                                        newItems[i] = { ...newItems[i], q: e.target.value };
                                        handleChange('items', newItems);
                                    }} className="w-full bg-transparent font-bold text-sm mb-1 outline-none" placeholder="Question" />
                                    <textarea value={item.a} onChange={(e) => {
                                        const newItems = [...data.items];
                                        newItems[i] = { ...newItems[i], a: e.target.value };
                                        handleChange('items', newItems);
                                    }} className="w-full bg-transparent text-xs text-slate-500 outline-none resize-none" rows={2} placeholder="Answer" />
                                </div>
                            ))}
                        </div>
                    )}

                    {section.type === 'cta' && (
                        <>
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Title</label>
                                <input value={data.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Subtitle</label>
                                <textarea value={data.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows={3} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Button Text</label>
                                <input value={data.btn} onChange={(e) => handleChange('btn', e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </>
                    )}

                    {section.type === 'stats' && (
                        <div className="flex flex-col gap-4">
                            {data.items.map((item: any, i: number) => (
                                <div key={i} className="grid grid-cols-2 gap-2">
                                    <input value={item.value} onChange={(e) => {
                                        const newItems = [...data.items];
                                        newItems[i] = { ...newItems[i], value: e.target.value };
                                        handleChange('items', newItems);
                                    }} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <input value={item.label} onChange={(e) => {
                                        const newItems = [...data.items];
                                        newItems[i] = { ...newItems[i], label: e.target.value };
                                        handleChange('items', newItems);
                                    }} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            ))}
                        </div>
                    )}
                    {section.type === 'footer' && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">Copyright Text</label>
                                <input value={data.text} onChange={(e) => handleChange('text', e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none" />
                            </div>
                            <label className="text-xs font-bold text-slate-400 block">Links</label>
                            {data.links.map((link: string, i: number) => (
                                <input key={i} value={link} onChange={(e) => {
                                    const newLinks = [...data.links];
                                    newLinks[i] = e.target.value;
                                    handleChange('links', newLinks);
                                }} className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 outline-none" placeholder="Link Text" />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


// --- CODE GENERATOR ---

function generateCode(sections: LandingSection[], settings: GlobalSettings) {
    let code = `import React from 'react';
import { Box, Check } from 'lucide-react';
// import Head from 'next/head'; // Uncomment if using Next.js Pages Router

export default function LandingPage() {
  const globalStyles = {
    '--primary-color': '${settings.primaryColor}',
    '--secondary-color': '${settings.secondaryColor}',
    '--bg-color': '${settings.backgroundColor}',
    '--text-color': '${settings.textColor}',
    '--radius': '${settings.borderRadius}',
  } as React.CSSProperties;

  // Helper styles
  const primaryStyle = { backgroundColor: 'var(--primary-color)', color: '#ffffff', borderRadius: 'var(--radius)' };
  const textStyle = { color: 'var(--text-color)' };

  return (
    <>
      {/* 
      <Head>
        <title>${settings.metaTitle || 'Landing Page'}</title>
        <meta name="description" content="${settings.metaDescription || 'Created with Landing Page Builder'}" />
      </Head> 
      */}
      <div className="min-h-screen ${settings.fontFamily}" style={globalStyles}>
        <div className="bg-[var(--bg-color)] text-[var(--text-color)] min-h-screen">
`;

    sections.forEach(s => {
        const style = s.style || {};
        const isCustomBg = style.bg && !style.bg.startsWith('bg-');
        const isCustomPadding = style.padding && !style.padding.startsWith('py-');
        const bgClass = !isCustomBg && style.bg ? style.bg : '';
        const paddingClass = !isCustomPadding && style.padding ? style.padding : 'py-24';

        const sectionClass = `${paddingClass} px-8 ${bgClass}`;
        const shapeStyle = { borderRadius: 'var(--radius)' };

        // Inline style string for the section
        let sectionStyleProps = '';
        const inlineStyles: any = {};
        if (isCustomBg) inlineStyles.backgroundColor = style.bg;
        if (isCustomPadding) {
            inlineStyles.paddingTop = style.padding;
            inlineStyles.paddingBottom = style.padding;
        }
        if (style.textColor) inlineStyles.color = style.textColor;

        if (Object.keys(inlineStyles).length > 0) {
            // Create a string representation of the style object
            const styleString = JSON.stringify(inlineStyles).replace(/"/g, "'").replace(/,/g, ", ");
            sectionStyleProps = ` style={${styleString}}`;
        }

        if (s.type === 'hero') {
            code += `      {/* Hero Section */}\n      <section className="${sectionClass} ${s.data.alignment === 'center' ? 'text-center' : 'text-left'} relative overflow-hidden"${sectionStyleProps}>\n        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">\n          <div className="max-w-4xl">\n            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight" style={textStyle}>${s.data.title}</h1>\n            <p className="text-xl md:text-2xl opacity-80 mb-12 max-w-2xl mx-auto leading-relaxed" style={textStyle}>${s.data.subtitle}</p>\n            <div className="flex flex-wrap gap-4 ${s.data.alignment === 'center' ? 'justify-center' : 'justify-start'} mb-16">\n              <button className="px-8 py-4 font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-105 transition-all" style={primaryStyle}>${s.data.primaryBtn}</button>\n              <button className="px-8 py-4 bg-transparent border border-current font-black text-lg opacity-80 hover:opacity-100 transition-all" style={{ ...textStyle, borderRadius: 'var(--radius)' }}>${s.data.secondaryBtn}</button>\n            </div>\n          </div>\n          ${s.data.image ? `<div className="w-full max-w-5xl overflow-hidden shadow-2xl border-4 border-slate-200 dark:border-slate-800 bg-slate-100" style={{ borderRadius: 'calc(var(--radius) + 8px)' }}>\n            <img src="${s.data.image}" alt="Hero" className="w-full h-auto" />\n          </div>` : ''}\n        </div>\n      </section>\n\n`;
        }
        if (s.type === 'features') {
            code += `      {/* Features Section */}\n      <section className="${sectionClass}"${sectionStyleProps}>\n        <h2 className="text-3xl font-black text-center mb-16" style={textStyle}>${s.data.title}</h2>\n        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">\n`;
            s.data.items.forEach((item: any) => {
                code += `          <div className="p-8 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all" style={shapeStyle}>\n            <div className="w-12 h-12 mb-6 flex items-center justify-center text-white" style={{ ...primaryStyle, borderRadius: 'calc(var(--radius) - 4px)' }}>\n              <Box size={24} />\n            </div>\n            <h3 className="text-xl font-bold mb-3" style={textStyle}>${item.title}</h3>\n            <p className="opacity-70 leading-relaxed" style={textStyle}>${item.desc}</p>\n          </div>\n`;
            });
            code += `        </div>\n      </section>\n\n`;
        }
        if (s.type === 'pricing') {
            code += `      {/* Pricing Section */}\n      <section className="${sectionClass}"${sectionStyleProps}>\n        <h2 className="text-4xl font-black text-center mb-16" style={textStyle}>${s.data.title}</h2>\n        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">\n`;
            s.data.plans.forEach((plan: any) => {
                code += `          <div className="p-10 border-2 transition-all relative ${plan.popular ? 'border-transparent shadow-2xl scale-105' : 'border-slate-100 dark:border-slate-700'}" style={{ borderRadius: 'var(--radius)', borderColor: ${plan.popular ? `'var(--primary-color)'` : `''`} }}>\n            ${plan.popular ? '<span className="absolute -top-4 left-1/2 -translate-x-1/2 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: "var(--primary-color)" }}>Most Popular</span>' : ''}\n            <h3 className="text-2xl font-black mb-2" style={textStyle}>${plan.name}</h3>\n            <div className="flex items-baseline gap-1 mb-6">\n              <span className="text-4xl font-black" style={textStyle}>${plan.price}</span>\n              <span className="opacity-60" style={textStyle}>/mo</span>\n            </div>\n            <ul className="space-y-4 mb-8">\n`;
                plan.features.forEach((f: string) => {
                    code += `              <li className="flex items-center gap-3 opacity-80" style={textStyle}>\n                <Check size={16} className="text-emerald-500" />\n                ${f}\n              </li>\n`;
                });
                code += `            </ul>\n            <button className="w-full py-4 font-bold transition-all" style={${plan.popular ? 'primaryStyle' : `{ backgroundColor: 'transparent', borderColor: 'var(--text-color)', color: 'var(--text-color)', borderRadius: 'var(--radius)', borderWidth: '1px' }`}}>\n              ${plan.cta}\n            </button>\n          </div>\n`;
            });
            code += `        </div>\n      </section>\n\n`;
        }
        if (s.type === 'testimonials') {
            code += `      {/* Testimonials Section */}\n      <section className="${sectionClass}"${sectionStyleProps}>\n        <h2 className="text-3xl font-black text-center mb-16" style={textStyle}>${s.data.title}</h2>\n        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">\n`;
            s.data.items.forEach((item: any) => {
                code += `          <div className="p-8 bg-white/5 border border-slate-100 dark:border-slate-800 shadow-sm" style={shapeStyle}>\n            <p className="text-lg opacity-80 mb-6 italic" style={textStyle}>"${item.quote}"</p>\n            <div className="flex items-center gap-4">\n              <img src="${item.avatar}" alt="${item.name}" className="w-12 h-12 rounded-full object-cover bg-slate-200" />\n              <div>\n                <div className="font-bold" style={textStyle}>${item.name}</div>\n                <div className="text-sm opacity-60" style={textStyle}>${item.role}</div>\n              </div>\n            </div>\n          </div>\n`;
            });
            code += `        </div>\n      </section>\n\n`;
        }
        if (s.type === 'logos') {
            code += `      {/* Logos Section */}\n      <section className="${sectionClass} border-y border-slate-100 dark:border-slate-800"${sectionStyleProps}>\n        <p className="text-center text-sm font-bold opacity-50 uppercase tracking-widest mb-8" style={textStyle}>${s.data.title}</p>\n        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">\n`;
            s.data.logos.forEach((logo: string) => {
                code += `          <img src="${logo}" alt="Logo" className="h-8 md:h-10 object-contain" />\n`;
            });
            code += `        </div>\n      </section>\n\n`;
        }
        if (s.type === 'faq') {
            code += `      {/* FAQ Section */}\n      <section className="${sectionClass} max-w-3xl mx-auto"${sectionStyleProps}>\n        <h2 className="text-3xl font-black text-center mb-16" style={textStyle}>${s.data.title}</h2>\n        <div className="space-y-4">\n`;
            s.data.items.forEach((item: any) => {
                code += `          <div className="border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900" style={shapeStyle}>\n            <h3 className="text-lg font-bold mb-2" style={textStyle}>${item.q}</h3>\n            <p className="opacity-70 leading-relaxed" style={textStyle}>${item.a}</p>\n          </div>\n`;
            });
            code += `        </div>\n      </section>\n\n`;
        }
        if (s.type === 'cta') {
            code += `      {/* CTA Section */}\n      <section className="${sectionClass}"${sectionStyleProps}>\n        <div className="p-12 text-center text-white shadow-2xl shadow-blue-500/20" style={{ backgroundColor: 'var(--primary-color)', borderRadius: 'var(--radius)' }}>\n          <h2 className="text-4xl font-black mb-6" style={{ color: '#ffffff' }}>${s.data.title}</h2>\n          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto" style={{ color: '#ffffff' }}>${s.data.subtitle}</p>\n          <button className="px-10 py-4 bg-white text-slate-900 font-black text-lg hover:scale-105 transition-all" style={{ borderRadius: 'var(--radius)', color: 'var(--primary-color)' }}>${s.data.btn}</button>\n        </div>\n      </section>\n\n`;
        }
        if (s.type === 'stats') {
            code += `      {/* Stats Section */}\n      <section className="${sectionClass} border-y border-slate-100 dark:border-slate-800"${sectionStyleProps}>\n        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">\n`;
            s.data.items.forEach((item: any) => {
                code += `          <div>\n            <div className="text-5xl font-black mb-2" style={textStyle}>${item.value}</div>\n            <div className="opacity-60 font-bold uppercase tracking-wider text-sm" style={textStyle}>${item.label}</div>\n          </div>\n`;
            });
            code += `        </div>\n      </section>\n\n`;
        }
        if (s.type === 'footer') {
            code += `      {/* Footer */}\n      <footer className="${sectionClass} border-t border-slate-100 dark:border-slate-800 text-center"${sectionStyleProps}>\n        <div className="flex justify-center gap-8 mb-10">\n`;
            s.data.links.forEach((link: string) => {
                code += `          <a href="#" className="opacity-60 hover:opacity-100 font-bold text-sm transition-colors" style={textStyle}>${link}</a>\n`;
            });
            code += `        </div>\n        <p className="opacity-40 text-sm" style={textStyle}>${s.data.text}</p>\n      </footer>\n\n`;
        }
    });

    code += `      </div>\n    </div>\n  );\n}`;
    return code;
}
