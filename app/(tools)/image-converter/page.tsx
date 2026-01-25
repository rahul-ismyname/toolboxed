import { ImageConverter } from '@/components/tools/media/ImageConverter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image Converter | Convert Images to WebP, PNG, JPG Online',
    description: 'Free online image converter. Convert PNG and JPG files to high-efficiency WebP format directly in your browser without uploading.',
    keywords: ['image converter', 'webp converter', 'png to jpg', 'jpg to webp', 'client side image converter'],
    alternates: {
        canonical: '/image-converter',
    },
};

const faqItems = [
    {
        question: "Is my image uploaded?",
        answer: "No. All conversion happens locally in your browser using the HTML5 Canvas API. Your photos never leave your device."
    },
    {
        question: "Why convert to WebP?",
        answer: "WebP images are typically 25-30% smaller than comparable PNGs or JPEGs, making your website load faster."
    },
    {
        question: "Is quality lost?",
        answer: "You can control the quality setting. Converting to lossless formats like PNG preserves quality, while JPEG and WebP allow you to trade quality for file size."
    }
];

const howToSteps: Step[] = [
    {
        title: "Select Image",
        description: "Drag and drop your image file into the upload box."
    },
    {
        title: "Choose Format",
        description: "Select your desired output format (WebP, JPEG, or PNG) and adjust quality if needed."
    },
    {
        title: "Download",
        description: "Click 'Convert & Download' to save the new file instantly."
    }
];

export default function ConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Image Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Secure, private, client-side format conversion.
                    </p>
                </div>

                <ImageConverter />
            </div>

            <HowToSection title="Using the Converter" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
