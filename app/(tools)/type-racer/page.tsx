
import React from 'react';
import { Metadata } from 'next';
import { ToolContent } from '@/components/tools/ToolContent';
import { TypeRacer } from '@/components/tools/developer/TypeRacer';

// Force HMR update
export const metadata: Metadata = {
    title: 'Type Racer Game | Toolboxed',
    description: 'Test your typing speed in a race against bots. Improve your WPM with programming quotes.',
};

export default function TypeRacerPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-12">
                <TypeRacer />
            </div>

            <ToolContent slug="type-racer" />
        </div>
    );
}
