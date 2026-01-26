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
        <div className="space-y-8 print:space-y-0">
            {/* Controls Header (Hidden in Print) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-8 print:hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">

                    {/* Mode Switcher */}
                    <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl">
                        <button
                            onClick={() => setMode('invoice')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'invoice' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Invoice Calculator
                        </button>
                        <button
                            onClick={() => setMode('reverse')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'reverse' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Reverse Tax
                        </button>
                    </div>

                    {/* Global Tax Rate */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none">
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                Region / Currency
                            </label>
                            <select
                                onChange={(e) => handlePresetChange(e.target.value)}
                                className="w-full md:w-48 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
                            >
                                <option value="">Custom Rate</option>
                                {PRESETS.map(p => (
                                    <option key={p.name} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 md:flex-none">
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                Tax Rate (%)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                    className="w-full md:w-32 pl-3 pr-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                {mode === 'invoice' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LINE ITEMS */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Invoice Metadata Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Invoice #</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={invoiceNumber}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-sm font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            type="date"
                                            value={invoiceDate}
                                            onChange={(e) => setInvoiceDate(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 text-sm font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div key={item.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-4 duration-300">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Item Name"
                                                value={item.name}
                                                onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all font-medium text-sm"
                                            />
                                        </div>
                                        <div className="w-28">
                                            <div className="relative">
                                                <div className="absolute left-3 top-3.5 text-xs text-slate-400 font-bold">{currency === 'USD' ? '$' : currency}</div>
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={item.price || ''}
                                                    onChange={(e) => handleUpdateItem(item.id, 'price', Number(e.target.value))}
                                                    className="w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-20">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                                                className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-sm text-center"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={items.length === 1}
                                            className="p-3 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={handleAddItem}
                                    className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 px-2 py-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Line Item
                                </button>
                            </div>

                            {/* Discount Section */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-bold text-slate-500">Discount</label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-32">
                                            <input
                                                type="number"
                                                value={discount}
                                                onChange={(e) => setDiscount(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-emerald-500 text-sm font-medium"
                                            />
                                        </div>
                                        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg">
                                            <button
                                                onClick={() => setDiscountType('fixed')}
                                                className={`px-2 py-1 rounded text-xs font-bold ${discountType === 'fixed' ? 'bg-white shadow text-emerald-600' : 'text-slate-400'}`}
                                            >
                                                {currency}
                                            </button>
                                            <button
                                                onClick={() => setDiscountType('percent')}
                                                className={`px-2 py-1 rounded text-xs font-bold ${discountType === 'percent' ? 'bg-white shadow text-emerald-600' : 'text-slate-400'}`}
                                            >
                                                %
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* INVOICE SUMMARY PANEL */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 sticky top-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                        <Receipt className="w-4 h-4" /> Summary
                                    </h3>
                                    <button
                                        onClick={handlePrint}
                                        className="text-slate-400 hover:text-emerald-500 transition-colors"
                                        title="Print Invoice"
                                    >
                                        <Printer className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
                                        <span>Subtotal</span>
                                        <span className="font-medium">{formatCurrency(invoiceResult.subtotal)}</span>
                                    </div>

                                    {invoiceResult.discountAmount > 0 && (
                                        <div className="flex justify-between items-center text-sm text-red-500">
                                            <span>Discount</span>
                                            <span className="font-medium">-{formatCurrency(invoiceResult.discountAmount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
                                        <span>Taxable Amount</span>
                                        <span className="font-medium">{formatCurrency(invoiceResult.taxableAmount)}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
                                        <span>Tax ({taxRate}%)</span>
                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">+{formatCurrency(invoiceResult.taxAmount)}</span>
                                    </div>

                                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                                            {formatCurrency(invoiceResult.total)}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handlePrint}
                                        className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg shadow-slate-200/50 dark:shadow-none"
                                    >
                                        <Printer className="w-5 h-5" />
                                        Print Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* REVERSE MODE */
                    <div className="max-w-xl mx-auto">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 text-center">
                            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wide">
                                Total Amount ({currency})
                            </label>

                            <div className="relative max-w-xs mx-auto mb-8">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                                    {currency === 'USD' ? '$' : currency}
                                </div>
                                <input
                                    type="number"
                                    value={totalAmount}
                                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                                    className="w-full pl-16 pr-4 py-4 text-3xl font-black text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Pre-Tax Price</div>
                                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(reverseResult.net)}
                                    </div>
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Tax Amount</div>
                                    <div className="text-xl font-bold text-emerald-500">
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
