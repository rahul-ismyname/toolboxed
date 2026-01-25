import { MetaTagGenerator } from '@/components/tools/developer/MetaTagGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Meta Tag Generator | SEO & Social Media Preview Tool',
    description: 'Create optimized meta tags for SEO, Open Graph (Facebook), and Twitter Cards. Preview exactly how your website will look in search results and social shares.',
    keywords: ['meta tag generator', 'seo tool', 'open graph generator', 'twitter card generator', 'social media preview', 'website previewer'],
    alternates: {
        canonical: '/meta-tag-generator',
    },
};

const faqItems = [
    {
        question: "Why are meta tags important?",
        answer: "Meta tags provide search engines and social platforms with key information about your page (title, description, image). They directly improve your click-through rate from Google and social media."
    },
    {
        question: "What is Open Graph?",
        answer: "Open Graph (og:tags) is a protocol used by Facebook, LinkedIn, Discord, and others to display rich previews (cards with images) when your link is shared."
    },
    {
        question: "How do I use these tags?",
        answer: "Copy the generated HTML code and paste it into the `<head>` section of your website's HTML source code."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter Details",
        description: "Fill in your page title, description, and website URL. Add an image URL for social previews."
    },
    {
        title: "Preview",
        description: "Check the live previews on the right to see how your link will appear on Google and Facebook."
    },
    {
        title: "Copy & Paste",
        description: "Click the copy button to get the perfectly formatted meta tag code for your website."
    }
];

export default function MetaTagPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Meta Tag Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Boost your SEO and social clicks with perfect tags.
                    </p>
                </div>

                <MetaTagGenerator />
            </div>

            <HowToSection title="Using the Generator" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
