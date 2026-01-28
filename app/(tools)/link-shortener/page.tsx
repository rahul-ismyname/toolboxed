import { Metadata } from 'next';
import LinkShortener from '@/components/tools/utility/LinkShortener';
import { ToolContent } from '@/components/tools/ToolContent';

export const metadata: Metadata = {
    title: 'Free Link Shortener | Toolboxed',
    description: 'Shorten long URLs into clean, shareable links. Track clicks and manage your links for free.',
};

export default function LinkShortenerPage() {
    return (
        <>
            <LinkShortener />
            <ToolContent slug="link-shortener" />
        </>
    );
}
