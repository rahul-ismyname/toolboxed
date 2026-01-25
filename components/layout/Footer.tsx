export function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-12 mt-auto transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    © {new Date().getFullYear()} Toolboxed Inc. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
                    <a href="/privacy-policy-gen" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-not-allowed" title="Coming Soon">Terms of Service</a>
                    <a href="mailto:contact@toolboxed.online" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
}
