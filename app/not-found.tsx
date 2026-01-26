import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main className="min-h-[70vh] flex items-center justify-center px-4 bg-white dark:bg-slate-950">
                <div className="max-w-xl w-full text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mb-8 shadow-sm">
                        <Search className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                        Tool Not Found
                    </h1>

                    <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                        We couldn't find the utility you're looking for. It might have been moved,
                        renamed, or maybe it's still being built in our workshop.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
                        >
                            <Home className="w-4 h-4" />
                            Return Home
                        </Link>

                        <Link
                            href="/"
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </Link>
                    </div>

                    <div className="mt-16 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 mb-6">
                            💡 Hint: Try searching for the tool name on our home page!
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Developer', 'Design', 'Business', 'Utility'].map((cat) => (
                                <Link
                                    key={cat}
                                    href={`/category/${cat.toLowerCase()}`}
                                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
                                >
                                    {cat} Tools
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
