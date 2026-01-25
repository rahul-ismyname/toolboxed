import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Toolboxed',
    description: 'Terms and conditions for using Toolboxed utilities.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 py-12 md:py-24 transition-colors">
            <BackButton />
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Last Updated: January 25, 2026
                    </p>
                </header>

                <div className="prose dark:prose-invert prose-slate max-w-none space-y-8 text-slate-600 dark:text-slate-300">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Terms</h2>
                        <p>
                            By accessing Toolboxed, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Use License</h2>
                        <p>
                            Permission is granted to use the tools and utilities on Toolboxed for personal or commercial use. This is the grant of a license, not a transfer of title, and under this license, you may not:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
                            <li>Use the tools for any illegal purpose or to process sensitive data you do not have rights to;</li>
                            <li>Attempt to disrupt the service through automated means or high-frequency requests.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Disclaimer</h2>
                        <p>
                            The materials on Toolboxed are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Limitations</h2>
                        <p>
                            In no event shall Toolboxed or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools on this website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Accuracy of Materials</h2>
                        <p>
                            The materials appearing on Toolboxed could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete or current.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
