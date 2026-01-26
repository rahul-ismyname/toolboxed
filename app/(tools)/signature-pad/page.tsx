import { SignaturePad } from '@/components/tools/utility/SignaturePad';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Digital Signature Pad | Draw & Download Signatures Online',
    description: 'Free online signature maker. Draw your digital signature with your mouse or finger and download it as a transparent PNG image instanty.',
    keywords: ['signature generator', 'digital signature', 'draw signature online', 'signature pad', 'sign pdf online'],
    alternates: {
        canonical: '/signature-pad',
    },
};

export default function SignaturePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Digital Signature Pad"
                    description="Draw and download your signature in seconds."
                />

                <SignaturePad />
            </div>

            <ToolContent slug="signature-pad" />
        </div>
    );
}
