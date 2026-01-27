'use client';

import { useState, useMemo, useRef } from 'react';
import { DollarSign, Receipt, Plus, Trash2, Info, Printer, Calendar, FileText, Percent, RefreshCw } from 'lucide-react';

interface TaxPreset {
    name: string;
    rate: number;
    currency: string;
    locale: string;
}

const PRESETS: TaxPreset[] = [
    { name: 'US Average (7.25%)', rate: 7.25, currency: 'USD', locale: 'en-US' },
    { name: 'California (7.25%)', rate: 7.25, currency: 'USD', locale: 'en-US' },
    { name: 'New York (8.875%)', rate: 8.875, currency: 'USD', locale: 'en-US' },
    { name: 'UK VAT (20%)', rate: 20, currency: 'GBP', locale: 'en-GB' },
    { name: 'India GST (18%)', rate: 18, currency: 'INR', locale: 'en-IN' },
    { name: 'China VAT (13%)', rate: 13, currency: 'CNY', locale: 'zh-CN' },
    { name: 'Japan Consumption Tax (10%)', rate: 10, currency: 'JPY', locale: 'ja-JP' },
    { name: 'Germany VAT (19%)', rate: 19, currency: 'EUR', locale: 'de-DE' },
    { name: 'France VAT (20%)', rate: 20, currency: 'EUR', locale: 'fr-FR' },
    { name: 'EU Average (21%)', rate: 21, currency: 'EUR', locale: 'en-IE' }, // Using Ireland for English/Euro
    { name: 'Canada GST (5%)', rate: 5, currency: 'CAD', locale: 'en-CA' },
    { name: 'Australia GST (10%)', rate: 10, currency: 'AUD', locale: 'en-AU' },
];

interface LineItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export function SalesTaxCalculator() {
    const [mode, setMode] = useState<'invoice' | 'reverse'>('invoice');

    // Global Settings
    const [currency, setCurrency] = useState('USD');
    const [locale, setLocale] = useState('en-US');
    const [taxRate, setTaxRate] = useState<number>(7.25);

    // Invoice Metadata
    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}-001`);
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

    // Invoice Items
    const [items, setItems] = useState<LineItem[]>([
        { id: '1', name: 'Service / Product', price: 100, quantity: 1 }
    ]);
    const [discount, setDiscount] = useState<number>(0);
    const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');

    // Reverse Mode State
    const [totalAmount, setTotalAmount] = useState<number>(100);

    // Helpers
    const formatCurrency = (val: number) => {
        try {
            return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(val);
        } catch (e) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
        }
    };

    const handlePresetChange = (presetName: string) => {
        const preset = PRESETS.find(p => p.name === presetName);
        if (preset) {
            setTaxRate(preset.rate);
            setCurrency(preset.currency);
            setLocale(preset.locale);
        }
    };

    // Invoice Calculations
    const invoiceResult = useMemo(() => {
        const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        let discountAmount = 0;
        if (discountType === 'fixed') {
            discountAmount = discount;
        } else {
            discountAmount = (subtotal * discount) / 100;
        }

        const taxableAmount = Math.max(0, subtotal - discountAmount);
        const taxAmount = (taxableAmount * taxRate) / 100;
        const total = taxableAmount + taxAmount;

        return { subtotal, discountAmount, taxableAmount, taxAmount, total };
    }, [items, taxRate, discount, discountType]);

    // Reverse Calculations
    const reverseResult = useMemo(() => {
        const net = totalAmount / (1 + taxRate / 100);
        const taxAmount = totalAmount - net;
        return { net, taxAmount };
    }, [totalAmount, taxRate]);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now().toString(), name: '', price: 0, quantity: 1 }]);
    };

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) setItems(items.filter(i => i.id !== id));
    };

    const handleUpdateItem = (id: string, field: keyof LineItem, value: any) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500 print:space-y-0">
            {/* Semantic Header */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-4 print:hidden">
                <div className="flex items-center gap-6 text-center lg:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Receipt className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Fiscal Synthesis</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Tax Architect</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner w-full lg:w-auto">
                    <button
                        onClick={() => setMode('invoice')}
                        className={`flex-1 lg:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'invoice' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Invoice Engine
                    </button>
                    <button
                        onClick={() => setMode('reverse')}
                        className={`flex-1 lg:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'reverse' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Reverse Nexus
                    </button>
                </div>
            </div>

            {/* Control Matrix */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 p-8 sm:p-12 print:hidden overflow-hidden">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 lg:gap-14">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full xl:w-auto flex-1">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Jurisdiction Vector</label>
                            <div className="relative group">
                                <select
                                    onChange={(e) => handlePresetChange(e.target.value)}
                                    className="w-full px-6 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                                >
                                    <option value="">Manual Configuration</option>
                                    {PRESETS.map(p => (
                                        <option key={p.name} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                    <Percent className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Tax Index (%)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                    className="w-full px-8 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl font-mono font-black text-xl text-slate-900 dark:text-white outline-none transition-all shadow-inner"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 uppercase">Rate</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Computational Field */}
                {mode === 'invoice' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                        {/* Transaction Ledger */}
                        <div className="lg:col-span-2 space-y-10">

                            {/* Metadata Matrix */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 bg-slate-50/50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-50 dark:border-slate-900/50">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ledger Index #</label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="text"
                                            value={invoiceNumber}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                            className="w-full pl-11 pr-5 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 text-xs font-bold shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Timestamp</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="date"
                                            value={invoiceDate}
                                            onChange={(e) => setInvoiceDate(e.target.value)}
                                            className="w-full pl-11 pr-5 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 text-xs font-bold shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center p-6 bg-white dark:bg-slate-950 border-2 border-slate-50 dark:border-slate-900 rounded-[2rem] animate-in fade-in slide-in-from-left-4 duration-500 shadow-sm relative group">
                                        <div className="flex-1">
                                            <label className="text-[8px] font-black uppercase text-slate-300 mb-2 block sm:hidden">Description</label>
                                            <input
                                                type="text"
                                                placeholder="Service Identity"
                                                value={item.name}
                                                onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-xs"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-full sm:w-32">
                                                <label className="text-[8px] font-black uppercase text-slate-300 mb-2 block sm:hidden">Unit Value</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-black">{currency}</div>
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={item.price || ''}
                                                        onChange={(e) => handleUpdateItem(item.id, 'price', Number(e.target.value))}
                                                        className="w-full pl-12 pr-4 py-3 bg-slate-50/50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all font-mono font-black text-xs"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-24 sm:w-20">
                                                <label className="text-[8px] font-black uppercase text-slate-300 mb-2 block sm:hidden">Count</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                                                    className="w-full px-3 py-3 bg-slate-50/50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all font-black text-xs text-center"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={items.length === 1}
                                            className="absolute -top-3 -right-3 sm:relative sm:top-0 sm:right-0 p-3 bg-white dark:bg-slate-800 sm:bg-transparent shadow-lg sm:shadow-none border border-slate-100 sm:border-0 rounded-xl text-slate-300 hover:text-red-500 disabled:opacity-0 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center sm:justify-start">
                                <button
                                    onClick={handleAddItem}
                                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                                >
                                    <Plus className="w-4 h-4" />
                                    Insert Node
                                </button>
                            </div>

                            {/* Adjustment Layer */}
                            <div className="pt-10 border-t border-slate-50 dark:border-slate-900/50">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Flow Incentives (Discount)</label>
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="relative flex-1 sm:w-40">
                                            <input
                                                type="number"
                                                value={discount}
                                                onChange={(e) => setDiscount(Number(e.target.value))}
                                                className="w-full px-5 py-3.5 bg-slate-50/50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 text-sm font-bold shadow-inner"
                                            />
                                        </div>
                                        <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-50 dark:border-slate-900">
                                            <button
                                                onClick={() => setDiscountType('fixed')}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${discountType === 'fixed' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-500' : 'text-slate-400'}`}
                                            >
                                                {currency}
                                            </button>
                                            <button
                                                onClick={() => setDiscountType('percent')}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${discountType === 'percent' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-500' : 'text-slate-400'}`}
                                            >
                                                %
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Synthesis Manifest */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-3">
                                            <Receipt className="w-5 h-5" /> Manifest Summary
                                        </h3>
                                        <button
                                            onClick={handlePrint}
                                            className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-emerald-400 hover:bg-white/10 transition-all"
                                        >
                                            <Printer className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { label: 'Subtotal Flux', value: formatCurrency(invoiceResult.subtotal) },
                                            { label: 'Incentive Delta', value: `-${formatCurrency(invoiceResult.discountAmount)}`, color: 'text-red-400', visible: invoiceResult.discountAmount > 0 },
                                            { label: 'Taxable Nexus', value: formatCurrency(invoiceResult.taxableAmount) },
                                            { label: `Tax Velocity (${taxRate}%)`, value: `+${formatCurrency(invoiceResult.taxAmount)}`, color: 'text-emerald-400' }
                                        ].map((stat, i) => (
                                            (stat.visible !== false) && (
                                                <div key={i} className="flex justify-between items-center">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</span>
                                                    <span className={`font-mono text-sm font-bold ${stat.color || 'text-white/80'}`}>{stat.value}</span>
                                                </div>
                                            )
                                        ))}

                                        <div className="h-px bg-white/5 my-8"></div>

                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-center">Fulfillment Total</div>
                                            <div className="text-4xl font-black text-white tracking-tighter text-center">
                                                {formatCurrency(invoiceResult.total)}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePrint}
                                            className="w-full py-6 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 mt-10 shadow-2xl shadow-emerald-500/20 active:scale-95"
                                        >
                                            <Printer className="w-5 h-5" />
                                            Execute Publication
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* REVERSE NEXUS */
                    <div className="max-w-2xl mx-auto py-10 sm:py-20 animate-in zoom-in-95 duration-700">
                        <div className="bg-slate-50/50 dark:bg-slate-950/50 rounded-[3rem] p-10 sm:p-16 border-2 border-slate-50 dark:border-slate-900 text-center shadow-inner group">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-10 block">
                                Gross Fulfillment Vector ({currency})
                            </label>

                            <div className="relative max-w-sm mx-auto mb-16">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-2xl group-focus-within:scale-125 transition-transform">
                                    {currency}
                                </div>
                                <input
                                    type="number"
                                    value={totalAmount}
                                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                                    className="w-full pl-20 pr-8 py-10 text-5xl sm:text-7xl font-black text-center bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[2.5rem] shadow-2xl outline-none focus:border-emerald-500 transition-all text-slate-900 dark:text-white tracking-tighter"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                                <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm group-hover:border-emerald-500/10 transition-all">
                                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">Pre-Tax Flux</div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                                        {formatCurrency(reverseResult.net)}
                                    </div>
                                </div>
                                <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm group-hover:border-emerald-500/10 transition-all text-right">
                                    <div className="text-[9px] font-black text-emerald-500/40 uppercase tracking-widest mb-3">Tax Component</div>
                                    <div className="text-2xl font-black text-emerald-500 font-mono tracking-tight">
                                        {formatCurrency(reverseResult.taxAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* PRINT TEMPLATE (Hidden by default, shown on print) */}
            <div className="hidden print:block p-8 bg-white text-black">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                        <p className="text-gray-500">#{invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">Date</p>
                        <p>{invoiceDate}</p>
                    </div>
                </div>

                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="text-left py-2">Item</th>
                            <th className="text-center py-2">Qty</th>
                            <th className="text-right py-2">Price</th>
                            <th className="text-right py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-3">{item.name || 'Item'}</td>
                                <td className="text-center py-3">{item.quantity}</td>
                                <td className="text-right py-3">{formatCurrency(item.price)}</td>
                                <td className="text-right py-3">{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-bold">{formatCurrency(invoiceResult.subtotal)}</span>
                        </div>
                        {invoiceResult.discountAmount > 0 && (
                            <div className="flex justify-between text-red-600">
                                <span>Discount:</span>
                                <span>-{formatCurrency(invoiceResult.discountAmount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Tax ({taxRate}%):</span>
                            <span>{formatCurrency(invoiceResult.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between border-t border-black pt-2 text-xl font-bold">
                            <span>Total:</span>
                            <span>{formatCurrency(invoiceResult.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>Generated by Toolboxed.online</p>
                </div>
            </div>
        </div>
    );
}
