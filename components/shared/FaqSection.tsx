'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
    question: string;
    answer: string;
}

export function FaqSection({ items }: { items: FaqItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-16 bg-white border-t border-slate-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-300"
                        >
                            <button
                                onClick={() => setOpenIndex(prev => prev === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
                            >
                                {item.question}
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="p-5 bg-slate-50 text-slate-600 leading-relaxed border-t border-slate-100">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
