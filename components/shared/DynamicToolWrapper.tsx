'use client';

import dynamic from 'next/dynamic';

interface Props {
    loader: () => Promise<any>;
    name: string;
    color?: string;
    className?: string;
}

export function DynamicToolWrapper({ loader, name, color = 'blue', className = "min-h-[500px]" }: Props) {
    const DynamicComponent = dynamic(loader, {
        ssr: false,
        loading: () => (
            <div className={`flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 ${className}`}>
                <div className="text-center">
                    <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4`} style={{ borderColor: color }}></div>
                    <p className="text-slate-500 font-bold animate-pulse">Initializing {name}...</p>
                </div>
            </div>
        ),
    });

    return <DynamicComponent />;
}
