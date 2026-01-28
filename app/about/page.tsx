import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Zap, Globe, Github, Heart, MessageSquare, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'About Toolboxed - Privacy-First Professional Utility Tools',
    description: 'Learn about our mission to provide high-performance, secure, and ad-free utility tools for the modern web.',
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-24 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-pretty">
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
                            Our Mission
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                            Clean utility for the <br /><span className="text-emerald-500">privacy-conscious.</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                            Toolboxed was born out of a simple frustration: most utility tool sites are cluttered with ads,
                            tracking scripts, and poor UX. We're building a faster, safer, and more beautiful alternative.
                        </p>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacy-First</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
                                Your data never leaves your browser. All tool processing happens client-side,
                                ensuring your files and information remain completely private.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">High Performance</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
                                Built with Next.js and optimized for speed. Our tools load instantly and execute
                                operations in milliseconds without unnecessary server roundtrips.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Open & Transparent</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-pretty">
                                Toolboxed is open-source. Anyone can inspect how our tools work or contribute
                                improvements to the platform on GitHub.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Technology Stack */}
                <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Built with Modern Tech</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { name: 'Next.js', desc: 'Framework' },
                                { name: 'Tailwind CSS', desc: 'Styling' },
                                { name: 'TypeScript', desc: 'Type Safety' },
                                { name: 'Framer Motion', desc: 'Animations' }
                            ].map((tech) => (
                                <div key={tech.name} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                                    <div className="font-bold text-slate-900 dark:text-white mb-1">{tech.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{tech.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Growth & Feedback */}
                <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Join the Community</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                        We are constantly adding new tools and features based on user feedback.
                        Have an idea or found a bug? We'd love to hear from you.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <Link
                            href="mailto:r43381812@gmail.com"
                            className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <Mail className="w-5 h-5" />
                            Request a Tool
                        </Link>
                        <a
                            href="https://github.com/rahul-ismyname/toolboxed"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
                        >
                            <Github className="w-5 h-5" />
                            View on GitHub
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
