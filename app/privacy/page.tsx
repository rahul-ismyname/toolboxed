import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Toolboxed',
    description: 'Our commitment to your privacy. Toolboxed is built on 100% client-side execution, meaning your data never leaves your device.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 py-12 md:py-24 transition-colors">
            <BackButton />
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Last Updated: January 25, 2026
                    </p>
                </header>

                <div className="prose dark:prose-invert prose-slate max-w-none space-y-8 text-slate-600 dark:text-slate-300">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Privacy by Design</h2>
                        <p>
                            At Toolboxed, your privacy is our core priority. Our platform is designed as a suite of client-side utilities.
                            This means that <strong>all calculations, conversions, and data processing happen entirely within your web browser</strong>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Data Collection</h2>
                        <p>
                            We do not collect, store, or transmit any of the data you input into our tools.
                            Whether you are generating a password, calculating your BMI, or formatting JSON, that data is processed locally and never sent to our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Cookies & Analytics</h2>
                        <p>
                            We use minimal cookies for essential site functionality and basic, privacy-friendly analytics to understand site traffic.
                            We do not use tracking cookies for advertising or profiling.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Third-party Links</h2>
                        <p>
                            Our site may contain links to other websites (such as GitHub). We are not responsible for the privacy practices or content of these external sites.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@toolboxed.online" className="text-emerald-500 hover:underline">privacy@toolboxed.online</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
