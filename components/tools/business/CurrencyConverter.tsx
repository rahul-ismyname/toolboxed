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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 md:p-8">
                {/* Header / Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
                            Live Exchange Rates
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {lastUpdated ? `Last updated: ${lastUpdated}` : 'Loading...'}
                        </p>
                    </div>
                    <button
                        onClick={() => fetchRates(true)}
                        disabled={loading}
                        className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Rates
                    </button>
                </div>

                {error ? (
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg text-center font-medium opacity-100 translate-y-0 transition-all duration-300 ease-in-out">
                        {error}
                        <button onClick={() => fetchRates(true)} className="ml-2 underline hover:text-red-700">Try again</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                        {/* Amount */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>

                        {/* From */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">From</label>
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            >
                                <optgroup label="Popular">
                                    {COMMON_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </optgroup>
                                <optgroup label="All">
                                    {allCurrencies.filter(c => !COMMON_CURRENCIES.includes(c)).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>

                        {/* Swap Button */}
                        <div className="flex justify-center md:pt-6">
                            <button
                                onClick={handleSwap}
                                className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-500 transition-all transform hover:rotate-180"
                            >
                                <ArrowRightLeft className="w-5 h-5" />
                            </button>
                        </div>

                        {/* To */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">To</label>
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            >
                                <optgroup label="Popular">
                                    {COMMON_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </optgroup>
                                <optgroup label="All">
                                    {allCurrencies.filter(c => !COMMON_CURRENCIES.includes(c)).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                    </div>
                )}

                {/* Result */}
                <div className="mt-12 text-center p-8 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">
                        {amount} {fromCurrency} =
                    </div>
                    <div className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-2xl md:text-3xl text-emerald-500 ml-3">{toCurrency}</span>
                    </div>
                    <div className="mt-4 text-xs text-slate-400 dark:text-slate-600">
                        Mid-market exchange rate at {lastUpdated}
                    </div>
                </div>
            </div>
        </div>
    );
}
