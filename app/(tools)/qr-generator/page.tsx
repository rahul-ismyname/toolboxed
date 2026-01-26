import { QrCodeGenerator } from '@/components/tools/utility/QrCodeGenerator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free QR Code Generator | Create QR Codes Online',
    description: 'Generate fully customizable QR codes for URLs, text, Wi-Fi, and more. Download high-quality PNGs instantly. No signup required.',
    keywords: ['qr code generator', 'create qr code', 'free qr code', 'qr code maker', 'online qr code'],
    alternates: {
        canonical: '/qr-generator',
    },
};

export default function QrGeneratorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="QR Code Generator"
                    description="Create permanent, high-quality QR codes instantly."
                />

                <QrCodeGenerator />
            </div>

            <ToolContent slug="qr-generator" />
        </div>
    );
}
