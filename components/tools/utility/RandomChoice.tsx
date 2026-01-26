'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
    Shuffle,
    Trash2,
    Plus,
    Sparkles,
    Trophy,
    ListTodo,
    HelpCircle,
    History as HistoryIcon,
    Settings2,
    RotateCcw,
    Copy,
    Check,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    Volume2,
    VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- TYPES ---

interface Choice {
    id: string;
    text: string;
    weight: number; // 1-10
}

interface HistoryItem {
    id: string;
    winners: string[];
    timestamp: Date;
}

const TEMPLATES = [
    { name: '🌯 Lunch Options', items: ['Pizza', 'Sushi', 'Burgers', 'Salad', 'Tacos', 'Pasta', 'Curry', 'Sandwiches'] },
    { name: '🎲 Game Night', items: ['Catan', 'Ticket to Ride', 'Codenames', 'Monopoly', 'Risk', 'Pictionary', 'Uno'] },
    { name: '🎥 Movie Genres', items: ['Sci-Fi', 'Horror', 'Comedy', 'Drama', 'Action', 'Documentary', 'Thriller'] },
    { name: '🪙 Coin Flip', items: ['Heads', 'Tails'] },
];

export function RandomChoice() {
    const [input, setInput] = useState('');
    const [choices, setChoices] = useState<Choice[]>([]);
    const [winners, setWinners] = useState<string[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const [pickIndex, setPickIndex] = useState(0);

    // Configuration
    const [winnerCount, setWinnerCount] = useState(1);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [copied, setCopied] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [sparklePositions, setSparklePositions] = useState<{ top: string, left: string }[]>([]);

    // Audio Ref for future expansion
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Generate random positions only on the client to avoid hydration mismatch
        const positions = [...Array(6)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
        }));
        setSparklePositions(positions);
    }, []);

    const addChoices = () => {
        const lines = input.split(/[\n,]/).map(c => c.trim()).filter(c => c.length > 0);
        const newChoices: Choice[] = lines.map(text => ({
            id: Math.random().toString(36).substr(2, 9),
            text,
            weight: 1
        }));

        // Filter out duplicates based on text
        setChoices(prev => {
            const existingTexts = new Set(prev.map(c => c.text));
            const filtered = newChoices.filter(nc => !existingTexts.has(nc.text));
            return [...prev, ...filtered];
        });
        setInput('');
    };

    const loadTemplate = (items: string[]) => {
        const newChoices: Choice[] = items.map(text => ({
            id: Math.random().toString(36).substr(2, 9),
            text,
            weight: 1
        }));
        setChoices(newChoices);
        setWinners([]);
    };

    const removeChoice = (id: string) => {
        setChoices(prev => prev.filter(c => c.id !== id));
    };

    const updateWeight = (id: string, weight: number) => {
        setChoices(prev => prev.map(c => c.id === id ? { ...c, weight: Math.max(1, Math.min(10, weight)) } : c));
    };

    const clearAll = () => {
        setChoices([]);
        setWinners([]);
        setInput('');
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    // Logic for weighted picking
    const getWeightedRandom = (currentChoices: Choice[], excludeList: string[] = []) => {
        const pool = currentChoices.filter(c => !excludeList.includes(c.text));
        if (pool.length === 0) return null;

        const totalWeight = pool.reduce((sum, c) => sum + c.weight, 0);
        let random = Math.random() * totalWeight;

        for (const choice of pool) {
            if (random < choice.weight) return choice.text;
            random -= choice.weight;
        }
        return pool[pool.length - 1].text;
    };

    const pickRandom = async () => {
        if (choices.length < 2 || isShuffling) return;
        setIsShuffling(true);
        setWinners([]);

        // Animated Shuffle Simulation
        let iterations = 24;
        for (let i = 0; i < iterations; i++) {
            setPickIndex(Math.floor(Math.random() * choices.length));
            // Progressive slowdown
            await new Promise(resolve => setTimeout(resolve, 60 + (i * 12)));
        }

        // Picking winners
        const finalWinners: string[] = [];
        const count = Math.min(winnerCount, choices.length);

        for (let i = 0; i < count; i++) {
            const winner = getWeightedRandom(choices, finalWinners);
            if (winner) finalWinners.push(winner);
        }

        setWinners(finalWinners);
        setHistory(prev => [{
            id: Math.random().toString(36).substr(2, 9),
            winners: finalWinners,
            timestamp: new Date()
        }, ...prev].slice(0, 10)); // Keep last 10

        triggerConfetti();
        setIsShuffling(false);
    };

    const copyToClipboard = () => {
        if (winners.length === 0) return;
        navigator.clipboard.writeText(winners.join(', '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header with quick stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Random Picker <span className="text-emerald-500">PRO</span></h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Weighted selection & multi-winner support</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-3 rounded-xl border transition-all ${soundEnabled ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'}`}
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-bold text-xs transition-all ${showHistory ? 'bg-emerald-500 text-white border-transparent' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'}`}
                    >
                        <HistoryIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">History</span>
                        {history.length > 0 && <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-md text-[10px]">{history.length}</span>}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Setup & Input */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Main Input Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <ListTodo className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Add Choices</h3>
                        </div>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addChoices())}
                            placeholder="Type options here... (Enter or comma to add)"
                            className="w-full h-32 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-medium resize-none text-sm mb-4"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={addChoices}
                                disabled={!input.trim()}
                                className="py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                            >
                                <Plus className="w-4 h-4 inline-block mr-1" /> Add
                            </button>
                            <button
                                onClick={clearAll}
                                className="py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-red-500 transition-all border border-slate-100 dark:border-slate-700"
                            >
                                <Trash2 className="w-4 h-4 inline-block mr-1" /> Clear
                            </button>
                        </div>
                    </div>

                    {/* Templates Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-slate-800">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Templates</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {TEMPLATES.map(template => (
                                <button
                                    key={template.name}
                                    onClick={() => loadTemplate(template.items)}
                                    className="w-full p-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-all flex justify-between items-center group border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
                                >
                                    {template.name}
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MIDDLE COLUMN: Stage */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 min-h-[500px] flex flex-col justify-between items-center relative overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
                        {/* Interactive Sparkles Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none overflow-hidden opacity-10">
                            {sparklePositions.map((pos, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 90, 0],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 10 + i * 2, repeat: Infinity }}
                                    className="absolute"
                                    style={{
                                        top: pos.top,
                                        left: pos.left,
                                        color: ['#10b981', '#3b82f6', '#f59e0b'][i % 3]
                                    }}
                                >
                                    <Sparkles className="w-24 h-24" />
                                </motion.div>
                            ))}
                        </div>

                        {choices.length < 2 ? (
                            <div className="m-auto text-center space-y-6 animate-pulse">
                                <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <HelpCircle className="w-10 h-10 text-slate-300" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-400">Add 2+ options to start</h4>
                            </div>
                        ) : (
                            <>
                                <div className="w-full space-y-8 text-center pt-8">
                                    <AnimatePresence mode='wait'>
                                        {isShuffling ? (
                                            <motion.div
                                                key="shuffling"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 1.2, opacity: 0 }}
                                                className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white px-4 leading-tight italic"
                                            >
                                                {choices[pickIndex]?.text}
                                            </motion.div>
                                        ) : winners.length > 0 ? (
                                            <motion.div
                                                key="winner"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="space-y-6"
                                            >
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-emerald-500/30">
                                                    <Trophy className="w-3 h-3" /> The Result
                                                </div>
                                                <div className="space-y-4">
                                                    {winners.map((win, idx) => (
                                                        <motion.div
                                                            key={win}
                                                            initial={{ x: -20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            className={`text-4xl md:text-6xl font-black ${idx === 0 ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}
                                                        >
                                                            {win}
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-center gap-3 pt-4">
                                                    <button
                                                        onClick={copyToClipboard}
                                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
                                                    >
                                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                        {copied ? 'Copied' : 'Copy'}
                                                    </button>
                                                    <button
                                                        onClick={() => { setWinners([]); triggerConfetti(); }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
                                                    >
                                                        <RotateCcw className="w-4 h-4" /> Re-pick
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="ready"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="py-12"
                                            >
                                                <h1 className="text-7xl font-black text-slate-100 dark:text-slate-950 uppercase tracking-tighter">Ready?</h1>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={pickRandom}
                                    disabled={isShuffling}
                                    className={`relative z-20 px-12 py-6 rounded-3xl font-black uppercase tracking-widest text-lg shadow-2xl transition-all border-b-8 active:border-b-0 active:translate-y-2 mb-8 ${isShuffling ? 'bg-slate-200 text-slate-400 border-slate-300 dark:bg-slate-800 dark:border-slate-900' : 'bg-emerald-500 text-white border-emerald-700 hover:bg-emerald-400 hover:border-emerald-600'}`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Shuffle className={`w-6 h-6 ${isShuffling ? 'animate-spin' : ''}`} />
                                        {isShuffling ? 'DECIDING...' : 'LET\'S GO!'}
                                    </span>
                                </motion.button>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Settings & Choices List */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Winner Settings */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6 font-black text-xs uppercase tracking-widest text-slate-400">
                            <Settings2 className="w-4 h-4" /> Settings
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Winner Count</label>
                                    <span className="text-lg font-black text-emerald-500">{winnerCount}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max={Math.max(1, choices.length)}
                                    value={winnerCount}
                                    onChange={(e) => setWinnerCount(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Choices Weighting List */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex-1 overflow-visible">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Pool ({choices.length})</h4>
                        </div>

                        <div className="space-y-3 max-h-[400px] pr-2 overflow-y-auto custom-scrollbar">
                            <AnimatePresence initial={false}>
                                {choices.map((choice) => (
                                    <motion.div
                                        key={choice.id}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-black text-slate-700 dark:text-slate-200 truncate pr-4">{choice.text}</span>
                                            <button
                                                onClick={() => removeChoice(choice.id)}
                                                className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[8px] font-black uppercase text-slate-400">Weight</span>
                                                    <span className="text-[10px] font-black text-emerald-500">x{choice.weight}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => updateWeight(choice.id, (i + 1) * 2)}
                                                            className={`h-1 flex-1 rounded-full transition-all ${choice.weight >= (i + 1) * 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {choices.length === 0 && (
                                <p className="text-center py-8 text-xs text-slate-400 font-medium italic">Your list is empty...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SLIDE-OVER: HISTORY */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-50 p-8 border-l border-slate-100 dark:border-slate-800 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-xl font-black uppercase tracking-tighter">Recent Picks</h3>
                            <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        {history.length > 0 ? (
                            <div className="space-y-6">
                                {history.map((item) => (
                                    <div key={item.id} className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                                            <span>{item.timestamp.toLocaleTimeString()}</span>
                                            <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded">{item.winners.length} picked</span>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200">
                                            {item.winners.join(', ')}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setHistory([])}
                                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                >
                                    Clear History
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                <HistoryIcon className="w-12 h-12 mb-4" />
                                <p className="font-bold uppercase tracking-widest text-xs">No picks yet</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default RandomChoice;
