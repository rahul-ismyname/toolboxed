import { ToolExplorer } from '@/components/registry/ToolExplorer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2 } from 'lucide-react';

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

        {/* Tool Explorer Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <ToolExplorer />
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
            <a href="mailto:contact@toolboxed.online?subject=New Tool Request" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg shadow-slate-200/50 dark:shadow-none">
              Request a Tool
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
