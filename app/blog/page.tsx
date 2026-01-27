import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Toolboxed Blog - Growth & Productivity Tips',
    description: 'Guides, tutorials, and tips for freelancers, developers, and designers.',
};

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                        Growth & Resources
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Actionable advice to help you work smarter, not harder.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                            <article className="h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all flex flex-col">
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                                        <Calendar className="w-4 h-4" />
                                        <time dateTime={post.date}>
                                            {new Date(post.date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </time>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {post.title}
                                    </h2>

                                    <p className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1">
                                        {post.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-3 transition-all">
                                        Read Article <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
