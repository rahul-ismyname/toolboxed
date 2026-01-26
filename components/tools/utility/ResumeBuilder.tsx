'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Download, LayoutTemplate, Palette, Type, Save,
    Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
    Briefcase, GraduationCap, User, Wrench, FolderOpen, Mail, Phone, MapPin, Globe, Linkedin, Github
} from 'lucide-react';

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

    useEffect(() => {
        setIsClient(true);
        const saved = localStorage.getItem('resume-data');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load saved resume", e);
            }
        }
    }, []);

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
    const getFontClass = () => {
        switch (data.meta.font) {
            case 'serif': return 'font-serif';
            case 'mono': return 'font-mono';
            default: return 'font-sans';
        }
    };

    if (!isClient) return null;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 overflow-hidden">

            {/* --- LEFT: EDITOR --- */}
            <div className="w-full lg:w-[450px] xl:w-[500px] flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full overflow-hidden print:hidden z-10 shadow-xl">
                {/* Editor Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-emerald-500" />
                        Editor
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                if (confirm('Reset all data?')) setData(INITIAL_DATA);
                            }}
                            className="text-xs font-semibold text-slate-400 hover:text-red-500 px-2 py-1"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Design Controls */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase text-slate-400">
                            <Palette className="w-4 h-4" /> Design
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Template</label>
                                <select
                                    value={data.meta.template}
                                    onChange={(e) => updateMeta('template', e.target.value)}
                                    className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                >
                                    <option value="modern">Modern</option>
                                    <option value="classic">Classic</option>
                                    <option value="minimal">Minimal</option>
                                    <option value="professional">Professional</option>
                                    <option value="creative">Creative</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Color</label>
                                <div className="flex gap-2">
                                    {['#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#1f2937'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => updateMeta('color', c)}
                                            className={`w-6 h-6 rounded-full border-2 ${data.meta.color === c ? 'border-slate-900 dark:border-white' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <Section
                        title="Personal Info"
                        icon={User}
                        isOpen={activeSection === 'personal'}
                        onToggle={() => setActiveSection(activeSection === 'personal' ? null : 'personal')}
                    >
                        <div className="space-y-3">
                            <Input label="Full Name" value={data.personal.fullName} onChange={v => updatePersonal('fullName', v)} />
                            <Input label="Job Title" value={data.personal.title} onChange={v => updatePersonal('title', v)} />
                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Email" value={data.personal.email} onChange={v => updatePersonal('email', v)} />
                                <Input label="Phone" value={data.personal.phone} onChange={v => updatePersonal('phone', v)} />
                            </div>
                            <Input label="Location" value={data.personal.location} onChange={v => updatePersonal('location', v)} />
                            <Input label="Website / LinkedIn" value={data.personal.website} onChange={v => updatePersonal('website', v)} />
                            <TextArea label="Professional Summary" value={data.personal.summary} onChange={v => updatePersonal('summary', v)} />
                        </div>
                    </Section>

                    {/* Experience */}
                    <Section
                        title="Experience"
                        icon={Briefcase}
                        isOpen={activeSection === 'experience'}
                        onToggle={() => setActiveSection(activeSection === 'experience' ? null : 'experience')}
                    >
                        <div className="space-y-6">
                            {data.experience.map((exp, idx) => (
                                <div key={exp.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 relative group">
                                    <button
                                        onClick={() => {
                                            const newExp = data.experience.filter(e => e.id !== exp.id);
                                            setData(prev => ({ ...prev, experience: newExp }));
                                        }}
                                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="space-y-3">
                                        <Input label="Company" value={exp.company} onChange={v => {
                                            const newExp = [...data.experience];
                                            newExp[idx].company = v;
                                            setData(prev => ({ ...prev, experience: newExp }));
                                        }} />
                                        <Input label="Role" value={exp.role} onChange={v => {
                                            const newExp = [...data.experience];
                                            newExp[idx].role = v;
                                            setData(prev => ({ ...prev, experience: newExp }));
                                        }} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input label="Start Date" type="month" value={exp.startDate} onChange={v => {
                                                const newExp = [...data.experience];
                                                newExp[idx].startDate = v;
                                                setData(prev => ({ ...prev, experience: newExp }));
                                            }} />
                                            <Input label="End Date" type="month" value={exp.endDate} disabled={exp.current} onChange={v => {
                                                const newExp = [...data.experience];
                                                newExp[idx].endDate = v;
                                                setData(prev => ({ ...prev, experience: newExp }));
                                            }} />
                                        </div>
                                        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                                            <input
                                                type="checkbox"
                                                checked={exp.current}
                                                onChange={e => {
                                                    const newExp = [...data.experience];
                                                    newExp[idx].current = e.target.checked;
                                                    setData(prev => ({ ...prev, experience: newExp }));
                                                }}
                                                className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                                            />
                                            I currently work here
                                        </label>
                                        <TextArea label="Description (• for bullets)" value={exp.description} onChange={v => {
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
                                        company: 'New Company',
                                        role: 'Role',
                                        location: '',
                                        startDate: '',
                                        endDate: '',
                                        current: false,
                                        description: ''
                                    }]
                                }))}
                                className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Position
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
                        <div className="space-y-6">
                            {data.education.map((edu, idx) => (
                                <div key={edu.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 relative group">
                                    <button
                                        onClick={() => {
                                            const newEdu = data.education.filter(e => e.id !== edu.id);
                                            setData(prev => ({ ...prev, education: newEdu }));
                                        }}
                                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="space-y-3">
                                        <Input label="School / University" value={edu.school} onChange={v => {
                                            const newEdu = [...data.education];
                                            newEdu[idx].school = v;
                                            setData(prev => ({ ...prev, education: newEdu }));
                                        }} />
                                        <Input label="Degree / Major" value={edu.degree} onChange={v => {
                                            const newEdu = [...data.education];
                                            newEdu[idx].degree = v;
                                            setData(prev => ({ ...prev, education: newEdu }));
                                        }} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input label="Start Date" type="month" value={edu.startDate} onChange={v => {
                                                const newEdu = [...data.education];
                                                newEdu[idx].startDate = v;
                                                setData(prev => ({ ...prev, education: newEdu }));
                                            }} />
                                            <Input label="End Date" type="month" value={edu.endDate} onChange={v => {
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
                                        school: 'University',
                                        degree: 'Degree',
                                        location: '',
                                        startDate: '',
                                        endDate: '',
                                        description: ''
                                    }]
                                }))}
                                className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Education
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
                            onChange={v => setData(prev => ({ ...prev, skills: v }))}
                            placeholder="Design, React, Typescript..."
                        />
                    </Section>

                </div>
            </div>

            {/* --- RIGHT: PREVIEW --- */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-8 overflow-y-auto flex justify-center relative">

                {/* PDF Actions */}
                <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-black hover:scale-105 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                        <Download className="w-5 h-5" />
                        Download PDF
                    </button>
                </div>

                <div className="fixed top-24 right-8 z-40 print:hidden text-xs text-slate-400 font-medium">
                    <span className="bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                        <Save className="w-3 h-3 text-emerald-500" /> Auto-saved
                    </span>
                </div>

                {/* --- A4 PAPER --- */}
                <div
                    id="resume-preview"
                    className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl mx-auto origin-top transition-transform duration-300 ${getFontClass()}`}
                    style={{ transform: 'scale(0.85) translateY(-20px)' }} // Scale down slightly for fit
                >
                    {data.meta.template === 'modern' && <TemplateModern data={data} />}
                    {data.meta.template === 'classic' && <TemplateClassic data={data} />}
                    {data.meta.template === 'minimal' && <TemplateMinimal data={data} />}
                    {data.meta.template === 'professional' && <TemplateProfessional data={data} />}
                    {data.meta.template === 'creative' && <TemplateCreative data={data} />}
                </div>

            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

const Section = ({ title, icon: Icon, children, isOpen, onToggle }: any) => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
            <div className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-200">
                <Icon className="w-5 h-5 text-slate-400" />
                {title}
            </div>
            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {isOpen && <div className="p-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">{children}</div>}
    </div>
);

const Input = ({ label, value, onChange, type = 'text', disabled }: any) => (
    <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
        />
    </div>
);

const TextArea = ({ label, value, onChange }: any) => (
    <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{label}</label>
        <textarea
            rows={4}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:border-emerald-500 outline-none transition-all resize-none"
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
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 inline-block" style={{ borderColor: data.meta.color, color: data.meta.color }}>
                    Work Experience
                </h3>
                <div className="space-y-6">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-slate-800">{exp.role}</h4>
                                <span className="text-xs font-semibold text-slate-500">
                                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                </span>
                            </div>
                            <div className="text-sm font-semibold text-slate-600 mb-2">{exp.company}</div>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education & Skills */}
            <div className="grid grid-cols-2 gap-8">
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 inline-block" style={{ borderColor: data.meta.color, color: data.meta.color }}>
                        Education
                    </h3>
                    <div className="space-y-4">
                        {data.education.map(edu => (
                            <div key={edu.id}>
                                <h4 className="font-bold text-slate-800 text-sm">{edu.school}</h4>
                                <div className="text-sm text-slate-600">{edu.degree}</div>
                                <div className="text-xs text-slate-400 mt-1">{edu.startDate} — {edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 inline-block" style={{ borderColor: data.meta.color, color: data.meta.color }}>
                        Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.split(',').map(skill => (
                            <span key={skill} className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-700">
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
                    <h3 className="font-serif font-bold text-lg text-slate-900 uppercase">Experience</h3>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="space-y-5">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between font-bold text-slate-800 text-sm mb-1">
                                <span>{exp.company}</span>
                                <span>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <div className="text-sm italic text-slate-600 mb-2">{exp.role}</div>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-serif font-bold text-lg text-slate-900 uppercase">Education</h3>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="space-y-4">
                    {data.education.map(edu => (
                        <div key={edu.id}>
                            <div className="flex justify-between font-bold text-slate-800 text-sm">
                                <span>{edu.school}</span>
                                <span>{edu.startDate} — {edu.endDate}</span>
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
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-4">Profile</h3>
                <p className="text-sm leading-loose text-slate-600">{data.personal.summary}</p>
            </section>

            <section>
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-6">Experience</h3>
                <div className="space-y-8">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="font-bold text-slate-800 text-sm mb-1">{exp.role}</div>
                            <div className="text-emerald-600 text-xs font-semibold mb-2">
                                {exp.company} | {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    </div>
);
