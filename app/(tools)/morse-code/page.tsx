import { MorseCode } from '@/components/tools/utility/MorseCode';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Morse Code Converter | Audio Support & Real-time Translation',
    description: 'Convert text to Morse code and Morse to text instantly. Features real-time audio playback, copy functionality, and international standard support.',
    keywords: ['morse code converter', 'text to morse', 'morse audio player', 'international morse code', 'decoder'],
    alternates: {
        canonical: '/morse-code',
    },
};

export default function MorseCodePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Morse Code Converter"
                    description="Translate text to dots and dashes with audio."
                />

                <MorseCode />
            </div>

            <ToolContent slug="morse-code" />
        </div>
    );
}
