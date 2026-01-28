'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Pause, RefreshCw, Trophy, Settings, Timer, Zap, Keyboard,
    Plus, Trash2, StopCircle, Maximize2, Minimize2, Globe, User,
    CheckCircle2, ListFilter, BarChart3, History, Volume2, VolumeX, Ghost
} from 'lucide-react';
import { submitScore, getLeaderboard, LeaderboardEntry } from '@/lib/actions';
import { Button } from '@/components/ui/button'; // Assuming we have or will use standard UI components or raw HTML/Tailwind
// If Button doesn't exist, I'll use standard <button>

const PROGRAMMING_PARAGRAPHS = [
    "The first programmer was Ada Lovelace. She was the daughter of the poet Lord Byron and his wife Anne Isabella Milbanke. Her contributions to the field of computer science were not discovered until the 1950s. Her notes on the Analytical Engine include what is recognised as the first algorithm intended to be processed by a machine.",
    "JavaScript was created in 10 days by Brendan Eich in 1995. Originally called Mocha, then LiveScript, it was finally renamed JavaScript to piggyback on the popularity of Java, despite having very little in common with the language. Today, it is the most popular programming language in the world.",
    "Open source software is software with source code that anyone can inspect, modify, and enhance. Source code is the part of software that most computer users don't ever see; it's the code computer programmers can manipulate to change how a piece of software - a program or application - works.",
    "The Linux kernel is an open-source monolithic Unix-like computer operating system kernel. The Linux family of operating systems is based on this kernel and deployed on both traditional computer systems such as personal computers and servers, usually in the form of Linux distributions, and on various embedded devices.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it. This quote by Brian Kernighan emphasizes the importance of writing clear and readable code over clever hacks.",
    "In computer science, a closure is the combination of a function bundled together with references to its surrounding state. In other words, a closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.",
    "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable and easier to debug.",
    "Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML. CSS is a cornerstone technology of the World Wide Web, alongside HTML and JavaScript. CSS is designed to enable the separation of presentation and content.",
    "Git is a focused version control system. It was originally developed by Linus Torvalds in 2005 for development of the Linux kernel. Git is free and open source software distributed under the terms of the GNU General Public License version 2. Git is a distributed version control system: it tracks changes in any number of files.",
    "Python is an interpreted high-level general-purpose programming language. Its design philosophy emphasizes code readability with its use of significant indentation. Its language constructs as well as its object-oriented approach aim to help programmers write clear, logical code for small and large-scale projects.",
    "The Hypertext Transfer Protocol (HTTP) is an application layer protocol for distributed, collaborative, hypermedia information systems. HTTP is the foundation of data communication for the World Wide Web, where hypertext documents include hyperlinks to other resources that the user can easily access."
];

interface TypeRacerProps {
    onFocusChange?: (isFocus: boolean) => void;
    onThemeChange?: (theme: string) => void;
}

export function TypeRacer({ onFocusChange, onThemeChange }: TypeRacerProps) {
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [gameState, setGameState] = useState<'idle' | 'countdown' | 'racing' | 'paused' | 'finished'>('idle');
    const [countdown, setCountdown] = useState(3);
    const [pausedDuration, setPausedDuration] = useState(0);
    const [pauseTimeStamp, setPauseTimeStamp] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [startTime, setStartTime] = useState<number | null>(null);

    const DIFFICULTY_CONFIG = {
        beginner: { speed: 0.15, label: 'Intern', wpm: 15 },
        easy: { speed: 0.3, label: 'Junior Dev', wpm: 30 },
        medium: { speed: 0.8, label: 'Senior Dev', wpm: 70 },
        hard: { speed: 1.5, label: '10x Engineer', wpm: 120 },
        custom: { speed: 1, label: 'Custom Bot', wpm: 60 }
    };

    type DifficultyType = keyof typeof DIFFICULTY_CONFIG;

    // Bot Configuration State
    const [botConfigs, setBotConfigs] = useState<Array<{ id: string, difficulty: DifficultyType, customWpm: number }>>([
        { id: '1', difficulty: 'easy', customWpm: 30 }
    ]);
    const [bots, setBots] = useState<Array<{ id: string, progress: number, finished: boolean, speed: number, label: string }>>([]);

    // UI State for editing
    const [difficulty, setGlobalDifficulty] = useState<DifficultyType>('easy');
    const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocusMode, setIsFocusModeState] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [activeTheme, setActiveThemeState] = useState<'default' | 'midnight' | 'sepia' | 'nordic'>('default');

    const setActiveTheme = (theme: 'default' | 'midnight' | 'sepia' | 'nordic') => {
        setActiveThemeState(theme);
        onThemeChange?.(theme);
    };
    const [autoPilot, setAutoPilot] = useState(false);
    const [errorFlash, setErrorFlash] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [bestWpm, setBestWpm] = useState(0);
    const [ghostProgress, setGhostProgress] = useState(0);

    // Leaderboard state
    const [username, setUsername] = useState<string>('');
    const [isNaming, setIsNaming] = useState(false);
    const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastScoreId, setLastScoreId] = useState<string | null>(null);

    const triggerHaptics = () => {
        setIsShaking(true);
        setErrorFlash(true);
        setTimeout(() => setIsShaking(false), 300);
        setTimeout(() => setErrorFlash(false), 500);
    };

    const setIsFocusMode = (val: boolean) => {
        setIsFocusModeState(val);
        onFocusChange?.(val);
    };

    // Load username and leaderboard
    useEffect(() => {
        const savedUser = localStorage.getItem('tr_username');
        if (savedUser) setUsername(savedUser);

        const savedBest = localStorage.getItem('tr_best_wpm');
        if (savedBest) setBestWpm(parseInt(savedBest));

        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        const data = await getLeaderboard();
        setGlobalLeaderboard(data);
    };

    const handleScoreSubmission = async () => {
        if (!username || wpm === 0) return;
        setIsSubmitting(true);
        try {
            const result = await submitScore({
                username,
                wpm,
                accuracy,
                difficulty
            });
            if (result.success) {
                setLastScoreId('submitted');
                localStorage.setItem('tr_username', username);
                fetchLeaderboard();
            }
        } catch (error) {
            console.error('Failed to submit score', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Audio Engine
    const audioContextRef = useRef<AudioContext | null>(null);

    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    };

    const playSound = (freq: number, type: OscillatorType, duration: number, volume: number) => {
        if (!audioEnabled) return;
        initAudio();
        const ctx = audioContextRef.current!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.1, ctx.currentTime + duration);

        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    const playClick = () => playSound(400, 'sine', 0.05, 0.1);
    const playThud = () => playSound(100, 'square', 0.2, 0.2);

    const BEGINNER_SENTENCES = [
        "Hello World",
        "Coding is fun",
        "Practice makes perfect",
        "Keep it simple",
        "Never give up",
        "Clean code is happy code",
        "Type fast",
        "Learn continuously",
        "Debug with patience"
    ];

    const inputRef = useRef<HTMLInputElement>(null);
    const resetIdRef = useRef(0);

    useEffect(() => {
        // Load leaderboard and PB on mount
        const saved = localStorage.getItem('type-racer-leaderboard');
        if (saved) {
            setLeaderboard(JSON.parse(saved));
        }
        const pb = localStorage.getItem('type-racer-pb');
        if (pb) setBestWpm(parseInt(pb));
    }, []);

    useEffect(() => {
        // Initialize with random text but don't auto-start
        resetGame(false);
    }, []);

    const resetGame = async (autoStart = true) => {
        const currentResetId = ++resetIdRef.current;
        setGameState('idle');
        setWpm(0);
        setAccuracy(100);
        setBots([]);
        setGameResult(null);
        setStartTime(null);
        setInput('');
        setPausedDuration(0);
        setPauseTimeStamp(null);
        setCountdown(3);

        // Clear focus first to avoid jitter
        if (inputRef.current) inputRef.current.blur();

        let selectedText = '';
        if (difficulty === 'beginner') {
            do {
                selectedText = BEGINNER_SENTENCES[Math.floor(Math.random() * BEGINNER_SENTENCES.length)];
            } while (selectedText === text && BEGINNER_SENTENCES.length > 1);

            if (resetIdRef.current !== currentResetId) return;
            setText(selectedText);

            // Generate single bot for beginner
            const newBots = [{
                id: '1',
                progress: 0,
                finished: false,
                speed: DIFFICULTY_CONFIG['beginner'].speed,
                label: DIFFICULTY_CONFIG['beginner'].label
            }];
            setBots(newBots);

            if (autoStart) {
                setGameState('countdown');
            }
        } else {
            // Fetch from API for variety (non-beginner modes)
            setIsLoading(true);
            try {
                const res = await fetch('https://api.quotable.io/random?minLength=150');
                if (!res.ok) throw new Error('API Failed');
                const data = await res.json();
                if (resetIdRef.current !== currentResetId) return;
                setText(data.content);
            } catch (err) {
                if (resetIdRef.current !== currentResetId) return;
                // Fallback to local
                let randomText = '';
                do {
                    randomText = PROGRAMMING_PARAGRAPHS[Math.floor(Math.random() * PROGRAMMING_PARAGRAPHS.length)];
                } while (randomText === text && PROGRAMMING_PARAGRAPHS.length > 1);
                setText(randomText);
            } finally {
                if (resetIdRef.current !== currentResetId) return;
                setIsLoading(false);
                // Generate Bots from Configs
                const newBots = botConfigs.map(config => {
                    const baseSpeed = config.difficulty === 'custom'
                        ? (config.customWpm / 15) * 0.15 // Scale relative to Intern (15 WPM)
                        : DIFFICULTY_CONFIG[config.difficulty].speed;

                    const variance = (Math.random() * 0.1) - 0.05;
                    return {
                        id: config.id,
                        progress: 0,
                        finished: false,
                        speed: Math.max(0.1, baseSpeed + variance),
                        label: config.difficulty === 'custom'
                            ? `Bot (${config.customWpm} WPM)`
                            : DIFFICULTY_CONFIG[config.difficulty].label
                    };
                });
                setBots(newBots);
                if (autoStart) {
                    setGameState('countdown');
                }
            }
        }
    };

    // Countdown Logic
    useEffect(() => {
        if (gameState !== 'countdown') return;

        if (countdown === 0) {
            const timer = setTimeout(() => {
                startGame();
            }, 500);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [gameState, countdown]);

    // Focus Mode Escape Listener
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsFocusMode(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Global Focus Listener
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Ignore system keys
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            if ((gameState === 'racing' || gameState === 'countdown' || gameState === 'idle') && inputRef.current && document.activeElement !== inputRef.current) {
                inputRef.current.focus();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [gameState]);

    const startGame = () => {
        if (startTime === null) {
            setStartTime(Date.now());
        } else if (pauseTimeStamp !== null) {
            // Calculate how much duration was added during pause AND the countdown
            setPausedDuration(prev => prev + (Date.now() - pauseTimeStamp));
            setPauseTimeStamp(null);
        }
        setGameState('racing');
        if (inputRef.current) inputRef.current.focus();
    };

    const calculateStats = (currentInput: string) => {
        if (!startTime) return;

        const timeElapsed = (Date.now() - startTime - pausedDuration) / 1000 / 60; // in minutes
        const words = currentInput.length / 5;
        const currentWpm = Math.round(words / timeElapsed) || 0;
        setWpm(currentWpm);

        // Accuracy
        let errors = 0;
        for (let i = 0; i < currentInput.length; i++) {
            if (currentInput[i] !== text[i]) errors++;
        }
        const acc = Math.max(0, 100 - Math.round((errors / currentInput.length) * 100)) || 100;
        setAccuracy(acc);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (gameState === 'finished') return;

        if (gameState === 'idle' && val.length > 0) {
            setCountdown(3);
            setGameState('countdown');
            setInput('');
            return;
        }

        setInput(val);
        calculateStats(val);

        if (val.length > input.length) {
            // Check if last char added is correct
            if (val[val.length - 1] === text[val.length - 1]) {
                playClick();
            } else {
                playThud();
                triggerHaptics();
            }
        }

        if (val === text) {
            // User finished. Check if any bot already finished.
            const anyBotFinished = bots.some(b => b.finished);
            const result = anyBotFinished ? 'loss' : 'win';
            endGame(result);
        }
    };

    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboard, setLeaderboard] = useState<Array<{ wpm: number, accuracy: number, date: string, difficulty: string }>>([]);

    useEffect(() => {
        // Load leaderboard on mount
        const saved = localStorage.getItem('type-racer-leaderboard');
        if (saved) {
            setLeaderboard(JSON.parse(saved));
        }
    }, []);

    const saveScore = (wpm: number, accuracy: number, diff: string) => {
        const newScore = {
            wpm,
            accuracy,
            date: new Date().toISOString(),
            difficulty: diff
        };

        const updated = [...leaderboard, newScore]
            .sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy)
            .slice(0, 100);

        setLeaderboard(updated);
        localStorage.setItem('type-racer-leaderboard', JSON.stringify(updated));
    };

    const endGame = (result: 'win' | 'loss') => {
        setGameState('finished');
        setGameResult(result);
        saveScore(wpm, accuracy, 'Multi-Bot');

        if (wpm > bestWpm) {
            setBestWpm(wpm);
            localStorage.setItem('type-racer-pb', wpm.toString());
        }
    };

    const togglePause = () => {
        if (gameState === 'racing') {
            setPauseTimeStamp(Date.now());
            setGameState('paused');
        } else if (gameState === 'paused') {
            // Start countdown instead of direct racing
            setCountdown(3);
            setGameState('countdown');
        }
    };

    // Bot Simulation Loop
    useEffect(() => {
        if (gameState !== 'racing') return;

        const interval = setInterval(() => {
            setBots(prev => {
                const updated = prev.map(bot => {
                    if (bot.finished) return bot;
                    const nextProgress = bot.progress + (bot.speed * (Math.random() + 0.2));
                    if (nextProgress >= 100) {
                        return { ...bot, progress: 100, finished: true };
                    }
                    return { ...bot, progress: nextProgress };
                });
                return updated;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [gameState, botConfigs]);

    // Ghost Mode Loop
    useEffect(() => {
        if (gameState !== 'racing' || bestWpm === 0 || !text.length) {
            setGhostProgress(0);
            return;
        }

        const interval = setInterval(() => {
            setGhostProgress(prev => {
                const charsPerSec = (bestWpm * 5) / 60;
                const progressPerSec = (charsPerSec / text.length) * 100;
                const next = prev + (progressPerSec / 10); // 100ms interval
                return Math.min(100, next);
            });
        }, 100);

        return () => clearInterval(interval);
    }, [gameState, bestWpm, text.length]);

    // Auto-Pilot Logic
    useEffect(() => {
        if (gameState === 'finished' && autoPilot) {
            const timer = setTimeout(() => {
                resetGame(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [gameState, autoPilot]);

    // Character Rendering Logic
    const renderText = () => {
        return text.split('').map((char, index) => {
            let color = isFocusMode ? t.paragraph : 'text-slate-400';
            let bg = 'transparent';
            let border = '';

            if (index < input.length) {
                if (input[index] === char) {
                    color = isFocusMode ? `${t.text} font-bold` : 'text-emerald-500';
                } else {
                    color = 'text-red-500 font-bold';
                    bg = 'bg-red-500/10';
                }
            } else if (index === input.length) {
                // Next character to type
                color = isFocusMode ? t.accent : 'text-emerald-500';
                border = 'border-b-2 border-current pb-1';
                bg = isFocusMode ? '' : 'bg-emerald-500/10';
            }

            return (
                <span key={index} className={`${color} ${bg} ${border} px-[1px] transition-all duration-150`}>{char}</span>
            );
        });
    };

    const THEMES: Record<string, any> = {
        default: {
            container: 'bg-white dark:bg-slate-900',
            card: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
            text: 'text-slate-900 dark:text-white',
            accent: 'text-emerald-500',
            accentHex: '#10b981',
            ghost: 'text-emerald-500/20',
            subtle: 'text-slate-400',
            paragraph: 'text-slate-500'
        },
        midnight: {
            container: 'bg-[#010409]',
            card: 'bg-[#0d1117] border-[#30363d]',
            text: 'text-white',
            accent: 'text-sky-400',
            accentHex: '#38bdf8',
            ghost: 'text-sky-400/20',
            subtle: 'text-slate-500',
            paragraph: 'text-slate-400'
        },
        sepia: {
            container: 'bg-[#f4ecd8]',
            card: 'bg-[#fdf6e3] border-[#eee8d5]',
            text: 'text-[#433422]',
            accent: 'text-[#b58900]',
            accentHex: '#b58900',
            ghost: 'text-[#b58900]/20',
            subtle: 'text-[#857a67]',
            paragraph: 'text-[#857a67]'
        },
        nordic: {
            container: 'bg-[#242933]',
            card: 'bg-[#2e3440] border-[#434c5e]',
            text: 'text-[#eceff4]',
            accent: 'text-[#88c0d0]',
            accentHex: '#88c0d0',
            ghost: 'text-[#88c0d0]/20',
            subtle: 'text-[#4c566a]',
            paragraph: 'text-[#919fb5]'
        }
    };

    const t = isFocusMode ? THEMES[activeTheme] : THEMES.default;

    return (
        <div className={`flex flex-col gap-8 mx-auto transition-all duration-500 ease-in-out ${isFocusMode ? 'max-w-6xl py-12 px-4 min-h-[80vh] justify-center' : 'max-w-4xl'}`}>
            {/* Visual Haptics */}
            {errorFlash && isFocusMode && (
                <div className="fixed inset-0 pointer-events-none z-[100] shadow-[inset_0_0_100px_rgba(239,68,68,0.15)] animate-pulse" />
            )}

            {/* Progress Bar (Elite Focus) */}
            {isFocusMode && gameState === 'racing' && (
                <div className="fixed top-0 left-0 w-full h-[2px] bg-white/5 z-[100]">
                    <div
                        className={`h-full transition-all duration-200 shadow-[0_0_10px_rgba(16,185,129,0.5)]`}
                        style={{ width: `${(input.length / (text.length || 1)) * 100}%`, backgroundColor: t.accentHex }}
                    />
                </div>
            )}

            {/* Header / Stats - Hidden in Focus Mode */}
            {!isFocusMode && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-sm col-span-2 md:col-span-1">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Opponents</span>
                            <button
                                onClick={() => setBotConfigs(prev => [...prev, { id: Date.now().toString(), difficulty: 'medium', customWpm: 60 }])}
                                disabled={gameState === 'racing' || gameState === 'countdown'}
                                className="bg-emerald-500/10 text-emerald-500 p-1 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                            {botConfigs.map((config, index) => (
                                <div key={config.id} className="flex flex-col gap-1 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center justify-between gap-2">
                                        <select
                                            value={config.difficulty}
                                            disabled={gameState === 'racing' || gameState === 'countdown'}
                                            onChange={(e) => {
                                                const newConfigs = [...botConfigs];
                                                newConfigs[index].difficulty = e.target.value as any;
                                                setBotConfigs(newConfigs);
                                            }}
                                            className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none flex-1"
                                        >
                                            <option value="beginner">Intern</option>
                                            <option value="easy">Junior</option>
                                            <option value="medium">Senior</option>
                                            <option value="hard">10x Eng</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                        <button
                                            onClick={() => setBotConfigs(prev => prev.filter(b => b.id !== config.id))}
                                            disabled={gameState === 'racing' || gameState === 'countdown'}
                                            className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    {config.difficulty === 'custom' && (
                                        <input
                                            type="number"
                                            disabled={gameState === 'racing' || gameState === 'countdown'}
                                            value={config.customWpm}
                                            onChange={(e) => {
                                                const newConfigs = [...botConfigs];
                                                newConfigs[index].customWpm = Math.max(5, parseInt(e.target.value) || 5);
                                                setBotConfigs(newConfigs);
                                            }}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 text-[10px] font-mono text-emerald-500 focus:outline-none focus:ring-1 ring-emerald-500"
                                        />
                                    )}
                                </div>
                            ))}
                            {botConfigs.length === 0 && (
                                <span className="text-[10px] text-slate-500 text-center py-2 italic font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">No opponents. Just you vs time.</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">{wpm}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Speed WPM</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">{accuracy}%</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Accuracy</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setShowLeaderboard(!showLeaderboard)}>
                        <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                            <Keyboard className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-lg font-black text-slate-900 dark:text-white leading-none">Top 100</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Leaderboard</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ultra-Focus HUD */}
            {isFocusMode && (
                <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700 mb-8">
                    <div className="flex gap-12 items-baseline">
                        <div className="flex flex-col items-center">
                            <span className={`text-5xl font-black tabular-nums leading-none tracking-tighter ${t.accent}`}>{wpm}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-50 ${t.text}`}>Words Per Minute</span>
                        </div>
                        <div className={`flex flex-col items-center border-l border-slate-200 dark:border-slate-800 pl-12`}>
                            <span className={`text-5xl font-black tabular-nums leading-none tracking-tighter transition-all ${t.text}`}>{accuracy}%</span>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-50 ${t.text}`}>Typing Accuracy</span>
                        </div>
                    </div>

                    {/* Zen Settings Panel */}
                    <div className="flex items-center gap-6 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
                        <div className="flex items-center gap-2 border-r border-white/10 pr-6">
                            {(['default', 'midnight', 'sepia', 'nordic'] as const).map(theme => (
                                <button
                                    key={theme}
                                    onClick={() => setActiveTheme(theme)}
                                    className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-125 ${activeTheme === theme ? 'border-emerald-500 scale-110' : 'border-transparent opacity-50'}`}
                                    style={{ backgroundColor: theme === 'default' ? '#10b981' : theme === 'midnight' ? '#0f172a' : theme === 'sepia' ? '#eee8d5' : '#3b4252' }}
                                    title={`Theme: ${theme}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => setAudioEnabled(!audioEnabled)}
                            className={`p-1.5 rounded-lg transition-colors ${audioEnabled ? 'bg-emerald-500/20 text-emerald-500' : 'text-white/40 hover:text-white/60'}`}
                            title="Rhythmic Click Sounds"
                        >
                            <Keyboard className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setAutoPilot(!autoPilot)}
                            className={`p-1.5 rounded-lg transition-colors ${autoPilot ? 'bg-sky-500/20 text-sky-500' : 'text-white/40 hover:text-white/60'}`}
                            title="Auto-Pilot (Loop Races)"
                        >
                            <RefreshCw className={`w-4 h-4 ${autoPilot ? 'animate-spin-slow' : ''}`} />
                        </button>
                        <div className="w-[1px] h-4 bg-white/10" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">ESC to exit</span>
                    </div>
                </div>
            )}

            {/* Leaderboard Modal/Section */}
            {!isFocusMode && showLeaderboard && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in slide-in-from-top-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-lg">🏆 Hall of Fame (Top 100)</h3>
                        <button onClick={() => setShowLeaderboard(false)} className="text-slate-400 hover:text-slate-600">Close</button>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Rank</th>
                                    <th className="px-6 py-3">WPM</th>
                                    <th className="px-6 py-3">Accuracy</th>
                                    <th className="px-6 py-3">Difficulty</th>
                                    <th className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">No scores yet. Start racing!</td>
                                    </tr>
                                ) : (
                                    leaderboard.map((score, i) => (
                                        <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-3 font-bold text-slate-400">#{i + 1}</td>
                                            <td className="px-6 py-3 font-bold text-emerald-600 dark:text-emerald-400">{score.wpm}</td>
                                            <td className="px-6 py-3">{score.accuracy}%</td>
                                            <td className="px-6 py-3 capitalize text-slate-500">{score.difficulty}</td>
                                            <td className="px-6 py-3 text-slate-400 text-xs">{new Date(score.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Car Tracks (Hidden in Focus Mode) */}
            {!isFocusMode && bots.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in duration-500">
                    <div className="flex flex-col gap-1">
                        {/* Bot Tracks */}
                        {bots.map((bot) => (
                            <div key={bot.id} className="relative h-10 flex items-center opacity-80 hover:opacity-100 transition-opacity">
                                <div className="absolute left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800 rounded-full" />
                                <div
                                    className="absolute transition-all duration-300 ease-out flex items-center gap-2"
                                    style={{ left: `${bot.progress}%`, transform: 'translateX(-100%)' }}
                                >
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{bot.label}</span>
                                        <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded shadow-sm flex items-center justify-center">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                                {bot.finished && (
                                    <div className="absolute right-0 text-emerald-500 animate-bounce">
                                        <Trophy className="w-4 h-4 fill-current" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* User Track */}
                        <div className="relative h-14 flex items-center mt-2">
                            <div className="absolute left-0 right-0 h-[3px] bg-slate-200 dark:bg-slate-800 rounded-full" />
                            <div
                                className="absolute transition-all duration-200 ease-out flex items-center gap-2"
                                style={{
                                    left: `${(input.length / (text.length || 1)) * 100}%`,
                                    transform: 'translateX(-100%)'
                                }}
                            >
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-black text-emerald-500 uppercase tracking-tighter">You</span>
                                    <div className="w-12 h-6 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center transform hover:scale-110 transition-transform">
                                        <Keyboard className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Game Over Overlay */}
            {gameState === 'finished' && gameResult && (
                <div className="animate-in fade-in zoom-in duration-300 bg-white dark:bg-slate-900 border-2 border-emerald-500 p-8 rounded-3xl text-center shadow-2xl">
                    <div className="mb-4 flex justify-center">
                        {gameResult === 'win' ? (
                            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
                                <Trophy className="w-12 h-12" />
                            </div>
                        ) : (
                            <div className="p-4 bg-red-100 text-red-600 rounded-full">
                                <Timer className="w-12 h-12" />
                            </div>
                        )}
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                        {gameResult === 'win' ? 'Victory!' : 'Keep Practicing!'}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {gameResult === 'win'
                            ? `You finished ahead of all ${bots.length} competitors!`
                            : `At least one bot was faster than you this time. Keep practicing!`}
                    </p>

                    <div className="flex justify-center gap-8 mb-8">
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{wpm}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase">WPM</div>
                        </div>
                        <div className="text-center border-l border-slate-200 pl-8">
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{accuracy}%</div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Accuracy</div>
                        </div>
                    </div>

                    {/* Global Submission Section */}
                    <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                        {!username ? (
                            <div className="flex flex-col gap-3">
                                <span className="text-xs font-bold text-slate-500 uppercase">Enter Username for Global Leaderboard</span>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Display Name"
                                        className="flex-grow px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 ring-emerald-500/20 font-bold"
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleScoreSubmission()}
                                    />
                                    <button
                                        onClick={handleScoreSubmission}
                                        disabled={!username || isSubmitting}
                                        className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Join Global Hall of Fame'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-slate-400 uppercase">Racing as</div>
                                        <div className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{username}</div>
                                    </div>
                                </div>
                                {lastScoreId === 'submitted' ? (
                                    <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase italic drop-shadow-sm">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Score Synchronized
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleScoreSubmission}
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
                                    >
                                        {isSubmitting ? 'Syncing...' : 'Sync Global Score'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => resetGame(true)}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/30 transform hover:-translate-y-1"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Next Race
                        </button>
                    </div>
                </div>
            )}

            {/* Typing Area */}
            {gameState !== 'finished' && (
                <div className={`relative group transition-all duration-500 ${isFocusMode ? 'scale-110' : ''} ${isShaking ? 'animate-shake' : ''}`}>
                    <div
                        className={`p-8 md:p-12 rounded-2xl border shadow-sm min-h-[220px] font-mono leading-relaxed transition-all group-focus-within:ring-2 ring-emerald-500/50 ${isFocusMode ? 'text-4xl leading-loose shadow-2xl' : 'text-2xl leading-relaxed'} ${t.card} ${t.text}`}
                        onClick={() => (gameState === 'racing' || gameState === 'countdown' || gameState === 'idle') && inputRef.current?.focus()}
                    >
                        {/* Ghost Caret */}
                        {isFocusMode && gameState === 'racing' && ghostProgress > 0 && ghostProgress < 100 && (
                            <div
                                className={`absolute h-1 w-8 transition-all duration-100 opacity-50 z-0 border-b-4 border-dashed pointer-events-none`}
                                style={{
                                    left: `${ghostProgress}%`,
                                    top: '50%',
                                    borderColor: t.accentHex
                                }}
                            />
                        )}

                        {gameState === 'idle' && (
                            <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl z-10 pointer-events-none transition-opacity duration-500 ${isFocusMode ? 'opacity-30' : 'opacity-100'}`}>
                                <span className={`${isFocusMode ? 'hidden' : 'text-slate-500 font-bold animate-pulse'}`}>
                                    {isLoading ? 'Generating new race track...' : 'Start typing to begin race...'}
                                </span>
                            </div>
                        )}
                        {gameState === 'countdown' && (
                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none z-20">
                                <div className="text-9xl font-black text-emerald-500/60 animate-in zoom-in duration-300">
                                    {countdown > 0 ? countdown : 'GO!'}
                                </div>
                            </div>
                        )}
                        {gameState === 'paused' && (
                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-30 cursor-pointer pointer-events-auto" onClick={togglePause}>
                                <div className="bg-white/90 dark:bg-slate-900/90 px-8 py-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 animate-in zoom-in duration-200">
                                    <Play className="w-10 h-10 fill-current text-emerald-500" />
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Paused</span>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Click to Resume</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {renderText()}
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInput}
                        onKeyDown={(e) => {
                            if (gameState === 'idle' && (e.key === ' ' || e.key === 'Enter')) {
                                e.preventDefault();
                                setCountdown(3);
                                setGameState('countdown');
                            }
                        }}
                        disabled={gameState !== 'racing' && gameState !== 'idle'}
                        className="opacity-0 absolute top-0 left-0 w-full h-full cursor-text"
                        autoFocus
                    />
                </div>
            )}

            {/* Footer Actions */}
            {!isFocusMode && (
                <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                    {(gameState === 'racing' || gameState === 'paused') && (
                        <button
                            onClick={togglePause}
                            className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl hover:scale-105 transition-transform ${gameState === 'paused'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                                }`}
                        >
                            {gameState === 'paused' ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                            {gameState === 'paused' ? 'Resume' : 'Pause'}
                        </button>
                    )}
                    <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl hover:scale-105 transition-transform"
                        title={isFocusMode ? "Exit Focus" : "Enter Focus"}
                    >
                        {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        {isFocusMode ? "Exit Focus" : "Focus Mode"}
                    </button>
                    <button
                        onClick={() => resetGame(false)}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-600 font-bold rounded-xl hover:bg-red-500/20 transition-colors"
                    >
                        <StopCircle className="w-5 h-5" />
                        Stop & Reset
                    </button>
                    <button
                        onClick={() => resetGame(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
                    >
                        <RefreshCw className="w-5 h-5" />
                        New Race
                    </button>
                </div>
            )}
            {/* Global Leaderboard Section */}
            {!isFocusMode && (
                <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Global Hall of Fame</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top 100 Racers Worldwide</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchLeaderboard}
                            className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                            title="Refresh Rankings"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Racer</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Speed</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Accuracy</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {globalLeaderboard.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                                            No global records yet. Be the first to claim your spot!
                                        </td>
                                    </tr>
                                ) : (
                                    globalLeaderboard.map((entry, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group ${entry.username === username ? 'bg-emerald-50/50 dark:bg-emerald-500/5' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className={`w-7 h-7 flex items-center justify-center rounded-lg font-black text-xs ${index === 0 ? 'bg-yellow-100 text-yellow-600 shadow-sm' :
                                                        index === 1 ? 'bg-slate-200 text-slate-600 shadow-sm' :
                                                            index === 2 ? 'bg-orange-100 text-orange-600 shadow-sm' :
                                                                'text-slate-400'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${entry.username === username ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                                        {entry.username}
                                                    </span>
                                                    {entry.username === username && (
                                                        <span className="text-[10px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">You</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-lg font-black text-slate-900 dark:text-white">{entry.wpm}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase ml-1">WPM</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{entry.accuracy}%</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${entry.difficulty === 'hard' ? 'bg-red-50 text-red-500 border-red-100' :
                                                        entry.difficulty === 'medium' ? 'bg-sky-50 text-sky-500 border-sky-100' :
                                                            'bg-slate-50 text-slate-500 border-slate-100'
                                                    }`}>
                                                    {entry.difficulty}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
