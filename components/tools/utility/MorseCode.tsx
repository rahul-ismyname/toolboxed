'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Copy, Check, Play, Square, RotateCcw, Type, Settings2, Activity } from 'lucide-react';

const MORSE_MAP: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
    '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
};

const REVERSE_MORSE: Record<string, string> = Object.entries(MORSE_MAP).reduce(
    (acc, [char, morse]) => ({ ...acc, [morse]: char }), {}
);

export function MorseCode() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isToMorse, setIsToMorse] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [wpm, setWpm] = useState(20);
    const [frequency, setFrequency] = useState(600);
    const [currentHighlightIndex, setCurrentHighlightIndex] = useState<number>(-1);

    const audioContextRef = useRef<AudioContext | null>(null);
    const isPlayingRef = useRef(false);

    const convert = (text: string, toMorse: boolean) => {
        if (toMorse) {
            // Split by words first to respect word boundaries
            // Normalize spaces to single space then split
            return text.trim().toUpperCase().split(/\s+/).map(word => {
                return word.split('').map(char => MORSE_MAP[char] || '').join(' ');
            }).join(' / ');
        } else {
            return text.trim().split(' / ').map(word => {
                return word.split(' ').map(token => REVERSE_MORSE[token] || '').join('');
            }).join(' ');
        }
    };

    useEffect(() => {
        const result = convert(input, isToMorse);
        setOutput(result);
    }, [input, isToMorse]);

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const stopMorse = () => {
        isPlayingRef.current = false;
        setIsPlaying(false);
        setCurrentHighlightIndex(-1);
        if (audioContextRef.current) {
            audioContextRef.current.close().then(() => {
                audioContextRef.current = null;
            });
        }
    };

    const playMorse = async () => {
        if (isPlaying || !output) return;

        setIsPlaying(true);
        isPlayingRef.current = true;
        setCurrentHighlightIndex(-1);

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioContextRef.current!;
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        // Standard timing: dot = 1.2 / wpm
        const dotDuration = 1.2 / wpm;

        const playTone = (duration: number) => {
            return new Promise<void>(resolve => {
                if (!isPlayingRef.current) {
                    resolve();
                    return;
                }
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.value = frequency;

                osc.connect(gain);
                gain.connect(ctx.destination);

                // Attack and release for smoother sound
                const now = ctx.currentTime;
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
                gain.gain.setValueAtTime(0.1, now + duration - 0.01);
                gain.gain.linearRampToValueAtTime(0, now + duration);

                osc.start(now);
                osc.stop(now + duration);

                setTimeout(resolve, duration * 1000);
            });
        };

        const sleep = (duration: number) => new Promise<void>(resolve => {
            if (!isPlayingRef.current) return resolve();
            setTimeout(resolve, duration * 1000);
        });

        // Parse the output string to play
        // Current implementation is simplified. For highlighting, we need to map audio processing to characters.
        // We will iterate through the 'words' and 'chars' structure implicitly by parsing the output string.

        const tokens = output.split(' ');

        let charIndex = 0;
        for (let i = 0; i < tokens.length; i++) {
            if (!isPlayingRef.current) break;

            const token = tokens[i];

            // Highlight current token range in the raw output string
            // We need to calculate where this token starts in the full string
            // This is a bit tricky with recreating the mapping, so we'll approximate 
            // by just tracking our progress through logical tokens.
            // A better way for highlighting would be to reconstruct the string or index mapping.
            // For now, let's just highlight the token being played if we can match it.

            // Simple visual sync: set loop index
            setCurrentHighlightIndex(i);

            if (token === '/') {
                // Word gap (7 dots), but we already waited 3 dots after last character.
                // Standard: Word gap = 7 dots. Letter gap = 3 dots.
                // Our structure: char <space> char <space> / <space> char
                // The space after a char is a letter gap (3 dots).
                // The / represents the word gap.
                await sleep(dotDuration * 4); // +3 from previous letter gap = 7 total
            } else {
                for (const char of token) {
                    if (!isPlayingRef.current) break;

                    if (char === '.') {
                        await playTone(dotDuration);
                        await sleep(dotDuration); // intra-char gap (1 dot)
                    } else if (char === '-') {
                        await playTone(dotDuration * 3);
                        await sleep(dotDuration); // intra-char gap (1 dot)
                    }
                }

                // Inter-character gap aka letter gap (3 dots)
                // We already waited 1 dot after the last symbol. So we need 2 more?
                // Standard: 
                // symbol + gap(1) + symbol + gap(1) ... symbol + letter_gap(3)
                // We did symbol + gap(1). So we need 2 more dots silence.
                await sleep(dotDuration * 2);
            }
        }

        setIsPlaying(false);
        isPlayingRef.current = false;
        setCurrentHighlightIndex(-1);
        stopMorse(); // Cleanup context
    };

    // Helper to render output with highlighting
    const renderOutput = () => {
        if (!output) return <span className="text-slate-400 opacity-40 italic">Result will appear here...</span>;

        const tokens = output.split(' ');
        return tokens.map((token, idx) => (
            <span
                key={idx}
                className={`inline-block transition-colors duration-200 ${idx === currentHighlightIndex ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 rounded px-1 -mx-1' : ''}`}
            >
                {token}{idx < tokens.length - 1 ? ' ' : ''}
            </span>
        ));
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Main Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Mode Switcher */}
                <div className="flex bg-slate-50 dark:bg-slate-950 p-1 border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => { setIsToMorse(true); setInput(''); setOutput(''); }}
                        className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-2xl flex items-center justify-center gap-2 ${isToMorse ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-400 opacity-60'}`}
                    >
                        <Type className="w-4 h-4" /> Text To Morse
                    </button>
                    <button
                        onClick={() => { setIsToMorse(false); setInput(''); setOutput(''); }}
                        className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-2xl flex items-center justify-center gap-2 ${!isToMorse ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-400 opacity-60'}`}
                    >
                        <Volume2 className="w-4 h-4" /> Morse To Text
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    {/* Input Area */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 block ml-4">
                            Input {isToMorse ? 'Text' : 'Morse (use . and -)'}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isToMorse ? "Type your message here..." : "... --- ..."}
                            className="w-full h-40 bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-6 text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all text-xl font-mono leading-relaxed resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                            spellCheck={false}
                        />
                    </div>

                    {/* Converter Arrow */}
                    <div className="flex justify-center -my-2 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border-4 border-white dark:border-slate-900 transition-transform hover:rotate-180 duration-500">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Output Area */}
                    <div className="space-y-4 relative">
                        <div className="flex items-center justify-between ml-4 mr-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                Output {isToMorse ? 'Morse Code' : 'Decoded Text'}
                            </label>
                            {isToMorse && (
                                <div className="flex items-center gap-4">
                                    {/* Audio Controls (Mini) */}
                                    {isPlaying && (
                                        <div className="flex items-center gap-2 animate-pulse">
                                            <Activity className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[10px] font-mono text-emerald-500">PLAYING</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="relative group">
                            <div className="w-full min-h-[160px] bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-6 text-emerald-700 dark:text-emerald-400 text-xl font-mono leading-relaxed break-all transition-colors">
                                {renderOutput()}
                            </div>

                            <div className="absolute top-4 right-4 flex gap-2">
                                {isToMorse && (
                                    <button
                                        onClick={isPlaying ? stopMorse : playMorse}
                                        className={`p-3 rounded-2xl shadow-lg border transition-all active:scale-95 ${isPlaying ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-emerald-500 hover:scale-110'}`}
                                        title={isPlaying ? "Stop Audio" : "Play Morse Audio"}
                                    >
                                        {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                                    </button>
                                )}
                                <button
                                    onClick={handleCopy}
                                    className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-800 text-emerald-500 hover:scale-110 transition-all active:scale-95"
                                    title="Copy to Clipboard"
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Settings Panel (Only show in Text to Morse mode) */}
                    {isToMorse && (
                        <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/50">
                            <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                                <Settings2 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Audio Settings</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Speed (WPM)</label>
                                        <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{wpm}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="50"
                                        value={wpm}
                                        onChange={(e) => setWpm(Number(e.target.value))}
                                        className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                        <span>Slow</span>
                                        <span>Fast</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Frequency (Hz)</label>
                                        <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{frequency}Hz</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="400"
                                        max="1000"
                                        step="50"
                                        value={frequency}
                                        onChange={(e) => setFrequency(Number(e.target.value))}
                                        className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                        <span>Low</span>
                                        <span>High</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Features Footer */}
                <div className="bg-slate-50 dark:bg-slate-950 p-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(16,185,129,0.6)]`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">Real-time</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">Pro Audio</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
