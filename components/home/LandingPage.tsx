'use client';

import { motion } from 'framer-motion';
import { HiveGrid } from '@/components/registry/HiveGrid';
import { FeaturedTools } from '@/components/registry/FeaturedTools';
import { Shield, ArrowRight, Zap, Database, Globe } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PhysicsBox } from '@/components/home/PhysicsBox';

export function LandingPage() {
    return (
        <div className="bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 overflow-x-hidden min-h-screen flex flex-col font-sans">
            <Navbar />

            {/* HERO SECTION - PHYSICS PLAYGROUND */}
            <PhysicsBox />

            {/* FEATURED */}
            <section className="py-24 bg-white dark:bg-slate-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="w-12 h-1 bg-emerald-500" />
                        <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Deployed Modules</h2>
                    </div>
                    <FeaturedTools />
                </div>
            </section>

            {/* EXPLORER */}
            <section className="py-24 bg-slate-50 dark:bg-[#0B0F1A] border-t border-slate-200 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Command Center</h2>
                        <p className="text-slate-500">Access full utility database.</p>
                    </div>
                    <HiveGrid />
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="py-24 relative overflow-hidden bg-white dark:bg-[#020617]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-8">
                                Architecture <br />
                                <span className="text-slate-400">Overview</span>
                            </h2>

                            <div className="grid sm:grid-cols-1 gap-4">
                                {[
                                    { name: 'Design Components', href: '/category/design', color: 'border-pink-500' },
                                    { name: 'Dev Environment', href: '/category/developer', color: 'border-blue-500' },
                                    { name: 'Business Logic', href: '/category/business', color: 'border-purple-500' },
                                    { name: 'Core Utilities', href: '/category/utility', color: 'border-orange-500' },
                                ].map((cat, i) => (
                                    <Link key={i} href={cat.href}>
                                        <div className="group flex items-center gap-6 p-6 rounded-none border-l-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-transparent transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
                                            <span className="font-mono text-xs text-slate-400">0{i + 1}</span>
                                            <span className="font-bold text-xl text-slate-900 dark:text-white group-hover:translate-x-2 transition-transform">{cat.name}</span>
                                            <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 ml-auto transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="relative p-10 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                </div>
                            </div>
                            <div className="font-mono text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-4">
                                <div className="flex justify-between"><span className="text-emerald-500">status</span> <span>active</span></div>
                                <div className="flex justify-between"><span className="text-blue-500">encryption</span> <span>local_only</span></div>
                                <div className="flex justify-between"><span className="text-purple-500">latency</span> <span>0ms</span></div>
                                <div className="h-px bg-slate-300 dark:bg-slate-700 my-4" />
                                <p>
                                    Initializing secure environment... <br />
                                    Loaded 35 modules... <br />
                                    Ready for user input.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
