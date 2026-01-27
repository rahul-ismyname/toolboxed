import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { RelatedTool } from '@/components/blog/RelatedTool';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Calendar } from 'lucide-react';
import { Metadata } from 'next';

interface Props {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = getPostBySlug(params.slug);
    if (!post) return { title: 'Post Not Found' };
    return {
        title: `${post.title} | Toolboxed Blog`,
        description: post.description,
    };
}

const components = {
    RelatedTool: RelatedTool,
};

export default function BlogPost({ params }: Props) {
    const post = getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <article className="max-w-3xl mx-auto px-4 sm:px-6">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Blog
                </Link>

                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </time>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        {post.description}
                    </p>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-2xl">
                    <MDXRemote source={post.content} components={components} />
                </div>
            </article>
        </div>
    );
}
