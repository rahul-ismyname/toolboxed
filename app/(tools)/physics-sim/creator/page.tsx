import { Metadata } from 'next';
import { PhysicsSimWrapper } from '@/components/tools/utility/PhysicsSimWrapper';
import { ToolContent } from '@/components/tools/ToolContent';
import { BackButton } from '@/components/shared/BackButton';
import { toolContentData } from '@/config/tool-content';
import { getCombinedTitle } from '@/lib/i18n';

export const metadata: Metadata = {
    title: 'Creative Workshop - Physics Simulator',
    description: 'Design and build complex machines and assemblies for the physics simulator.',
};

export default function CreatorPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 mb-12">
                <PhysicsSimWrapper variant="creator" />
            </div>

            <ToolContent slug="physics-sim" />
        </div>
    );
}
