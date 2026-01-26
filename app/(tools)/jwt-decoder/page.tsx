import { JwtDecoder } from '@/components/tools/developer/JwtDecoder';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'JWT Decoder | Debug JSON Web Tokens Online',
    description: 'Decode and inspect JSON Web Tokens (JWT) instantly. View header, payload, and signature claims. Secure client-side decoding, no server uploads.',
    keywords: ['jwt decoder', 'jwt debugger', 'decode jwt online', 'json web token', 'jwt viewer'],
    alternates: {
        canonical: '/jwt-decoder',
    },
};

export default function JwtDecoderPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="JWT Decoder"
                    description="Inspect and debug JSON Web Tokens instantly."
                />

                <JwtDecoder />
            </div>

            <ToolContent slug="jwt-decoder" />
        </div>
    );
}
