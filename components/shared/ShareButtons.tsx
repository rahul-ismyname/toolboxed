"use client";

import React, { useEffect, useState } from 'react';
import { Twitter, Linkedin, Facebook, Mail, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonsProps {
    title: string;
    description: string;
    url?: string;
}

export function ShareButtons({ title, description, url }: ShareButtonsProps) {
    const [currentUrl, setCurrentUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(url || window.location.href);
        }
    }, [url]);

    if (!currentUrl) return null;

    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const openPopup = (url: string) => {
        window.open(url, 'share-dialog', 'width=600,height=400');
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Share this tool</h3>
            <div className="flex flex-wrap justify-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
                    onClick={() => openPopup(shareLinks.twitter)}
                    title="Share on Twitter"
                >
                    <Twitter className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
                    onClick={() => openPopup(shareLinks.linkedin)}
                    title="Share on LinkedIn"
                >
                    <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
                    onClick={() => openPopup(shareLinks.facebook)}
                    title="Share on Facebook"
                >
                    <Facebook className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-colors dark:hover:bg-slate-200 dark:hover:text-slate-900"
                    onClick={() => window.location.href = shareLinks.email}
                    title="Share via Email"
                >
                    <Mail className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className={copied ? "bg-emerald-50 text-emerald-600 border-emerald-200" : ""}
                    onClick={handleCopy}
                    title="Copy Link"
                >
                    {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    );
}
