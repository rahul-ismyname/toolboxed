import { Suspense } from 'react';
import { DynamicInvoiceBuilder } from '@/components/tools/DynamicTools';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Professional Invoice & Proposal Studio | Toolboxed',
    description: 'Create high-fidelity, branded B2B invoices and proposals instantly. Features live tax calculations, multiple premium templates, and secure 100% private PDF export.',
    keywords: ['invoice generator', 'proposal maker', 'free invoice tool', 'b2b invoicing', 'freelance billing software'],
};

export default function InvoicePage() {
    return (
        <>
            <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
                <DynamicInvoiceBuilder />
            </Suspense>
            <ToolContent slug="invoice-builder" />
        </>
    );
}
