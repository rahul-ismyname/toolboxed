import { Suspense } from 'react';
import { QrCodeGenerator } from '@/components/tools/utility/QrCodeGenerator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
    const slug = 'qr-generator';
    const combinedTitle = getCombinedTitle(slug);

    return {
        title: combinedTitle,
        description: 'Generate fully customizable QR codes for URLs, text, Wi-Fi, and more. Download high-quality PNGs instantly. No signup required.',
        keywords: ['qr code generator', 'generador de códigos qr', 'क्यूआर कोड जेनरेटर', 'create qr code', 'free qr code', 'qr code maker', 'online qr code'],
        alternates: {
            canonical: '/qr-generator',
        },
    };
}

export default function QrGeneratorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="QR Code Generator"
                    description="Create permanent, high-quality QR codes instantly."
                />

                <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
                    <QrCodeGenerator />
                </Suspense>
            </div>

            <ToolContent slug="qr-generator" />
        </div>
    );
}
