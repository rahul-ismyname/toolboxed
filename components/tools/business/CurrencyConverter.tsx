'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, ArrowRightLeft, TrendingUp } from 'lucide-react';

interface ExchangeData {
    result: string;
    time_last_update_unix: number;
    base_code: string;
    rates: Record<string, number>;
}

interface CachedData {
    data: ExchangeData;
    timestamp: number;
}

const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];

export function CurrencyConverter() {
    const [amount, setAmount] = useState<number>(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [rates, setRates] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const CACHE_KEY = 'currency_rates_cache';
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    const fetchRates = async (forceObj = false) => {
        setLoading(true);
        setError(null);
        try {
            // Check cache first
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached && !forceObj) {
                const parsed: CachedData = JSON.parse(cached);
                const now = Date.now();
                if (now - parsed.timestamp < CACHE_DURATION) {
                    setRates(parsed.data.rates);
                    setLastUpdated(new Date(parsed.data.time_last_update_unix * 1000).toLocaleString());
                    setLoading(false);
                    return;
                }
            }

            // Fetch new data
            const response = await fetch('https://open.er-api.com/v6/latest/USD');
            if (!response.ok) throw new Error('Failed to fetch rates');

            const data: ExchangeData = await response.json();

            // Save to cache
            const cachePayload: CachedData = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));

            setRates(data.rates);
            setLastUpdated(new Date(data.time_last_update_unix * 1000).toLocaleString());
        } catch (err) {
            setError('Could not load exchange rates. Please ensure you are online.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const convert = (val: number, from: string, to: string) => {
        if (!rates[from] || !rates[to]) return 0;
        // Convert to USD first (base), then to target
        const inUsd = val / rates[from];
        return inUsd * rates[to];
    };

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const allCurrencies = Object.keys(rates).sort();
    const result = convert(amount, fromCurrency, toCurrency);

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <TrendingUp className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Global Liquidity</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Currency Oracle</p>
                    </div>
                </div>
                <button
                    onClick={() => fetchRates(true)}
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/20 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Sync Protocol Buffers
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-16">
                    {error ? (
                        <div className="p-12 bg-red-500/5 dark:bg-red-500/10 rounded-[3rem] border-2 border-red-500/10 text-center animate-in zoom-in-95">
                            <div className="text-red-500 font-black uppercase tracking-widest mb-6">Link Interruption</div>
                            <p className="text-sm text-red-400 mb-8 font-medium">{error}</p>
                            <button onClick={() => fetchRates(true)} className="px-10 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95">Re-establish Uplink</button>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
                                {/* Liquidity Vector */}
                                <div className="lg:col-span-4 space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Liquidity Quantity</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                                        className="w-full px-8 py-6 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] text-3xl font-mono font-black text-slate-900 dark:text-white outline-none transition-all shadow-inner"
                                    />
                                </div>

                                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-11 gap-6 items-center">
                                    {/* Dispatch Node */}
                                    <div className="sm:col-span-5 space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Dispatch Currency</label>
                                        <div className="relative group">
                                            <select
                                                value={fromCurrency}
                                                onChange={(e) => setFromCurrency(e.target.value)}
                                                className="w-full px-8 py-6 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] text-sm font-bold text-slate-700 dark:text-slate-300 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                                            >
                                                <optgroup label="Core Markets" className="bg-white dark:bg-slate-900">
                                                    {COMMON_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </optgroup>
                                                <optgroup label="Global Flow" className="bg-white dark:bg-slate-900">
                                                    {allCurrencies.filter(c => !COMMON_CURRENCIES.includes(c)).map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </optgroup>
                                            </select>
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-emerald-500 transition-colors">
                                                <ArrowRightLeft className="w-4 h-4 rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Swap Flow */}
                                    <div className="sm:col-span-1 flex justify-center py-4">
                                        <button
                                            onClick={handleSwap}
                                            className="w-16 h-16 rounded-[1.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:scale-110 active:rotate-180 transition-all shadow-2xl z-10 group"
                                        >
                                            <ArrowRightLeft className="w-6 h-6 group-hover:animate-pulse" />
                                        </button>
                                    </div>

                                    {/* Fulfillment Node */}
                                    <div className="sm:col-span-5 space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Fulfillment Currency</label>
                                        <div className="relative group">
                                            <select
                                                value={toCurrency}
                                                onChange={(e) => setToCurrency(e.target.value)}
                                                className="w-full px-8 py-6 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] text-sm font-bold text-slate-700 dark:text-slate-300 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                                            >
                                                <optgroup label="Core Markets" className="bg-white dark:bg-slate-900">
                                                    {COMMON_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </optgroup>
                                                <optgroup label="Global Flow" className="bg-white dark:bg-slate-900">
                                                    {allCurrencies.filter(c => !COMMON_CURRENCIES.includes(c)).map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </optgroup>
                                            </select>
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-emerald-500 transition-colors">
                                                <ArrowRightLeft className="w-4 h-4 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Manifest Projection */}
                            <div className="relative group mt-16 sm:mt-20">
                                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-[3.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative p-12 sm:p-20 bg-slate-900 dark:bg-slate-950 rounded-[3.5rem] border border-white/5 text-center shadow-3xl overflow-hidden">
                                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-10">Real-time Liquidity Fulfillment</div>
                                    <div className="flex flex-col items-center justify-center gap-6 sm:gap-10">
                                        <div className="flex flex-wrap items-center justify-center gap-6">
                                            <div className="text-xl font-bold text-white/30 font-mono tracking-tight hidden sm:block italic">
                                                {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {fromCurrency} ≈
                                            </div>
                                            <div className="text-6xl sm:text-[9rem] font-black text-white tracking-tighter leading-none animate-in zoom-in-95 duration-700">
                                                {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                            <div className="text-3xl sm:text-5xl font-black text-emerald-500 uppercase tracking-tighter sm:mt-8">
                                                {toCurrency}
                                            </div>
                                        </div>

                                        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 px-10 py-5 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Sync Time: {lastUpdated || 'Pending...'}</span>
                                            </div>
                                            <div className="hidden sm:block w-px h-4 bg-white/10" />
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Mid-Market Standard Nexus</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Protocol Meta */}
            <div className="text-center pb-8 opacity-20 group">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 group-hover:text-emerald-500 transition-colors duration-500">
                    Dimensional Exchange Protocol // FISCAL v2.0 Standard
                </p>
            </div>
        </div>
    );
}
