export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} Toolboxed Inc. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm text-slate-500">
                    <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
}
