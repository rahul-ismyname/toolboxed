import { LoremIpsumGenerator } from '@/components/tools/utility/LoremIpsumGenerator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lorem Ipsum Generator | Free Online Placeholder Text Tool',
    description: 'Generate custom Lorem Ipsum text for your web designs or print projects. Choose between paragraphs, sentences, or words and copy the result instantly.',
    keywords: ['lorem ipsum generator', 'placeholder text tool', 'dummy text online', 'filler text generator', 'web design placeholder', 'lorem ipsum paragraphs'],
    alternates: {
        canonical: '/lorem-ipsum',
    },
};

export default function LoremPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Lorem Ipsum Generator"
                    description="The designer's standard for placeholder content."
                />

                <LoremIpsumGenerator />
            </div>

            <ToolContent slug="lorem-ipsum" />
        </div>
    );
}
