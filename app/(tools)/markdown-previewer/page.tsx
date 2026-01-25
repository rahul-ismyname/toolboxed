import { MarkdownPreviewer } from '@/components/tools/developer/MarkdownPreviewer';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Markdown Previewer | Live Online Markdown Editor',
    description: 'Write and preview Markdown in real-time. Use our side-by-side editor to format your README files, documentation, and blog posts with ease.',
    keywords: ['markdown previewer', 'markdown editor', 'online markdown viewer', 'live markdown preview', 'format readme online'],
    alternates: {
        canonical: '/markdown-previewer',
    },
};

const faqItems = [
    {
        question: "What is Markdown?",
        answer: "Markdown is a lightweight markup language with plain-text-formatting syntax. It is designed so that it can be converted to HTML and many other formats using a tool which is also called 'markdown'."
    },
    {
        question: "Why use a live previewer?",
        answer: "A live previewer allows you to see exactly how your formatted text will look in its final rendered state, saving you time and preventing syntax errors before you commit your code."
    },
    {
        question: "Is my documentation private?",
        answer: "Yes. All processing happens locally in your browser. We do not store or transmit your markdown content to any server."
    }
];

const howToSteps: Step[] = [
    {
        title: "Write Markdown",
        description: "Start typing in the editor on the left using standard markdown syntax like '#' for headers and '-' for lists."
    },
    {
        title: "Choose View",
        description: "Switch between 'Edit', 'Split', and 'Preview' modes to focus on what matters most to your current task."
    },
    {
        title: "Export Result",
        description: "Once finished, use the copy button to grab your raw markdown or simply copy the rendered preview for use in other apps."
    }
];

export default function MarkdownPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Markdown Previewer
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        The simple way to write and format documentation.
                    </p>
                </div>

                <MarkdownPreviewer />
            </div>

            <HowToSection title="Documentation Made Easy" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
