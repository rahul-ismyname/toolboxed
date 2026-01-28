import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-16 mt-auto transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-white mb-4">
                            <div className="relative w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                <img
                                    src="/logo.svg"
                                    alt="Toolboxed Logo"
                                    className="w-7 h-7"
                                />
                            </div>
                            <span>Toolboxed</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                            High-performance, secure, and free online utility tools. Built for modern professionals and developers.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Popular Tools</h3>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link href="/bmi-calculator" className="hover:text-emerald-500 transition-colors">BMI Calculator</Link></li>
                            <li><Link href="/json-formatter" className="hover:text-emerald-500 transition-colors">JSON Formatter</Link></li>
                            <li><Link href="/password-generator" className="hover:text-emerald-500 transition-colors">Password Generator</Link></li>
                            <li><Link href="/pdf-master" className="hover:text-emerald-500 transition-colors">PDF Master</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Categories</h3>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link href="/category/developer" className="hover:text-emerald-500 transition-colors">Developer Tools</Link></li>
                            <li><Link href="/category/design" className="hover:text-emerald-500 transition-colors">Design Tools</Link></li>
                            <li><Link href="/category/business" className="hover:text-emerald-500 transition-colors">Business Suite</Link></li>
                            <li><Link href="/category/utility" className="hover:text-emerald-500 transition-colors">Utility Hub</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link href="/about" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
                            <li><a href="mailto:r43381812@gmail.com" className="hover:text-emerald-500 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Newsletter</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                            Get notified when we release new tools.
                        </p>
                        <form className="space-y-2">
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                            />
                            <button className="w-full px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        © {new Date().getFullYear()} Toolboxed Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
