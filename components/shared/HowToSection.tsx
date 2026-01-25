export interface Step {
    title: string;
    description: string;
}

export function HowToSection({ title, steps }: { title: string, steps: Step[] }) {
    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-12 text-center">
                    {title}
                </h2>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[28px] left-0 w-full h-px bg-slate-200 dark:bg-slate-800 -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {steps.map((step, index) => (
                            <div key={index} className="relative flex flex-col items-center text-center group">
                                <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center font-bold text-xl mb-6 shadow-sm group-hover:scale-110 group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-all z-10">
                                    {index + 1}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
