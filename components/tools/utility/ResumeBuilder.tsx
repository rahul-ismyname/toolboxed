'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
    Download, LayoutTemplate, Palette, Type, Save,
    Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
    Briefcase, GraduationCap, User, Wrench, FolderOpen, Mail, Phone, MapPin, Globe, Linkedin, Github, Sparkles, Share2, Check
} from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// --- TYPES ---
interface ResumeData {
    personal: {
        fullName: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        website: string;
        summary: string;
    };
    experience: Array<{
        id: string;
        company: string;
        role: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        description: string;
    }>;
    education: Array<{
        id: string;
        school: string;
        degree: string;
        location: string;
        startDate: string;
        endDate: string;
        description: string;
    }>;
    skills: string; // Comma separated for simplicity in UI, parsed in render
    projects: Array<{
        id: string;
        name: string;
        link: string;
        description: string;
    }>;
    meta: {
        template: 'modern' | 'classic' | 'minimal' | 'professional' | 'creative';
        color: string;
        font: 'sans' | 'serif' | 'mono';
    };
}

const INITIAL_DATA: ResumeData = {
    personal: {
        fullName: 'Jane Doe',
        title: 'Senior Product Designer',
        email: 'jane@example.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        website: 'janedoe.design',
        summary: 'Passionate product designer with 8+ years of experience in building user-centric digital products. Expert in UI/UX systems and leading design teams.',
    },
    experience: [
        {
            id: '1',
            company: 'TechFlow Inc.',
            role: 'Senior Product Deisgner',
            location: 'San Francisco, CA',
            startDate: '2021-03',
            endDate: '',
            current: true,
            description: '• Led the redesign of the core dashboard, increasing user engagement by 40%.\n• Managed a team of 4 designers and mentored junior staff.\n• Established a comprehensive design system used across 12 products.',
        },
        {
            id: '2',
            company: 'Creative Studio',
            role: 'UX Designer',
            location: 'Austin, TX',
            startDate: '2018-06',
            endDate: '2021-02',
            current: false,
            description: '• Conducted user research and usability testing for 20+ client projects.\n• Collaborated with engineering to ensure design fidelity in implementation.',
        }
    ],
    education: [
        {
            id: '1',
            school: 'University of Texas',
            degree: 'BFA in Design',
            location: 'Austin, TX',
            startDate: '2014-08',
            endDate: '2018-05',
            description: 'Graduated Cum Laude. President of Design Club.',
        }
    ],
    skills: 'Figma, Adobe CC, React, CSS/HTML, User Research, Prototyping, Agile',
    projects: [],
    meta: {
        template: 'modern',
        color: '#10b981', // Emerald-500 default
        font: 'sans',
    }
};

export function ResumeBuilder() {
    const [data, setData] = useState<ResumeData>(INITIAL_DATA);
    const [activeSection, setActiveSection] = useState<string | null>('personal');
    const [isClient, setIsClient] = useState(false);

    // Sharing State
    const [shareCopied, setShareCopied] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setIsClient(true);

        const urlConfig = searchParams.get('config');
        if (urlConfig) {
            try {
                const decoded = JSON.parse(atob(decodeURIComponent(urlConfig)));
                setData(prev => ({ ...INITIAL_DATA, ...decoded }));
            } catch (e) {
                console.error('Failed to decode config', e);
            }
        }

        const saved = localStorage.getItem('resume-data');
        if (saved && !urlConfig) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load saved resume", e);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('resume-data', JSON.stringify(data));
        }
    }, [data, isClient]);

    const handlePrint = () => {
        window.print();
    };

    const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
        setData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    };

    const updateMeta = (field: keyof ResumeData['meta'], value: any) => {
        setData(prev => ({ ...prev, meta: { ...prev.meta, [field]: value } }));
    };

    // --- RENDER HELPERS ---
    // --- SCALING LOGIC ---
    const [scale, setScale] = useState(0.85);

    useEffect(() => {
        const handleResize = () => {
            const container = document.getElementById('resume-preview-container');
            if (container) {
                const containerWidth = container.clientWidth;
                // 210mm is approx 800px. We add some padding.
                const baseWidth = 850;
                const newScale = Math.min(0.85, (containerWidth - 32) / baseWidth);
                setScale(newScale);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call

        // Small delay to ensure container is rendered
        setTimeout(handleResize, 100);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getFontClass = () => {
        switch (data.meta.font) {
            case 'serif': return 'font-serif';
            case 'mono': return 'font-mono';
            default: return 'font-sans';
        }
    };

    if (!isClient) return null;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
            {/* --- MOBILE NAVIGATION --- */}
            <div className="lg:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50">
                <button
                    onClick={() => setActiveSection('personal')}
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeSection !== 'preview' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-400'}`}
                >
                    Draft Matrix
                </button>
                <button
                    onClick={() => setActiveSection('preview')}
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeSection === 'preview' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-400'}`}
                >
                    Review Sphere
                </button>
            </div>

            {/* --- LEFT: EDITOR MATRIX --- */}
            <div className={`w-full lg:w-[450px] xl:w-[500px] flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full overflow-hidden print:hidden z-10 transition-all duration-500 ${activeSection === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
                {/* Editor Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shadow-sm relative z-20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl">
                            <LayoutTemplate className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Content Architect</h2>
                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Editor Node</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (confirm('Reset all data?')) setData(INITIAL_DATA);
                        }}
                        className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                        title="Hard Reset"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">

                    {/* Design Controls */}
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-6 shadow-inner">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
                            <Palette className="w-4 h-4 text-emerald-500" /> Stylometry
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Visual Archetype</label>
                                <div className="relative group">
                                    <select
                                        value={data.meta.template}
                                        onChange={(e) => updateMeta('template', e.target.value as any)}
                                        className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.5rem] outline-none appearance-none font-bold text-xs text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm transition-all"
                                    >
                                        <option value="modern">Modern Alpha</option>
                                        <option value="classic">Legacy Classic</option>
                                        <option value="minimal">Void Minimal</option>
                                        <option value="professional">Corporate Pro</option>
                                        <option value="creative">Fluid Creative</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Accent Resonance</label>
                                <div className="flex flex-wrap gap-3 px-2">
                                    {['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b', '#0f172a'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => updateMeta('color', c)}
                                            className={`w-11 h-11 rounded-full border-4 transition-all hover:scale-110 shadow-lg ${data.meta.color === c ? 'border-white dark:border-slate-800 ring-2 ring-emerald-500/50' : 'border-transparent opacity-60'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <Section
                        title="Identity Protocol"
                        icon={User}
                        isOpen={activeSection === 'personal'}
                        onToggle={() => setActiveSection(activeSection === 'personal' ? null : 'personal')}
                    >
                        <div className="space-y-6">
                            <Input label="Full Designation" value={data.personal.fullName} onChange={(v: string) => updatePersonal('fullName', v)} placeholder="Jane Doe" />
                            <Input label="Professional Archetype" value={data.personal.title} onChange={(v: string) => updatePersonal('title', v)} placeholder="Senior System Architect" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Comms Channel (Email)" value={data.personal.email} onChange={(v: string) => updatePersonal('email', v)} placeholder="jane@example.com" />
                                <Input label="Contact Sync (Phone)" value={data.personal.phone} onChange={(v: string) => updatePersonal('phone', v)} placeholder="(555) 000-0000" />
                            </div>
                            <Input label="Geographic Coordinate" value={data.personal.location} onChange={(v: string) => updatePersonal('location', v)} placeholder="San Francisco, CA" />
                            <Input label="Digital Port (Website/LinkedIn)" value={data.personal.website} onChange={(v: string) => updatePersonal('website', v)} placeholder="portfolio.link" />
                            <TextArea label="Bio-Manifest (Summary)" value={data.personal.summary} onChange={(v: string) => updatePersonal('summary', v)} />
                        </div>
                    </Section>

                    {/* Skills */}
                    <Section
                        title="Capability Matrix"
                        icon={Wrench}
                        isOpen={activeSection === 'skills'}
                        onToggle={() => setActiveSection(activeSection === 'skills' ? null : 'skills')}
                    >
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 ml-4 italic">Neural Loadouts</p>
                            <TextArea
                                label="Skill Arrays (Comma separated)"
                                value={data.skills}
                                onChange={(v: string) => setData(prev => ({ ...prev, skills: v }))}
                                placeholder="Quantum Computing, React Resonance, Neural Design..."
                            />
                        </div>
                    </Section>

                    {/* Projects (Added if missing in UI) */}
                    <Section
                        title="Operational Logs"
                        icon={FolderOpen}
                        isOpen={activeSection === 'projects'}
                        onToggle={() => setActiveSection(activeSection === 'projects' ? null : 'projects')}
                    >
                        <div className="space-y-8">
                            {data.projects.map((proj, idx) => (
                                <div key={proj.id} className="relative group p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner space-y-6">
                                    <button
                                        onClick={() => {
                                            const newProj = data.projects.filter(p => p.id !== proj.id);
                                            setData(prev => ({ ...prev, projects: newProj }));
                                        }}
                                        className="absolute top-6 right-6 p-3 bg-white dark:bg-slate-900 text-slate-300 hover:text-rose-500 rounded-2xl shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-xs">
                                            {idx + 1}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Project Node</p>
                                    </div>

                                    <div className="space-y-4">
                                        <Input label="Project Designation" value={proj.name} onChange={(v: string) => {
                                            const newProj = [...data.projects];
                                            newProj[idx].name = v;
                                            setData(prev => ({ ...prev, projects: newProj }));
                                        }} />
                                        <Input label="Source link/URL" value={proj.link} onChange={(v: string) => {
                                            const newProj = [...data.projects];
                                            newProj[idx].link = v;
                                            setData(prev => ({ ...prev, projects: newProj }));
                                        }} />
                                        <TextArea label="System Logic (Description)" value={proj.description} onChange={(v: string) => {
                                            const newProj = [...data.projects];
                                            newProj[idx].description = v;
                                            setData(prev => ({ ...prev, projects: newProj }));
                                        }} />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setData(prev => ({
                                    ...prev,
                                    projects: [...prev.projects, {
                                        id: Date.now().toString(),
                                        name: 'Project Alpha',
                                        link: '',
                                        description: ''
                                    }]
                                }))}
                                className="w-full py-6 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-[2rem] border-2 border-dashed border-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/5 group"
                            >
                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Initialize Project
                            </button>
                        </div>
                    </Section>

                    {/* Experience */}
                    <Section
                        title="Experience"
                        icon={Briefcase}
                        isOpen={activeSection === 'experience'}
                        onToggle={() => setActiveSection(activeSection === 'experience' ? null : 'experience')}
                    >
                        <div className="space-y-8">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id} className="relative group p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner space-y-6">
                                    <button
                                        onClick={() => {
                                            const newExp = data.experience.filter(e => e.id !== exp.id);
                                            setData(prev => ({ ...prev, experience: newExp }));
                                        }}
                                        className="absolute top-6 right-6 p-3 bg-white dark:bg-slate-900 text-slate-300 hover:text-rose-500 rounded-2xl shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xs">
                                            {idx + 1}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Work Node</p>
                                    </div>

                                    <div className="space-y-4">
                                        <Input label="Organization" value={exp.company} onChange={(v: string) => {
                                            const newExp = [...data.experience];
                                            newExp[idx].company = v;
                                            setData(prev => ({ ...prev, experience: newExp }));
                                        }} />
                                        <Input label="Position Title" value={exp.role} onChange={(v: string) => {
                                            const newExp = [...data.experience];
                                            newExp[idx].role = v;
                                            setData(prev => ({ ...prev, experience: newExp }));
                                        }} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Epoch Start" type="month" value={exp.startDate} onChange={(v: string) => {
                                                const newExp = [...data.experience];
                                                newExp[idx].startDate = v;
                                                setData(prev => ({ ...prev, experience: newExp }));
                                            }} />
                                            <Input label="Epoch End" type="month" value={exp.endDate} disabled={exp.current} onChange={(v: string) => {
                                                const newExp = [...data.experience];
                                                newExp[idx].endDate = v;
                                                setData(prev => ({ ...prev, experience: newExp }));
                                            }} />
                                        </div>
                                        <label className="flex items-center gap-3 px-4 py-2 cursor-pointer group/check">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={exp.current}
                                                    onChange={e => {
                                                        const newExp = [...data.experience];
                                                        newExp[idx].current = e.target.checked;
                                                        setData(prev => ({ ...prev, experience: newExp }));
                                                    }}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-5 h-5 border-2 border-slate-200 dark:border-slate-800 rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all" />
                                                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                                                    <Sparkles className="w-3 h-3 fill-current" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/check:text-emerald-500 transition-colors">Active Protocol</span>
                                        </label>
                                        <TextArea label="Function Logic (• for bullets)" value={exp.description} onChange={(v: string) => {
                                            const newExp = [...data.experience];
                                            newExp[idx].description = v;
                                            setData(prev => ({ ...prev, experience: newExp }));
                                        }} />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setData(prev => ({
                                    ...prev,
                                    experience: [...prev.experience, {
                                        id: Date.now().toString(),
                                        company: 'New Node',
                                        role: 'Functional Role',
                                        location: '',
                                        startDate: '',
                                        endDate: '',
                                        current: false,
                                        description: ''
                                    }]
                                }))}
                                className="w-full py-6 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-[2rem] border-2 border-dashed border-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/5 group"
                            >
                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Initialize Position
                            </button>
                        </div>
                    </Section>

                    {/* Education */}
                    <Section
                        title="Education"
                        icon={GraduationCap}
                        isOpen={activeSection === 'education'}
                        onToggle={() => setActiveSection(activeSection === 'education' ? null : 'education')}
                    >
                        <div className="space-y-8">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id} className="relative group p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner space-y-6">
                                    <button
                                        onClick={() => {
                                            const newEdu = data.education.filter(e => e.id !== edu.id);
                                            setData(prev => ({ ...prev, education: newEdu }));
                                        }}
                                        className="absolute top-6 right-6 p-3 bg-white dark:bg-slate-900 text-slate-300 hover:text-rose-500 rounded-2xl shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black text-xs">
                                            {idx + 1}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Academic Node</p>
                                    </div>

                                    <div className="space-y-4">
                                        <Input label="Institution" value={edu.school} onChange={(v: string) => {
                                            const newEdu = [...data.education];
                                            newEdu[idx].school = v;
                                            setData(prev => ({ ...prev, education: newEdu }));
                                        }} />
                                        <Input label="Degree / Thesis" value={edu.degree} onChange={(v: string) => {
                                            const newEdu = [...data.education];
                                            newEdu[idx].degree = v;
                                            setData(prev => ({ ...prev, education: newEdu }));
                                        }} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Enrollment" type="month" value={edu.startDate} onChange={(v: string) => {
                                                const newEdu = [...data.education];
                                                newEdu[idx].startDate = v;
                                                setData(prev => ({ ...prev, education: newEdu }));
                                            }} />
                                            <Input label="Conferral" type="month" value={edu.endDate} onChange={(v: string) => {
                                                const newEdu = [...data.education];
                                                newEdu[idx].endDate = v;
                                                setData(prev => ({ ...prev, education: newEdu }));
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setData(prev => ({
                                    ...prev,
                                    education: [...prev.education, {
                                        id: Date.now().toString(),
                                        school: 'University Node',
                                        degree: 'Degree Archetype',
                                        location: '',
                                        startDate: '',
                                        endDate: '',
                                        description: ''
                                    }]
                                }))}
                                className="w-full py-6 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-[2rem] border-2 border-dashed border-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/5 group"
                            >
                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Initialize Degree
                            </button>
                        </div>
                    </Section>

                    {/* Skills */}
                    <Section
                        title="Skills"
                        icon={Wrench}
                        isOpen={activeSection === 'skills'}
                        onToggle={() => setActiveSection(activeSection === 'skills' ? null : 'skills')}
                    >
                        <TextArea
                            label="Skills (Comma separated)"
                            value={data.skills}
                            onChange={(v: string) => setData(prev => ({ ...prev, skills: v }))}
                            placeholder="Design, React, Typescript..."
                        />
                    </Section>

                </div>
            </div>

            {/* --- RIGHT: PREVIEW SPHERE --- */}
            <div id="resume-preview-container" className={`flex-1 bg-slate-50 dark:bg-slate-950 p-4 lg:p-12 xl:p-20 overflow-y-auto flex justify-center relative transition-all duration-500 ${activeSection === 'preview' ? 'flex' : 'hidden lg:flex'}`}>

                {/* PDF Actions */}
                <div className="fixed bottom-12 right-12 z-50 flex flex-col gap-4 print:hidden">
                    <button
                        onClick={() => {
                            const encoded = encodeURIComponent(btoa(JSON.stringify(data)));
                            const url = `${window.location.origin}${pathname}?config=${encoded}`;
                            navigator.clipboard.writeText(url);
                            setShareCopied(true);
                            setTimeout(() => setShareCopied(false), 2000);
                            router.replace(`${pathname}?config=${encoded}`, { scroll: false });
                        }}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-5 rounded-[2rem] shadow-3xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-4 font-black uppercase tracking-widest text-xs border border-white/10 dark:border-slate-800"
                    >
                        {shareCopied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                        <span>{shareCopied ? 'Copied' : 'Share'}</span>
                    </button>

                    <button
                        onClick={handlePrint}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-5 rounded-[2rem] shadow-3xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-4 font-black uppercase tracking-widest text-xs border border-white/10 dark:border-slate-800"
                    >
                        <Download className="w-5 h-5 text-emerald-500" />
                        <span>Export Manifest</span>
                    </button>
                    <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 self-center">
                        <Save className="w-4 h-4 text-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Active</span>
                    </div>
                </div>

                {/* --- A4 PROJECTION --- */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-emerald-500/5 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div
                        id="resume-preview"
                        className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-3xl mx-auto origin-top transition-all duration-500 relative z-10 ${getFontClass()} border border-slate-100`}
                        style={{ transform: `scale(${scale})` }}
                    >
                        {data.meta.template === 'modern' && <TemplateModern data={data} />}
                        {data.meta.template === 'classic' && <TemplateClassic data={data} />}
                        {data.meta.template === 'minimal' && <TemplateMinimal data={data} />}
                        {data.meta.template === 'professional' && <TemplateProfessional data={data} />}
                        {data.meta.template === 'creative' && <TemplateCreative data={data} />}
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

const Section = ({ title, icon: Icon, children, isOpen, onToggle }: any) => (
    <div className={`rounded-[2rem] border transition-all duration-500 overflow-hidden ${isOpen ? 'bg-white dark:bg-slate-900 border-emerald-500/20 shadow-2xl' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 shadow-inner opacity-80'}`}>
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-6 hover:bg-white/50 dark:hover:bg-slate-900/50 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-all ${isOpen ? 'bg-emerald-500 text-white shadow-lg rotate-12' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:rotate-6'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isOpen ? 'text-emerald-500' : 'text-slate-400'}`}>Data Segment</h3>
                    <p className={`text-sm font-black uppercase tracking-wider ${isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{title}</p>
                </div>
            </div>
            <div className={`p-2 rounded-full border transition-all ${isOpen ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-300'}`}>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
        </button>
        {isOpen && (
            <div className="p-8 pt-0 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-100 dark:via-slate-800 to-transparent mb-8" />
                {children}
            </div>
        )}
    </div>
);

const Input = ({ label, value, onChange, type = 'text', disabled, placeholder }: any) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 italic">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] outline-none transition-all font-bold text-base sm:text-sm text-slate-700 dark:text-slate-200 shadow-inner placeholder:text-slate-200 dark:placeholder:text-slate-800 disabled:opacity-50"
        />
    </div>
);

const TextArea = ({ label, value, onChange, placeholder }: any) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 italic">{label}</label>
        <textarea
            rows={5}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[2.2rem] outline-none transition-all font-bold text-base sm:text-sm text-slate-700 dark:text-slate-200 shadow-inner resize-none placeholder:text-slate-200 dark:placeholder:text-slate-800 shadow-inner"
        />
    </div>
);

// --- TEMPLATES ---

const TemplateModern = ({ data }: { data: ResumeData }) => (
    <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-10 text-white" style={{ backgroundColor: data.meta.color }}>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">{data.personal.fullName}</h1>
            <p className="text-xl opacity-90 font-medium tracking-wide mb-6">{data.personal.title}</p>

            <div className="flex flex-wrap gap-4 text-sm opacity-90">
                {data.personal.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {data.personal.email}</div>}
                {data.personal.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {data.personal.phone}</div>}
                {data.personal.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {data.personal.location}</div>}
                {data.personal.website && <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {data.personal.website}</div>}
            </div>
        </div>

        <div className="p-10 space-y-8 flex-1">
            {/* Summary */}
            {data.personal.summary && (
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-3 border-b-2 pb-1 inline-block" style={{ borderColor: data.meta.color, color: data.meta.color }}>
                        Professional Summary
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">{data.personal.summary}</p>
                </section>
            )}

            {/* Experience */}
            <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b-2 pb-1 inline-block" style={{ borderColor: data.meta.color, color: data.meta.color }}>
                    Work Experience
                </h3>
                <div className="space-y-6">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-slate-800 text-sm">{exp.role}</h4>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tabular-nums">
                                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                </span>
                            </div>
                            <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">{exp.company}</div>
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects */}
            {data.projects.length > 0 && (
                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b-2 pb-1 inline-block" style={{ borderColor: data.meta.color, color: data.meta.color }}>
                        Operational Logs
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        {data.projects.map(proj => (
                            <div key={proj.id}>
                                <h4 className="font-bold text-slate-800 text-sm">{proj.name}</h4>
                                {proj.link && <div className="text-[10px] text-emerald-600 font-bold underline mb-1">{proj.link}</div>}
                                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education & Skills */}
            <div className="grid grid-cols-2 gap-8">
                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b-2 pb-1 inline-block" style={{ borderColor: data.meta.color, color: data.meta.color }}>
                        Education
                    </h3>
                    <div className="space-y-4">
                        {data.education.map(edu => (
                            <div key={edu.id}>
                                <h4 className="font-bold text-slate-800 text-sm">{edu.school}</h4>
                                <div className="text-xs text-slate-600 font-medium">{edu.degree}</div>
                                <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{edu.startDate} — {edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b-2 pb-1 inline-block" style={{ borderColor: data.meta.color, color: data.meta.color }}>
                        Neural Loadouts
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.split(',').map(skill => (
                            <span key={skill} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    </div>
);

const TemplateClassic = ({ data }: { data: ResumeData }) => (
    <div className="p-12 h-full flex flex-col">
        <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-slate-900">{data.personal.fullName}</h1>
            <p className="text-lg italic text-slate-600 mb-4">{data.personal.title}</p>
            <div className="flex justify-center gap-4 text-sm text-slate-500">
                <span>{data.personal.email}</span>
                <span>•</span>
                <span>{data.personal.phone}</span>
                <span>•</span>
                <span>{data.personal.location}</span>
                {data.personal.website && (
                    <>
                        <span>•</span>
                        <span>{data.personal.website}</span>
                    </>
                )}
            </div>
        </div>

        <div className="space-y-6">
            <section>
                <div className="flex items-center gap-4 mb-3">
                    <h3 className="font-serif font-bold text-lg text-slate-900 uppercase">Profile</h3>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{data.personal.summary}</p>
            </section>

            <section>
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-serif font-bold text-lg text-slate-900 uppercase tracking-widest">Experience</h3>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="space-y-5">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between font-bold text-slate-800 text-sm mb-1 uppercase tracking-tight">
                                <span>{exp.company}</span>
                                <span className="text-xs text-slate-400">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <div className="text-sm italic text-slate-600 mb-2">{exp.role}</div>
                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {data.projects.length > 0 && (
                <section>
                    <div className="flex items-center gap-4 mb-4">
                        <h3 className="font-serif font-bold text-lg text-slate-900 uppercase tracking-widest">Projects</h3>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    <div className="space-y-4">
                        {data.projects.map(proj => (
                            <div key={proj.id}>
                                <div className="font-bold text-slate-800 text-sm uppercase">{proj.name}</div>
                                {proj.link && <div className="text-[10px] text-slate-400 mb-1">{proj.link}</div>}
                                <p className="text-xs text-slate-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-serif font-bold text-lg text-slate-900 uppercase tracking-widest">Education</h3>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="space-y-4">
                    {data.education.map(edu => (
                        <div key={edu.id}>
                            <div className="flex justify-between font-bold text-slate-800 text-sm uppercase tracking-tight">
                                <span>{edu.school}</span>
                                <span className="text-xs text-slate-400">{edu.startDate} — {edu.endDate}</span>
                            </div>
                            <div className="text-sm text-slate-600">{edu.degree}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    </div>
);

const TemplateMinimal = ({ data }: { data: ResumeData }) => (
    <div className="p-12 h-full flex">
        {/* Left Sidebar */}
        <div className="w-1/3 pr-8 border-r border-slate-100">
            <h1 className="text-3xl font-bold leading-tight mb-4 text-slate-900">{data.personal.fullName}</h1>
            <p className="text-emerald-600 font-bold mb-8 uppercase text-xs tracking-widest">{data.personal.title}</p>

            <div className="space-y-6 text-sm">
                <div>
                    <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs">Contact</h4>
                    <div className="space-y-1 text-slate-600">
                        <div className="break-all">{data.personal.email}</div>
                        <div>{data.personal.phone}</div>
                        <div>{data.personal.location}</div>
                        <div>{data.personal.website}</div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs">Education</h4>
                    <div className="space-y-4">
                        {data.education.map(edu => (
                            <div key={edu.id}>
                                <div className="font-bold text-slate-800">{edu.school}</div>
                                <div className="text-slate-600">{edu.degree}</div>
                                <div className="text-slate-400 text-xs">{edu.startDate} — {edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs">Skills</h4>
                    <div className="text-slate-600 leading-relaxed">
                        {data.skills}
                    </div>
                </div>
            </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 pl-8">
            <section className="mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-4">Identity Profile</h3>
                <p className="text-xs leading-loose text-slate-600">{data.personal.summary}</p>
            </section>

            <section className="mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Experience Protocol</h3>
                <div className="space-y-8">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="font-bold text-slate-800 text-xs mb-1 uppercase tabular-nums tracking-tighter">{exp.role}</div>
                            <div className="text-emerald-600 text-[10px] font-black uppercase mb-2">
                                {exp.company} | {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {data.projects.length > 0 && (
                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Operational Logs</h3>
                    <div className="space-y-6">
                        {data.projects.map(proj => (
                            <div key={proj.id}>
                                <div className="font-bold text-slate-800 text-xs uppercase">{proj.name}</div>
                                {proj.link && <div className="text-[10px] text-emerald-600 font-bold mb-1">{proj.link}</div>}
                                <p className="text-xs text-slate-600">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    </div>
);

const TemplateProfessional = ({ data }: { data: ResumeData }) => (
    <div className="p-12 h-full flex flex-col border-l-8" style={{ borderColor: data.meta.color }}>
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2 text-slate-800">{data.personal.fullName}</h1>
        <p className="text-xl font-medium text-slate-600 mb-8">{data.personal.title}</p>

        <div className="flex gap-6 mb-8 text-sm font-bold text-slate-500 border-y py-4 border-slate-200">
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
        </div>

        <div className="space-y-8">
            <section>
                <h3 className="text-[10px] font-black text-slate-900 border-b-2 border-slate-800 mb-4 pb-1 uppercase tracking-widest">Executive Summary</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{data.personal.summary}</p>
            </section>
            <section>
                <h3 className="text-[10px] font-black text-slate-900 border-b-2 border-slate-800 mb-4 pb-1 uppercase tracking-widest">Professional History</h3>
                <div className="space-y-6">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between font-bold text-slate-900 text-xs mb-1 uppercase tracking-tight">
                                <span>{exp.company}</span>
                                <span className="tabular-nums opacity-60">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">{exp.role}</div>
                            <p className="text-xs text-slate-700">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            {data.projects.length > 0 && (
                <section>
                    <h3 className="text-[10px] font-black text-slate-900 border-b-2 border-slate-800 mb-4 pb-1 uppercase tracking-widest">Selected Projects</h3>
                    <div className="space-y-4">
                        {data.projects.map(proj => (
                            <div key={proj.id}>
                                <div className="font-bold text-slate-800 text-xs uppercase">{proj.name}</div>
                                {proj.link && <div className="text-[10px] opacity-60 mb-1">{proj.link}</div>}
                                <p className="text-xs text-slate-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    </div>
);

const TemplateCreative = ({ data }: { data: ResumeData }) => (
    <div className="h-full flex flex-col bg-slate-50 p-8 border-4 border-double" style={{ borderColor: data.meta.color }}>
        <div className="text-center mb-10">
            <h1 className="text-5xl font-black mb-2" style={{ color: data.meta.color }}>{data.personal.fullName}</h1>
            <p className="text-xl font-medium uppercase tracking-[0.2em] text-slate-400">{data.personal.title}</p>
        </div>
        <div className="grid grid-cols-2 gap-12 flex-1">
            <div className="space-y-8">
                <section>
                    <h3 className="font-black text-2xl mb-4 text-slate-800">Manifesto</h3>
                    <p className="text-sm leading-relaxed text-slate-600 font-medium">{data.personal.summary}</p>
                </section>
                <section>
                    <h3 className="font-black text-2xl mb-4 text-slate-800">Communication</h3>
                    <div className="space-y-2 text-xs text-slate-600 font-medium">
                        <div className="block">{data.personal.email}</div>
                        <div className="block">{data.personal.phone}</div>
                        <div className="block">{data.personal.location}</div>
                    </div>
                </section>
                {data.projects.length > 0 && (
                    <section>
                        <h3 className="font-black text-2xl mb-4 text-slate-800">Logs</h3>
                        {data.projects.map(proj => (
                            <div key={proj.id} className="mb-4">
                                <h4 className="font-bold text-xs uppercase">{proj.name}</h4>
                                <p className="text-xs text-slate-500 italic">{proj.description}</p>
                            </div>
                        ))}
                    </section>
                )}
            </div>
            <div className="space-y-8 text-right">
                <section>
                    <h3 className="font-black text-2xl mb-4 text-slate-800">Timeline</h3>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="mb-6">
                            <h4 className="font-bold text-base uppercase tracking-tight">{exp.company}</h4>
                            <div className="text-xs text-emerald-500 font-black mb-2">{exp.role}</div>
                            <p className="text-xs text-slate-600">{exp.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    </div>
);
