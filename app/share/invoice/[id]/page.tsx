'use client';

import { useEffect, useState } from 'react';
import { getInvoice } from '@/lib/actions';
import { InvoiceBuilder } from '@/components/tools/business/InvoiceBuilder';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function SharedInvoicePage() {
    const params = useParams();
    const id = params?.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInvoice() {
            if (!id) return;
            try {
                const invoice = await getInvoice(id);
                if (invoice) {
                    setData(invoice.data);
                } else {
                    setError('Invoice not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load invoice');
            } finally {
                setLoading(false);
            }
        }
        fetchInvoice();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoice Not Found</h1>
                <p className="text-slate-500">The invoice you are looking for does not exist or has been removed.</p>
                <Link href="/invoice-builder" className="text-blue-600 hover:underline">
                    Create your own invoice
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Viral Growth Banner */}
            <div className="bg-slate-900 text-white py-3 px-4 text-center sticky top-0 z-[100] shadow-xl">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
                    <div className="flex items-center gap-2 text-blue-300 font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>This invoice was created with Toolboxed</span>
                    </div>
                    <Link
                        href="/invoice-builder"
                        className="flex items-center gap-2 bg-white text-slate-900 px-4 py-1.5 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                        Create Your Own Free Invoice
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            <div className="pt-8">
                <InvoiceBuilder initialData={data} readOnly={true} />
            </div>
        </div>
    );
}
