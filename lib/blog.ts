import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
    relatedTool?: string; // Slug of the tool to promote
    content: string;
}

export function getAllPosts(): BlogPost[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Parse metadata section
        const { data, content } = matter(fileContents);

        return {
            slug,
            content,
            ...(data as { title: string; date: string; description: string; relatedTool?: string }),
        };
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getPostBySlug(slug: string): BlogPost | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            content,
            ...(data as { title: string; date: string; description: string; relatedTool?: string }),
        };
    } catch (err) {
        return null;
    }
}
