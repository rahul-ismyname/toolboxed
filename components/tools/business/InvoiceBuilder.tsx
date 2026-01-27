'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Plus, Trash2, Download, Receipt, Building2, User,
    Settings2, Palette, FileText, ChevronDown, ChevronUp,
    CheckCircle2, AlertCircle, Save, Printer, Upload, Share2
} from 'lucide-react';
import { saveInvoice } from '@/lib/supabase';

// --- TYPES ---

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    tax: number; // Percentage
}

interface InvoiceData {
    meta: {
        invoiceNumber: string;
        date: string;
        dueDate: string;
        currency: string;
        docType: 'Invoice' | 'Proposal' | 'Quote';
        template: 'modern' | 'classic' | 'minimal';
        primaryColor: string;
        font: 'sans' | 'serif' | 'mono';
        logoUrl: string;
        headerNote: string;
        footerNote: string;
    };
    sender: {
        name: string;
        email: string;
        address: string;
        phone: string;
        taxId: string;
        website: string;
    };
    receiver: {
        name: string;
        email: string;
        address: string;
        phone: string;
        taxId: string;
    };
    items: LineItem[];
}

// --- CONSTANTS ---

const DEFAULT_DATA: InvoiceData = {
    meta: {
        invoiceNumber: 'INV-001',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: '$',
        docType: 'Invoice',
        template: 'modern',
        primaryColor: '#3b82f6',
        font: 'sans',
        logoUrl: '',
        headerNote: 'Thank you for your business!',
        footerNote: 'Payment is due within 30 days. Late payments may be subject to a 1.5% monthly fee.'
    },
    sender: {
        name: 'Your Company Name',
        email: 'billing@yourcompany.com',
        address: '123 Business Way\nCity, State 12345',
        phone: '+1 (555) 000-0000',
        taxId: 'TAX-12345678',
        website: 'www.yourcompany.com'
    },
    receiver: {
        name: 'Client Name',
        email: 'client@example.com',
        address: '456 Client Avenue\nSuite 100\nCity, State 67890',
        phone: '+1 (555) 111-2222',
        taxId: 'CLIENT-98765432'
    },
    items: [
        { id: '1', description: 'Consulting Services (Product Strategy)', quantity: 20, rate: 150, tax: 0 },
        { id: '2', description: 'Web Development (Next.js Implementation)', quantity: 40, rate: 120, tax: 10 },
    ]
};

// --- COMPONENTS ---

interface InvoiceBuilderProps {
    initialData?: InvoiceData;
    readOnly?: boolean;
}

export function InvoiceBuilder({ initialData, readOnly = false }: InvoiceBuilderProps) {
    const [data, setData] = useState<InvoiceData>(initialData || DEFAULT_DATA);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [isClient, setIsClient] = useState(false);

    // Sharing State
    const [isSharing, setIsSharing] = useState(false);

    // Share Handler
    const handleShare = async (title?: string, description?: string) => {
        setIsSharing(true);
        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                alert("Sharing is not configured yet. Please set up Supabase keys in .env.local");
                setIsSharing(false);
                return;
            }

            // Simple validation
            if (!data.items.length) {
                alert("Please add at least one item before sharing.");
                setIsSharing(false);
                return;
            }

            // If title provided, it's a public publish
            const isPublic = !!title;

            const result = await saveInvoice(data, {
                title,
                description,
                isPublic
            });

            const url = `https://toolboxed.online/share/invoice/${result.id}`;
            navigator.clipboard.writeText(url);

            if (isPublic) {
                alert("Published to Community Gallery! Link copied.");
            } else {
                alert("Link copied to clipboard!");
            }

        } catch (error) {
            console.error('Error sharing:', error);
            alert("Failed to share invoice. Please try again.");
        } finally {
            setIsSharing(false);
        }
    };


    useEffect(() => {
        setIsClient(true);
        if (readOnly) {
            setActiveTab('preview');
        } else {
            const saved = localStorage.getItem('invoice-data-v1');
            if (saved) {
                try {
                    setData(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to load saved invoice', e);
                }
            }
        }
    }, [readOnly]);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('invoice-data-v1', JSON.stringify(data));
        }
    }, [data, isClient]);

    // CALCULATIONS
    const stats = useMemo(() => {
        const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
        const taxTotal = data.items.reduce((sum, item) => {
            const itemTotal = item.quantity * item.rate;
            return sum + (itemTotal * (item.tax / 100));
        }, 0);
        return {
            subtotal,
            taxTotal,
            total: subtotal + taxTotal
        };
    }, [data.items]);

    const formatCurrency = (amount: number) => {
        return `${data.meta.currency}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const addItem = () => {
        const newItem: LineItem = {
            id: Math.random().toString(36).substr(2, 9),
            description: 'New Service/Item',
            quantity: 1,
            rate: 100,
            tax: 0
        };
        setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const updateItem = (id: string, updates: Partial<LineItem>) => {
        setData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, ...updates } : item)
        }));
    };

    const removeItem = (id: string) => {
        setData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData(prev => ({ ...prev, meta: { ...prev.meta, logoUrl: reader.result as string } }));
            };
            reader.readAsDataURL(file);
        }
    };

    // --- SCALING LOGIC ---
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const container = document.getElementById('invoice-preview-container');
            if (container) {
                const containerWidth = container.clientWidth;
                const baseWidth = 850; // Approx A4 + padding
                // Only scale down if container is smaller than base, otherwise 1
                const newScale = Math.min(1, (containerWidth - 32) / baseWidth);
                setScale(newScale);
            }
        };

        window.addEventListener('resize', handleResize);

        // Trigger resize when switching tabs
        if (activeTab === 'preview') {
            setTimeout(handleResize, 100);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [activeTab]);

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header / Nav */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 py-4 print:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 dark:text-white">Studio</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Invoice</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!readOnly && (
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setActiveTab('edit')}
                                className={`px-3 md:px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'edit' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Settings2 className="w-4 h-4 inline-block md:mr-2" />
                                <span className="hidden md:inline">Build</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-3 md:px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <FileText className="w-4 h-4 inline-block md:mr-2" />
                                <span className="hidden md:inline">Preview</span>
                            </button>
                        </div>
                    )}

                    {/* Share Configuration Modal / Popover could go here, but for now we'll keep it simple inline or add a step */}
                    {isSharing ? (
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Publishing...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* Simple "Make Public" Toggle for Pilot */}
                            <button
                                onClick={() => {
                                    const title = prompt("Name your template (e.g. 'Minimalist Startup Invoice')");
                                    if (!title) return;
                                    const desc = prompt("Describe it briefly");
                                    // Hacky but fast way to pass metadata for the pilot
                                    handleShare(title, desc || '');
                                }}
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all mr-2"
                            >
                                <Share2 className="w-4 h-4" />
                                Publish to Gallery
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => window.print()}
                        className="px-4 md:px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden md:inline">Download</span>
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${activeTab === 'preview' ? 'lg:block print:block' : ''}`}>

                    {/* LEFT: EDITOR */}
                    <div className={`space-y-8 print:hidden ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>

                        {/* Section: Sender Info */}
                        <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Business Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        value={data.sender.name}
                                        onChange={(e) => setData(prev => ({ ...prev, sender: { ...prev.sender, name: e.target.value } }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-medium text-base md:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={data.sender.email}
                                        onChange={(e) => setData(prev => ({ ...prev, sender: { ...prev.sender, email: e.target.value } }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all text-base md:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Website</label>
                                    <input
                                        type="text"
                                        value={data.sender.website}
                                        onChange={(e) => setData(prev => ({ ...prev, sender: { ...prev.sender, website: e.target.value } }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all text-base md:text-sm"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Address</label>
                                    <textarea
                                        rows={2}
                                        value={data.sender.address}
                                        onChange={(e) => setData(prev => ({ ...prev, sender: { ...prev.sender, address: e.target.value } }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all resize-none text-base md:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Receiver Info */}
                        <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg">
                                    <User className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Client Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Client Name</label>
                                    <input
                                        type="text"
                                        value={data.receiver.name}
                                        onChange={(e) => setData(prev => ({ ...prev, receiver: { ...prev.receiver, name: e.target.value } }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-emerald-500 outline-none transition-all font-medium text-base md:text-sm"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Address</label>
                                    <textarea
                                        rows={2}
                                        value={data.receiver.address}
                                        onChange={(e) => setData(prev => ({ ...prev, receiver: { ...prev.receiver, address: e.target.value } }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-emerald-500 outline-none transition-all resize-none text-base md:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Line Items */}
                        <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-lg">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Services & Items</h3>
                                </div>
                                <button
                                    onClick={addItem}
                                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                                >
                                    Add Item
                                </button>
                            </div>

                            <div className="space-y-6">
                                {data.items.map((item, idx) => (
                                    <div key={item.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 relative group overflow-x-auto">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-12 gap-4 min-w-[500px] md:min-w-0">
                                            <div className="col-span-12 md:col-span-6">
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Description</label>
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-base md:text-sm"
                                                />
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Qty</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-base md:text-sm"
                                                />
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Rate</label>
                                                <input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-base md:text-sm"
                                                />
                                            </div>
                                            <div className="col-span-4 md:col-span-2 text-right">
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Tax %</label>
                                                <input
                                                    type="number"
                                                    value={item.tax}
                                                    onChange={(e) => updateItem(item.id, { tax: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-base md:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section: Design & Customization */}
                        <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 rounded-lg">
                                    <Palette className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Design & Customization</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Document Type</label>
                                    <div className="flex gap-2">
                                        {['Invoice', 'Proposal', 'Quote'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setData(prev => ({ ...prev, meta: { ...prev.meta, docType: t as any } }))}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${data.meta.docType === t ? 'bg-slate-900 text-white border-transparent' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Currency</label>
                                    <select
                                        value={data.meta.currency}
                                        onChange={(e) => setData(prev => ({ ...prev, meta: { ...prev.meta, currency: e.target.value } }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
                                    >
                                        <option value="$">USD ($)</option>
                                        <option value="€">EUR (€)</option>
                                        <option value="£">GBP (£)</option>
                                        <option value="₹">INR (₹)</option>
                                        <option value="¥">JPY (¥)</option>
                                        <option value="A$">AUD (A$)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Brand Color</label>
                                    <input
                                        type="color"
                                        value={data.meta.primaryColor}
                                        onChange={(e) => setData(prev => ({ ...prev, meta: { ...prev.meta, primaryColor: e.target.value } }))}
                                        className="w-full h-11 p-1 bg-slate-50 border-2 border-slate-100 rounded-xl cursor-pointer"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Logo (URL or Upload)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="https://example.com/logo.png"
                                            value={data.meta.logoUrl.startsWith('data:') ? 'Local Image Active' : data.meta.logoUrl}
                                            onChange={(e) => setData(prev => ({ ...prev, meta: { ...prev.meta, logoUrl: e.target.value } }))}
                                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all"
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <button className="h-full px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center gap-2">
                                                <Upload className="w-4 h-4" />
                                                <span className="hidden sm:inline">Upload</span>
                                            </button>
                                        </div>
                                        {data.meta.logoUrl && (
                                            <button
                                                onClick={() => setData(prev => ({ ...prev, meta: { ...prev.meta, logoUrl: '' } }))}
                                                className="px-4 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl font-bold text-xs"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Template</label>
                                    <div className="flex gap-2">
                                        {['modern', 'classic', 'minimal'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setData(prev => ({ ...prev, meta: { ...prev.meta, template: t as any } }))}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all border ${data.meta.template === t ? 'bg-slate-900 text-white border-transparent' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Typography</label>
                                    <div className="flex gap-2">
                                        {['sans', 'serif', 'mono'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setData(prev => ({ ...prev, meta: { ...prev.meta, font: f as any } }))}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all border ${data.meta.font === f ? 'bg-slate-900 text-white border-transparent' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Note to Client</label>
                                    <textarea
                                        rows={2}
                                        value={data.meta.footerNote}
                                        onChange={(e) => setData(prev => ({ ...prev, meta: { ...prev.meta, footerNote: e.target.value } }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW (Traditional A4 Aspect Ratio) */}
                    <div id="invoice-preview-container" className={`sticky top-32 ${activeTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
                        <div
                            className={`bg-white text-slate-900 shadow-2xl rounded-sm min-h-[1100px] w-full max-w-[800px] mx-auto overflow-hidden border border-slate-200 origin-top transform transition-all print:shadow-none print:border-none print:scale-100 print:m-0 print:p-0 ${data.meta.font === 'serif' ? 'font-serif' : data.meta.font === 'mono' ? 'font-mono' : 'font-sans'}`}
                            style={{ transform: `scale(${scale})` }}
                        >

                            {/* --- TEMPLATE: MODERN --- */}
                            {data.meta.template === 'modern' && (
                                <div className="p-16 flex flex-col h-full">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-20">
                                        <div>
                                            <h1 className="text-4xl font-black mb-2 tracking-tighter" style={{ color: data.meta.primaryColor }}>{data.meta.docType.toUpperCase()}</h1>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{data.meta.invoiceNumber}</p>
                                        </div>
                                        <div className="text-right">
                                            {data.meta.logoUrl ? (
                                                <img src={data.meta.logoUrl} alt="Logo" className="h-12 w-auto object-contain ml-auto mb-4" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-black text-xl" style={{ backgroundColor: data.meta.primaryColor }}>
                                                    {data.sender.name.charAt(0)}
                                                </div>
                                            )}
                                            <h2 className="font-bold text-slate-800">{data.sender.name}</h2>
                                            <p className="text-sm text-slate-500">{data.sender.email}</p>
                                        </div>
                                    </div>

                                    {/* Billing Grid */}
                                    <div className="grid grid-cols-2 gap-12 mb-20 border-y border-slate-100 py-10">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Bill To</h4>
                                            <h3 className="font-bold text-lg mb-2">{data.receiver.name}</h3>
                                            <p className="text-sm text-slate-500 whitespace-pre-wrap leading-relaxed">{data.receiver.address}</p>
                                        </div>
                                        <div className="text-right space-y-4">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Issue Date</h4>
                                                <p className="font-bold text-sm">{data.meta.date}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Due Date</h4>
                                                <p className="font-bold text-sm text-red-500">{data.meta.dueDate}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items Table */}
                                    <div className="flex-1">
                                        <table className="w-full text-left mb-10">
                                            <thead className="border-b-2 border-slate-900/5">
                                                <tr>
                                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center px-4">Qty</th>
                                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right px-4">Rate</th>
                                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {data.items.map(item => (
                                                    <tr key={item.id} className="text-sm">
                                                        <td className="py-6 font-medium text-slate-700 leading-relaxed max-w-[300px]">{item.description}</td>
                                                        <td className="py-6 text-center text-slate-500 px-4">{item.quantity}</td>
                                                        <td className="py-6 text-right text-slate-500 px-4">{formatCurrency(item.rate)}</td>
                                                        <td className="py-6 text-right font-bold text-slate-900">{formatCurrency(item.quantity * item.rate)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Footer / Summary */}
                                    <div className="pt-10 border-t-2 border-slate-900/5">
                                        <div className="flex justify-between">
                                            <div className="max-w-[300px]">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Note</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed italic">{data.meta.footerNote}</p>
                                            </div>
                                            <div className="w-[200px] space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Subtotal</span>
                                                    <span className="font-bold">{formatCurrency(stats.subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Tax</span>
                                                    <span className="font-bold text-emerald-600">+{formatCurrency(stats.taxTotal)}</span>
                                                </div>
                                                <div className="flex justify-between pt-3 border-t border-slate-200">
                                                    <span className="font-black uppercase tracking-widest text-xs">Total</span>
                                                    <span className="text-2xl font-black" style={{ color: data.meta.primaryColor }}>{formatCurrency(stats.total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TEMPLATE: MINIMAL --- */}
                            {data.meta.template === 'minimal' && (
                                <div className="p-16 flex flex-col h-full font-serif">
                                    <div className="mb-16 flex justify-between items-start">
                                        <div>
                                            <h1 className="text-3xl tracking-tight mb-2">{data.sender.name}</h1>
                                            <p className="text-sm opacity-60 italic">{data.sender.website}</p>
                                        </div>
                                        {data.meta.logoUrl && (
                                            <img src={data.meta.logoUrl} alt="Logo" className="h-10 w-auto object-contain grayscale opacity-60" />
                                        )}
                                    </div>

                                    <div className="flex justify-between items-end mb-24 border-b pb-8">
                                        <div>
                                            <p className="text-sm font-bold mb-4 uppercase tracking-widest">Bill To:</p>
                                            <h3 className="text-xl mb-1">{data.receiver.name}</h3>
                                            <p className="text-sm opacity-60 leading-relaxed">{data.receiver.address}</p>
                                        </div>
                                        <div className="text-right text-sm space-y-1">
                                            <p><span className="opacity-50">{data.meta.docType} No.</span> {data.meta.invoiceNumber}</p>
                                            <p><span className="opacity-50">Date:</span> {data.meta.date}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="grid grid-cols-12 gap-4 pb-4 border-b text-xs font-bold uppercase tracking-widest opacity-40">
                                            <div className="col-span-8">Particulars</div>
                                            <div className="col-span-4 text-right">Amount</div>
                                        </div>
                                        {data.items.map(item => (
                                            <div key={item.id} className="grid grid-cols-12 gap-4 py-8 border-b">
                                                <div className="col-span-8">
                                                    <h4 className="text-lg mb-1">{item.description}</h4>
                                                    <p className="text-xs opacity-50">{item.quantity} units &times; {formatCurrency(item.rate)}</p>
                                                </div>
                                                <div className="col-span-4 text-right text-xl font-light">
                                                    {formatCurrency(item.quantity * item.rate)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end pt-12">
                                        <div className="w-[200px] space-y-4">
                                            <div className="flex justify-between text-sm opacity-60">
                                                <span>Subtotal</span>
                                                <span>{formatCurrency(stats.subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm opacity-60">
                                                <span>Tax</span>
                                                <span>{formatCurrency(stats.taxTotal)}</span>
                                            </div>
                                            <div className="flex justify-between pt-4 border-t text-xl">
                                                <span>Grand Total</span>
                                                <span className="font-bold underline underline-offset-8">{formatCurrency(stats.total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TEMPLATE: CLASSIC --- */}
                            {data.meta.template === 'classic' && (
                                <div className="flex flex-col h-full">
                                    <div className="p-12 text-white flex justify-between items-center" style={{ backgroundColor: data.meta.primaryColor }}>
                                        <div className="flex items-center gap-6">
                                            {data.meta.logoUrl && (
                                                <img src={data.meta.logoUrl} alt="Logo" className="h-10 w-auto object-contain brightness-0 invert" />
                                            )}
                                            <h1 className="text-4xl font-black uppercase tracking-widest">{data.meta.docType}</h1>
                                        </div>
                                        <div className="text-right border-l-2 border-white/20 pl-8">
                                            <p className="text-xs font-bold uppercase opacity-60 tracking-widest mb-1">{data.meta.docType} Number</p>
                                            <p className="text-xl font-black">{data.meta.invoiceNumber}</p>
                                        </div>
                                    </div>
                                    <div className="p-16 flex-1">
                                        <div className="grid grid-cols-2 gap-20 mb-20">
                                            <div className="p-8 bg-slate-50 border-t-4" style={{ borderColor: data.meta.primaryColor }}>
                                                <h4 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">From</h4>
                                                <h3 className="font-black text-xl mb-3 text-slate-800">{data.sender.name}</h3>
                                                <div className="text-sm text-slate-500 space-y-1">
                                                    <p>{data.sender.email}</p>
                                                    <p>{data.sender.phone}</p>
                                                    <p className="whitespace-pre-wrap">{data.sender.address}</p>
                                                    <p className="font-bold text-slate-400 pt-2">{data.sender.taxId}</p>
                                                </div>
                                            </div>
                                            <div className="p-8 bg-slate-50 border-t-4 border-slate-800">
                                                <h4 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Bill To</h4>
                                                <h3 className="font-black text-xl mb-3 text-slate-800">{data.receiver.name}</h3>
                                                <div className="text-sm text-slate-500 space-y-1">
                                                    <p>{data.receiver.email}</p>
                                                    <p>{data.receiver.phone}</p>
                                                    <p className="whitespace-pre-wrap">{data.receiver.address}</p>
                                                    <p className="font-bold text-slate-400 pt-2">{data.receiver.taxId}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <table className="w-full text-left border-collapse mb-10">
                                            <thead>
                                                <tr className="bg-slate-800 text-white text-[10px] uppercase font-black tracking-widest">
                                                    <th className="p-4">Item Details</th>
                                                    <th className="p-4 text-center">Qty</th>
                                                    <th className="p-4 text-right">Rate</th>
                                                    <th className="p-4 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.items.map(item => (
                                                    <tr key={item.id} className="border-b border-slate-100 text-sm">
                                                        <td className="p-4 py-8">
                                                            <p className="font-black text-slate-900 mb-1">{item.description}</p>
                                                        </td>
                                                        <td className="p-4 text-center font-bold text-slate-500">{item.quantity}</td>
                                                        <td className="p-4 text-right font-bold text-slate-500">{formatCurrency(item.rate)}</td>
                                                        <td className="p-4 text-right font-black text-slate-900">{formatCurrency(item.quantity * item.rate)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="flex justify-end pt-10">
                                            <div className="w-[300px] bg-slate-800 p-8 text-white rounded-bl-3xl">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between text-xs font-bold uppercase opacity-60">
                                                        <span>Subtotal</span>
                                                        <span>{formatCurrency(stats.subtotal)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs font-bold uppercase opacity-60">
                                                        <span>Total Tax</span>
                                                        <span>{formatCurrency(stats.taxTotal)}</span>
                                                    </div>
                                                    <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Grand Total</span>
                                                        <span className="text-3xl font-black">{formatCurrency(stats.total)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Print Specific CSS */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        background: white;
                        -webkit-print-color-adjust: exact;
                    }
                    .print-hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}

