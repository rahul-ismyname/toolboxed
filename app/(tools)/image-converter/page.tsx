import { DynamicImageConverter } from '@/components/tools/DynamicTools';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image Converter & Compressor | Compress PNG, JPG, WebP Online',
    description: 'Free online image compressor and converter. Reduce file size of PNG and JPG images by up to 80% without quality loss. 100% private & browser-based.',
    keywords: ['compress image', 'reduce image size', 'image converter', 'webp converter', 'png to jpg', 'jpg to webp'],
    alternates: {
        canonical: '/image-converter',
    },
};

const faqItems = [
    {
        question: "Is my image uploaded?",
        answer: "No. All compression and conversion happens locally in your browser using the HTML5 Canvas API. Your photos never leave your device."
    },
    {
        question: "How does compression work?",
        answer: "We use smart lossy compression algorithms (like WebP) to reduce file size significantly while maintaining visible quality."
    },
    {
        question: "Why convert to WebP?",
        answer: "WebP images are typically 25-30% smaller than comparable PNGs or JPEGs, making your website load faster."
    }
];

const howToSteps: Step[] = [
    {
        title: "Select Image",
        description: "Drag and drop your image file into the upload box."
    },
    {
        title: "Adjust Compression",
        description: "Choose your format (WebP is best for size) and use the Quality slider to reduce file size."
    },
    {
        title: "Download",
        description: "Click 'Download' to save the optimized file instantly."
    }
];

export default function ConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Image Converter & Compressor
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Securely compress and convert images directly in your browser.
                    </p>
                </div>

                <DynamicImageConverter />
            </div>

            <HowToSection title="Using the Converter" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
