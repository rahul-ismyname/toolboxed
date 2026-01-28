'use client';

import { useEffect } from 'react';
import { useUserPersistence } from '@/hooks/use-user-persistence';

interface ToolTrackerProps {
    slug: string;
}

export function ToolTracker({ slug }: ToolTrackerProps) {
    const { addRecent } = useUserPersistence();

    useEffect(() => {
        if (slug) {
            addRecent(slug);
        }
    }, [slug, addRecent]);

    return null;
}
