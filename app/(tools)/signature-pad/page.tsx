import { SignaturePad } from '@/components/tools/utility/SignaturePad';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Digital Signature Pad | Draw & Download Signatures Online',
    description: 'Free online signature maker. Draw your digital signature with your mouse or finger and download it as a transparent PNG image instanty.',
    keywords: ['signature generator', 'digital signature', 'draw signature online', 'signature pad', 'sign pdf online'],
    alternates: {
        canonical: '/signature-pad',
    },
};

const faqItems = [
    {
        question: "Is this signature legally binding?",
        answer: "In many jurisdictions, e-signatures are legally binding, but we recommend consulting with a legal professional for specific contracts. This tool simply generates an image of your signature."
    },
    {
        question: "What format is the download?",
        answer: "The signature is downloaded as a high-quality PNG image with a transparent background, perfect for adding to documents."
    },
    {
        question: "Does it work on mobile?",
        answer: "Yes! You can sign with your finger or a stylus on any smartphone or tablet."
    }
];

const howToSteps: Step[] = [
    {
        title: "Draw",
        description: "Use your mouse, trackpad, or finger to sign your name in the box."
    },
    {
        title: "Customize",
        description: "Adjust the pen color and thickness to match your preference."
    },
    {
        title: "Download",
        description: "Click the download button to save your transparent signature for use in documents."
    }
];

export default function SignaturePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Digital Signature Pad
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Draw and download your signature in seconds.
                    </p>
                </div>

                <SignaturePad />
            </div>

            <HowToSection title="Using the Signature Pad" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
