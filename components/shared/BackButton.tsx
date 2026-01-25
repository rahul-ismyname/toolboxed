'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
    return (
        <Link
            href="/"
            className="fixed top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all active:scale-95"
            title="Back to Dashboard"
        >
            <ArrowLeft className="w-5 h-5" />
        </Link>
    );
}
