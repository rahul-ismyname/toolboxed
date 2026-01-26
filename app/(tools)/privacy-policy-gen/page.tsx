import { PrivacyPolicyGenerator } from '@/components/tools/utility/PrivacyPolicyGenerator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Privacy Policy Generator | GDPR Ready Template',
    description: 'Create a standard privacy policy for your website or app in seconds. Free, simple, and ready to use.',
    keywords: ['privacy policy generator', 'free privacy policy', 'gdpr template', 'legal disclaimer generator'],
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <TitleSection
                    title="Privacy Policy Generator"
                    description="Protect your business with a standard data policy."
                />

                <PrivacyPolicyGenerator />
            </div>

            <ToolContent slug="privacy-policy-gen" />
        </div>
    );
}
