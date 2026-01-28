'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, RefreshCw, Trophy, Settings, Timer, Zap, Keyboard } from 'lucide-react';
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

export function TypeRacer() {
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [gameState, setGameState] = useState<'idle' | 'racing' | 'finished'>('idle');
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Bot State
    const [botProgress, setBotProgress] = useState(0);
    const [botFinished, setBotFinished] = useState(false);

    const [difficulty, setDifficulty] = useState<'beginner' | 'easy' | 'medium' | 'hard' | 'custom'>('medium');
    const [customWpm, setCustomWpm] = useState(60);
    const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const DIFFICULTY_CONFIG = {
        beginner: { speed: 0.15, label: 'Intern', wpm: 15 },
        easy: { speed: 0.3, label: 'Junior Dev', wpm: 30 },
        medium: { speed: 0.8, label: 'Senior Dev', wpm: 70 },
        hard: { speed: 1.5, label: '10x Engineer', wpm: 120 },
        custom: { speed: 1, label: 'Custom Bot', wpm: customWpm }
    };

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

    useEffect(() => {
        // Load leaderboard on mount
        const saved = localStorage.getItem('type-racer-leaderboard');
        if (saved) {
            setLeaderboard(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        // Initialize with random text
        resetGame();
    }, [difficulty]); // Depend on difficulty to reload text

    const resetGame = async () => {
        setGameState('idle');
        setWpm(0);
        setAccuracy(100);
        setBotProgress(0);
        setBotFinished(false);
        setGameResult(null);
        setStartTime(null);
        setInput('');

        // Clear focus first to avoid jitter
        if (inputRef.current) inputRef.current.blur();

        if (difficulty === 'beginner') {
            const selectedText = BEGINNER_SENTENCES[Math.floor(Math.random() * BEGINNER_SENTENCES.length)];
            setText(selectedText);
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            // Fetch from API for variety (non-beginner modes)
            setIsLoading(true);
            try {
                const res = await fetch('https://api.quotable.io/random?minLength=150');
                if (!res.ok) throw new Error('API Failed');
                const data = await res.json();
                setText(data.content);
            } catch (err) {
                // Fallback to local
                const randomText = PROGRAMMING_PARAGRAPHS[Math.floor(Math.random() * PROGRAMMING_PARAGRAPHS.length)];
                setText(randomText);
            } finally {
                setIsLoading(false);
                setTimeout(() => inputRef.current?.focus(), 50);
            }
        }
    };

    const startGame = () => {
        setGameState('racing');
        setStartTime(Date.now());
        if (inputRef.current) inputRef.current.focus();
    };

    const calculateStats = (currentInput: string) => {
        if (!startTime) return;

        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
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
            startGame();
        }

        setInput(val);
        calculateStats(val);

        if (val === text) {
            // User finished. Check if bot already finished.
            const result = botFinished ? 'loss' : 'win';
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
        saveScore(wpm, accuracy, difficulty);
    };

    // Bot Simulation Loop
    useEffect(() => {
        if (gameState !== 'racing') return;

        const interval = setInterval(() => {
            if (botFinished) return;

            setBotProgress(prev => {
                const next = prev + (DIFFICULTY_CONFIG[difficulty].speed * (Math.random() + 0.2));
                if (next >= 100) {
                    setBotFinished(true);
                    return 100;
                }
                return next;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [gameState, difficulty, botFinished]);

    // Character Rendering Logic
    const renderText = () => {
        return text.split('').map((char, index) => {
            let color = 'text-slate-400';
            let bg = 'transparent';

            if (index < input.length) {
                if (input[index] === char) {
                    color = 'text-emerald-500';
                } else {
                    color = 'text-red-500';
                    bg = 'bg-red-100';
                }
            } else if (index === input.length) {
                bg = 'bg-slate-200 dark:bg-slate-700 animate-pulse'; // Cursor
            }

            return (
                <span key={index} className={`${color} ${bg} px-[1px] rounded-[1px] transition-colors`}>{char}</span>
            );
        });
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {/* Header / Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Difficulty Selector */}
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm col-span-2 md:col-span-1">
                    <div className="flex flex-col w-full gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Opponent</span>
                        <div className="flex items-center gap-2">
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value as any)}
                                disabled={gameState === 'racing'}
                                className="bg-transparent font-bold text-slate-800 dark:text-white px-2 py-1 cursor-pointer focus:outline-none flex-1"
                            >
                                <option value="beginner">Intern (Beginner)</option>
                                <option value="easy">Junior Dev</option>
                                <option value="medium">Senior Dev</option>
                                <option value="hard">10x Engineer</option>
                                <option value="custom">Custom WPM</option>
                            </select>
                            {difficulty === 'custom' && (
                                <input
                                    type="number"
                                    min="5"
                                    max="200"
                                    value={customWpm}
                                    onChange={(e) => setCustomWpm(Math.min(200, Math.max(5, parseInt(e.target.value) || 5)))}
                                    className="w-16 px-1 py-0.5 text-sm bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-center"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{wpm}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase">WPM</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
                    <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{accuracy}%</div>
                        <div className="text-xs font-bold text-slate-400 uppercase">Accuracy</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setShowLeaderboard(!showLeaderboard)}>
                    <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-lg font-black text-slate-900 dark:text-white">Top 100</div>
                        <div className="text-xs font-bold text-slate-400 uppercase">Leaderboard</div>
                    </div>
                </div>
            </div>

            {/* Leaderboard Modal/Section */}
            {showLeaderboard && (
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

            {/* Race Track */}
            <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-8">
                {/* User Car */}
                <div className="relative h-12 flex items-center">
                    <div
                        className="absolute transition-all duration-300 ease-out z-10"
                        style={{ left: `${Math.min(100, (input.length / text.length) * 100)}%` }}
                    >
                        <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full -translate-x-1/2 whitespace-nowrap mb-2 shadow-sm border-2 border-white dark:border-slate-900">
                            You
                        </div>
                        <div className="w-10 h-6 bg-emerald-500 rounded-lg -translate-x-1/2 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                            <Keyboard className="w-4 h-4 text-emerald-200" />
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500/20" style={{ width: `${(input.length / text.length) * 100}%` }}></div>
                    </div>
                </div>

                {/* Bot Car */}
                <div className="relative h-12 flex items-center">
                    <div
                        className="absolute transition-all duration-300 ease-linear z-10"
                        style={{ left: `${botProgress}%` }}
                    >
                        <div className="bg-slate-500 text-white text-xs font-bold px-3 py-1 rounded-full -translate-x-1/2 whitespace-nowrap mb-2 shadow-sm border-2 border-white dark:border-slate-900">
                            {DIFFICULTY_CONFIG[difficulty].label}
                        </div>
                        <div className="w-10 h-6 bg-slate-500 rounded-lg -translate-x-1/2 shadow-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-slate-300" />
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-500/20" style={{ width: `${botProgress}%` }}></div>
                    </div>
                </div>
            </div>

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
                            ? `You typed faster than the ${DIFFICULTY_CONFIG[difficulty].label} bot!`
                            : `The ${DIFFICULTY_CONFIG[difficulty].label} bot was too fast this time.`}
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

                    <button
                        onClick={resetGame}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/30 transform hover:-translate-y-1"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Race Again
                    </button>
                </div>
            )}

            {/* Typing Area */}
            {gameState !== 'finished' && (
                <div className="relative group">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[200px] text-2xl font-mono leading-relaxed transition-all group-focus-within:ring-2 ring-emerald-500/50" onClick={() => inputRef.current?.focus()}>
                        {gameState === 'idle' && (
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl z-10">
                                <span className="text-slate-500 font-bold animate-pulse">
                                    {isLoading ? 'Generating new race track...' : 'Start typing to begin race...'}
                                </span>
                            </div>
                        )}
                        {renderText()}
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInput}
                        className="opacity-0 absolute top-0 left-0 w-full h-full cursor-text"
                        autoFocus
                    />
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-center">
                <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
                >
                    <RefreshCw className="w-5 h-5" />
                    Restart Race
                </button>
            </div>
        </div>
    );
}
