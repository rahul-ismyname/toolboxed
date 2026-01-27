import { getOriginalUrl } from '@/lib/actions';
import { redirect, notFound } from 'next/navigation';

// Update Props to reflect that params is a Promise
interface Props {
    params: Promise<{
        code: string;
    }>;
}

export default async function ShortLinkRedirect({ params }: Props) {
    const { code } = await params;

    // Now pass the resolved code
    const originalUrl = await getOriginalUrl(code);

    if (originalUrl) {
        redirect(originalUrl);
    } else {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Link Not Found</h1>
                <p className="text-slate-500 mb-8">This short link does not exist or has been removed.</p>
                <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                    Go Home
                </a>
            </div>
        );
    }
}
