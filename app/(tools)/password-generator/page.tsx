import { PasswordGenerator } from '@/components/tools/security/PasswordGenerator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Strong Password Generator | Secure & Random',
    description: 'Create secure, random passwords instantly. Customize length and character types to protect your online accounts.',
    keywords: ['password generator', 'secure password', 'random password', 'security tools', 'password strength'],
    alternates: {
        canonical: '/password-generator',
    },
};

export default function PasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Password Generator"
                    description="Generate unhackable passwords in one click."
                />

                <PasswordGenerator />
            </div>

            <ToolContent slug="password-generator" />
        </div>
    );
}
