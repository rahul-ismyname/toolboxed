'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { tools } from '@/config/tools';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPersistence } from '@/hooks/use-user-persistence';
import { Star, Clock } from 'lucide-react';

const POPULAR_TOOLS = ['bmi-calculator', 'unit-converter', 'json-formatter', 'password-generator', 'image-pdf-compressor'];

export function InlineSearch() {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { favorites, recentTools } = useUserPersistence();

    // Filter tools
    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
    );

    const favoriteTools = tools.filter(t => favorites.includes(t.slug));
    const recentVisitedTools = tools.filter(t => recentTools.includes(t.slug) && !favorites.includes(t.slug));
    const popularTools = tools.filter(t => POPULAR_TOOLS.includes(t.slug) && !favorites.includes(t.slug) && !recentTools.includes(t.slug));

    // Highlight helper
    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase()
                        ? <span key={i} className="font-bold text-slate-900 dark:text-white underline decoration-emerald-500/30 decoration-2 underline-offset-2">{part}</span>
                        : <span key={i}>{part}</span>
                )}
            </span>
        );
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-sm">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className={`h-4 w-4 transition-colors ${isOpen ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 group-hover:text-slate-500'}`} />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent sm:text-sm transition-all shadow-sm"
                    placeholder="Search tools..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
                    >
                        {query.length > 0 ? (
                            filteredTools.length > 0 ? (
                                <div className="py-2">
                                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        Search results
                                    </div>
                                    {filteredTools.slice(0, 6).map((tool) => (
                                        <SearchItem
                                            key={tool.slug}
                                            tool={tool}
                                            query={query}
                                            onClick={() => {
                                                setIsOpen(false);
                                                setQuery('');
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                    <p className="text-sm">No tools found for "{query}"</p>
                                </div>
                            )
                        ) : (
                            <div className="py-2 max-h-[70vh] overflow-y-auto">
                                {favorites.length > 0 && (
                                    <>
                                        <div className="px-3 py-2 text-xs font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                                            <Star className="w-3 h-3 fill-current" />
                                            Favorites
                                        </div>
                                        {favoriteTools.map((tool) => (
                                            <SearchItem key={tool.slug} tool={tool} onClick={() => { setIsOpen(false); setQuery(''); }} />
                                        ))}
                                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                                    </>
                                )}

                                {recentTools.length > 0 && (
                                    <>
                                        <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            Recently Used
                                        </div>
                                        {recentVisitedTools.map((tool) => (
                                            <SearchItem key={tool.slug} tool={tool} onClick={() => { setIsOpen(false); setQuery(''); }} />
                                        ))}
                                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                                    </>
                                )}

                                <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                    Suggested Tools
                                </div>
                                {popularTools.slice(0, 5).map((tool) => (
                                    <SearchItem key={tool.slug} tool={tool} onClick={() => { setIsOpen(false); setQuery(''); }} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SearchItem({ tool, query, onClick }: { tool: any, query?: string, onClick: () => void }) {
    const highlightMatch = (text: string, query?: string) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase()
                        ? <span key={i} className="font-bold text-slate-900 dark:text-white underline decoration-emerald-500/30 decoration-2 underline-offset-2">{part}</span>
                        : <span key={i}>{part}</span>
                )}
            </span>
        );
    };

    return (
        <Link
            href={tool.path}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
        >
            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                <tool.icon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {highlightMatch(tool.name, query)}
                </p>
                {query && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {tool.category}
                    </p>
                )}
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    );
}
