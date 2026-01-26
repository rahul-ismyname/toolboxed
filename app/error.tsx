'use client';

import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service if needed
        console.error(error);
    }, [error]);

    return (
        <>
            <Navbar />
            <main className="min-h-[70vh] flex items-center justify-center px-4 bg-white dark:bg-slate-950">
                <div className="max-w-xl w-full text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 mb-8 shadow-sm">
                        <AlertTriangle className="w-10 h-10 text-amber-500" />
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                        Something went wrong
                    </h1>

                    <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                        We encountered an unexpected error while preparing this tool.
                        Don't worry, your data is likely still safe in your browser.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => reset()}
                            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Try Again
                        </button>

                        <Link
                            href="/"
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Back to Safety
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
