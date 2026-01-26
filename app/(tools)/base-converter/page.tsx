import { BaseConverter } from '@/components/tools/developer/BaseConverter';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Base Converter | Binary, Hex, Decimal & Octal',
    description: 'Instant number base conversion tool for developers. Convert between Binary, Hexadecimal, Decimal, and Octal with support for large numbers.',
    keywords: ['base converter', 'binary to hex', 'decimal to binary', 'hex converter', 'programmer calculator', 'number bases'],
    alternates: {
        canonical: '/base-converter',
    },
};

export default function BaseConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Base Converter"
                    description="Seamlessly convert between Decimal, Hex, Binary, and Octal."
                />

                <BaseConverter />
            </div>

            <ToolContent slug="base-converter" />
        </div>
    );
}
