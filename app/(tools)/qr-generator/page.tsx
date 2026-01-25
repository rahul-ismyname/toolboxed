import { QrCodeGenerator } from '@/components/tools/utility/QrCodeGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free QR Code Generator | Create QR Codes Online',
    description: 'Generate fully customizable QR codes for URLs, text, Wi-Fi, and more. Download high-quality PNGs instantly. No signup required.',
    keywords: ['qr code generator', 'create qr code', 'free qr code', 'qr code maker', 'online qr code'],
};

const faqItems = [
    {
        question: "Do these QR codes expire?",
        answer: "No, never. The QR codes generated here are static, meaning they encode the data directly. They will work forever as long as the content (like your URL) exists."
    },
    {
        question: "Is there a scan limit?",
        answer: "There are absolutely zero limits on scanning. Since we don't track your data or redirect through our servers, you can scan them as many times as you want."
    },
    {
        question: "Is my data private?",
        answer: "Yes. All generation happens locally in your browser. We never see, store, or track the content of your QR codes."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter Content",
        description: "Type or paste the URL, text, or number you want to encode."
    },
    {
        title: "Preview",
        description: "The QR code updates instantly as you type."
    },
    {
        title: "Download",
        description: "Click the 'Download PNG' button to save the image to your device."
    }
];

export default function QrGeneratorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        QR Code Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Create permanent, high-quality QR codes instantly.
                    </p>
                </div>

                <QrCodeGenerator />
            </div>

            <HowToSection title="How to create a QR Code" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
