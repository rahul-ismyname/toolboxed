import { RegexTester } from '@/components/tools/developer/RegexTester';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'RegEx Tester & Debugger | Live Regular Expression Editor',
    description: 'Test and debug JavaScript regular expressions online with real-time highlighting and cheat sheet. Supports global, case-insensitive, and multiline flags.',
    keywords: ['regex tester', 'regex debugger', 'regular expression tester online', 'javascript regex editor', 'regex cheat sheet'],
};

export default function RegexTesterPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                    RegEx Tester
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Visual debugger for Regular Expressions. Test patterns against text with real-time highlighting and invalid regex detection.
                </p>
            </div>

            <RegexTester />
            <ToolContent slug="regex-tester" />
        </div>
    );
}
