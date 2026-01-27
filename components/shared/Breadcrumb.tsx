import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
    category?: string;
    name: string;
}

export function Breadcrumb({ category, name }: BreadcrumbProps) {
    const appUrl = 'https://www.toolboxed.online';
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': appUrl
            },
            ...(category ? [{
                '@type': 'ListItem',
                'position': 2,
                'name': category,
                'item': `${appUrl}/category/${category.toLowerCase()}`
            }] : []),
            {
                '@type': 'ListItem',
                'position': category ? 3 : 2,
                'name': name,
            }
        ]
    };

    return (
        <nav className="flex mb-6" aria-label="Breadcrumb navigation">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                    <Link
                        href="/"
                        aria-label="Go to Homepage"
                        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        <Home className="w-3.5 h-3.5 mr-1.5" />
                        Home
                    </Link>
                </li>
                {category && (
                    <li>
                        <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-0.5" />
                            <Link
                                href={`/category/${category.toLowerCase()}`}
                                className="text-xs font-semibold text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors"
                            >
                                {category}
                            </Link>
                        </div>
                    </li>
                )}
                <li aria-current="page">
                    <div className="flex items-center">
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-0.5" />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px] md:max-w-none">
                            {name}
                        </span>
                    </div>
                </li>
            </ol>
        </nav>
    );
}
