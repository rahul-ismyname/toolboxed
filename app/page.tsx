import { ToolExplorer } from '@/components/registry/ToolExplorer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, Shield } from 'lucide-react';
import Link from 'next/link';
import { FeaturedTools } from '@/components/registry/FeaturedTools';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toolboxed | All-in-One Professional Online Utility Tools',
  description: 'Fast, secure, and free online tools for developers, creators, and professionals. From calculators to converters, all in one place. 100% private.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        {/* Hero Section - Professional & Minimal */}
        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                v1.0 Available
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                Essential utilities for <br />
                <span className="text-slate-400 dark:text-slate-500">modern professionals.</span>
              </h1>

              <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed">
                A curated suite of high-performance tools designed to simplify your daily workflow.
                No ads, no tracking, just utility.
              </p>

              <div className="flex flex-wrap gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Client-side Privacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Instant Execution</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Open Source</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Tools Section */}
        <FeaturedTools />

        {/* Tool Explorer Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <ToolExplorer />
        </div>

        {/* About / SEO Section */}
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Professional Utility Tools for the Modern Web
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Toolboxed.online is a free, open-source platform providing high-performance, developer-centric utility tools.
                  Our mission is to offer a clean, secure, and fast alternative to ad-heavy tool websites.
                </p>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Design', href: '/category/design' },
                    { name: 'Developer', href: '/category/developer' },
                    { name: 'Business', href: '/category/business' },
                    { name: 'Utility', href: '/category/utility' },
                    { name: 'Health', href: '/category/health' }
                  ].map((cat, i) => (
                    <li key={i}>
                      <Link
                        href={cat.href}
                        className="group flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition-all"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">
                          {cat.name} Tools
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Privacy First</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  All processing happens <strong>locally in your browser</strong>.
                  We never upload your files or sensitive data to our servers.
                  Security isn&apos;t just a feature; it&apos;s our foundation.
                </p>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Secure & Private</p>
                    <p className="text-xs text-slate-500">No server-side storage used.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Missing a tool?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              We are constantly adding new utilities. Submit a request or contribute on GitHub.
            </p>
            <a href="mailto:r43381812@gmail.com?subject=New Tool Request" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg shadow-slate-200/50 dark:shadow-none">
              Request a Tool
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
